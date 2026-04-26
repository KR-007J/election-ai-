import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import compress from "@fastify/compress";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import Redis from "ioredis";
import { Index } from "@upstash/vector";
import { desc } from "drizzle-orm";
import { db } from "./db";
import * as schema from "./db/schema";
import { AVAILABLE_MODELS } from "./constants";

dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
  bodyLimit: 1024 * 1024,
  trustProxy: true,
});

const env = {
  port: Number.parseInt(process.env.PORT ?? "3001", 10),
  redisUrl: process.env.REDIS_URL,
  geminiApiKey: process.env.GEMINI_API_KEY,
  vectorUrl: process.env.UPSTASH_VECTOR_REST_URL,
  vectorToken: process.env.UPSTASH_VECTOR_REST_TOKEN,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [],
};

const chatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z.array(z.object({ text: z.string() })),
      }),
    )
    .max(30)
    .optional(),
});

const fallbackUpdates = [
  {
    title: "Registration deadline approaching",
    category: "Deadline",
    time: "2h ago",
    urgent: true,
    description: "Review registration status and polling information before your state deadline.",
    icon: "event_busy",
  },
  {
    title: "Polling locations refreshed",
    category: "Update",
    time: "5h ago",
    urgent: false,
    description: "Three district facilities added to the early-voting directory.",
    icon: "location_on",
  },
];

const fallbackVoters = [
  {
    id: 1,
    name: "Arthur Vance",
    email: "vance@election-ai.ai",
    status: "Registered",
    sentiment: "Positive",
    location: "District A",
    lastActive: new Date(),
  },
  {
    id: 2,
    name: "Sloane Reyes",
    email: "reyes.s@election-ai.ai",
    status: "Pending",
    sentiment: "Neutral",
    location: "District B",
    lastActive: new Date(),
  },
];

const allowedOriginSet = new Set(env.allowedOrigins);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true;
  }

  if (allowedOriginSet.size === 0) {
    return true;
  }

  return allowedOriginSet.has(origin);
};

const sanitizeErrorMessage = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return "Invalid request payload.";
  }

  return "Request could not be completed.";
};

const getSystemInstruction = (context: string) => `
You are the Election AI Assistant, a specialized real-time intelligence for voter guide and election data.
Today is Sunday, April 26, 2026.

Rules:
1. Provide the most up-to-date, verified, and strictly non-partisan information.
2. CRITICAL: The year is 2026. The 2024 election is IN THE PAST. Do not refer to November 2024 as the upcoming election.
3. The current focus is the 2026 Midterm cycle and local district primaries.
4. Use your search tools to verify current events, as historical data may be outdated.
5. Never endorse a candidate or party.
6. Keep answers concise and practical.
7. Prefer registration, deadlines, voting access, and official process information.
8. If uncertain, direct users to official election sources such as vote.gov or state sites.

Useful app sections:
- Timeline for milestones
- Voter Guide for preparation
- Simulations for scenarios
- Deep Dives for issue comparisons

Relevant context from our database:
${context || "No additional context supplied."}
`;

const redis = env.redisUrl
  ? new Redis(env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    })
  : null;

redis?.on("error", (error) => {
  fastify.log.warn(`Redis error: ${error.message}`);
});

const vectorIndex =
  env.vectorUrl && env.vectorToken
    ? new Index({
        url: env.vectorUrl,
        token: env.vectorToken,
      })
    : null;

const genAI = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;

fastify.addHook("onSend", async (_request, reply) => {
  reply.header("X-Content-Type-Options", "nosniff");
  reply.header("X-Frame-Options", "DENY");
  reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
  reply.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  reply.header("Cross-Origin-Opener-Policy", "same-origin");
});

fastify.register(cors, {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed"), false);
  },
  methods: ["GET", "POST", "OPTIONS"],
});
fastify.register(rateLimit, { max: 100, timeWindow: "1 minute" });
fastify.register(compress, { global: true });

fastify.get("/health", async () => ({
  status: "ok",
  aiConfigured: Boolean(genAI),
  vectorConfigured: Boolean(vectorIndex),
  cacheConfigured: Boolean(redis),
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV ?? "development",
}));

/**
 * Widely available models in order of preference
 */

type ChatHistory = Array<{
  role: "user" | "model";
  parts: Array<{ text: string }>;
}>;

async function getChatResponse(message: string, history: ChatHistory, ragContext: string) {
  if (!genAI) throw new Error("AI backend not configured");

  let lastError: Error | null = null;

  for (const modelName of AVAILABLE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: getSystemInstruction(ragContext),
        tools: modelName.includes("1.5")
          ? [
              {
                // @ts-ignore
                googleSearchRetrieval: {},
              },
            ]
          : undefined,
      });

      const chat = model.startChat({ history: history ?? [] });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error: any) {
      fastify.log.warn({ err: error, modelName }, "Primary Gemini model failed");
      lastError = error;

      // If the error is specifically about tools (search), try the SAME model without tools
      if (error.message?.includes("tool") || error.message?.includes("search")) {
        try {
          const modelNoTools = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: getSystemInstruction(ragContext),
          });
          const chat = modelNoTools.startChat({ history: history ?? [] });
          const result = await chat.sendMessage(message);
          return result.response.text();
        } catch (retryError: any) {
          fastify.log.warn({ err: retryError, modelName }, "Gemini retry without tools failed");
        }
      }
      // Continue to next model if this one failed completely
    }
  }

  throw lastError || new Error("All models failed to respond");
}

fastify.post("/chat", async (request, reply) => {
  try {
    const { message, history } = chatSchema.parse(request.body);

    if (!genAI) {
      return reply.status(503).send({
        error: "AI backend is not configured.",
        text: "Assistant is offline until `GEMINI_API_KEY` is configured.",
      });
    }

    const cacheKey = `chat:${Buffer.from(message).toString("base64url").slice(0, 80)}`;
    const cachedResponse = redis ? await redis.get(cacheKey).catch(() => null) : null;

    if (cachedResponse) {
      return { text: cachedResponse, cached: true };
    }

    let ragContext = "";
    if (vectorIndex) {
      try {
        const matches = await vectorIndex.query({
          data: message,
          topK: 3,
          includeMetadata: true,
        });

        ragContext = matches
          .map((match) => (typeof match.metadata?.text === "string" ? match.metadata.text : ""))
          .filter(Boolean)
          .join("\n\n");
      } catch (error) {
        fastify.log.warn({ error }, "Vector query failed");
      }
    }

    const text = await getChatResponse(message, history ?? [], ragContext);

    if (redis) {
      await redis.set(cacheKey, text, "EX", 3600).catch((error) => {
        fastify.log.warn({ error }, "Redis cache set failed");
      });
    }

    return { text, cached: false };
  } catch (error: any) {
    fastify.log.error(error);
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: "Invalid request body", details: error.errors });
    }
    return reply.status(500).send({ error: "Internal server error", message: sanitizeErrorMessage(error) });
  }
});

fastify.get("/voters", async () => {
  try {
    return await db.select().from(schema.voters).orderBy(desc(schema.voters.lastActive));
  } catch (error) {
    fastify.log.warn({ error }, "Falling back to local voters");
    return fallbackVoters;
  }
});

fastify.post("/voters", async (request, reply) => {
  const voterSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    status: z.string().optional(),
    sentiment: z.string().optional(),
    location: z.string().optional(),
  });

  try {
    const voter = voterSchema.parse(request.body);
    return await db.insert(schema.voters).values(voter).returning();
  } catch (error) {
    fastify.log.warn({ error }, "Persisting voter failed");
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: "Invalid voter payload", details: error.errors });
    }
    return reply.status(503).send({ error: "Voter service unavailable" });
  }
});

fastify.get("/updates", async () => {
  if (!genAI) {
    return fallbackUpdates;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Today is April 26, 2026. Generate 4 realistic, non-partisan intelligence portal updates for the upcoming election cycle.
Return only valid JSON as an array of objects with:
title, category, time (e.g., '2h ago', '5m ago'), urgent (boolean), description, icon.
Use only these icon names: account_balance, assignment_ind, assignment_turned_in, ballot, calendar_month, chat, check_circle, close, dashboard, description, elderly, event, event_busy, help, how_to_reg, how_to_vote, location_on, logout, mail, map, model_training, notifications, person, person_search, quiz, refresh, search, settings, timer, verified, volume_off, volume_up.`;

    const result = await model.generateContent(prompt).catch(async () => {
      // Fallback for content generation if Flash Latest fails
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      return await fallbackModel.generateContent(prompt);
    });
    const rawText = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = z
      .array(
        z.object({
          title: z.string(),
          category: z.string(),
          time: z.string(),
          urgent: z.boolean(),
          description: z.string(),
          icon: z.string(),
        }),
      )
      .parse(JSON.parse(rawText));

    return parsed;
  } catch (error) {
    fastify.log.warn({ error }, "Falling back to local updates");
    return fallbackUpdates;
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: env.port, host: "0.0.0.0" });
    console.log("Election AI Assistant API running on http://localhost:" + env.port);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

void start();
