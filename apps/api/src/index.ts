import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import Redis from "ioredis";
import { Index } from "@upstash/vector";
import { desc } from "drizzle-orm";
import { db } from "./db";
import * as schema from "./db/schema";

dotenv.config();

const fastify = Fastify({ logger: true });

const env = {
  port: Number.parseInt(process.env.PORT ?? "3001", 10),
  redisUrl: process.env.REDIS_URL,
  geminiApiKey: process.env.GEMINI_API_KEY,
  vectorUrl: process.env.UPSTASH_VECTOR_REST_URL,
  vectorToken: process.env.UPSTASH_VECTOR_REST_TOKEN,
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
    email: "vance@neurolearn.ai",
    status: "Active",
    sentiment: "Positive",
    location: "Module A",
    lastActive: new Date(),
  },
  {
    id: 2,
    name: "Sloane Reyes",
    email: "reyes.s@neurolearn.ai",
    status: "Pending",
    sentiment: "Neutral",
    location: "Module B",
    lastActive: new Date(),
  },
];

const getSystemInstruction = (context: string) => `
You are NeuroLearn AI, a non-partisan specialized intelligence assistant.
Provide accurate, balanced, factual information help.

Rules:
1. Never endorse a candidate or party.
2. Keep answers concise and practical.
3. Prefer registration, deadlines, voting access, and official process information.
4. If uncertain, direct users to official election sources such as vote.gov or state sites.
5. Avoid inflammatory rhetoric.

Useful app sections:
- Timeline for milestones
- Voter Guide for preparation
- Simulations for scenarios
- Deep Dives for issue comparisons

Relevant context:
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

fastify.register(cors, { origin: true });
fastify.register(rateLimit, { max: 100, timeWindow: "1 minute" });

fastify.get("/health", async () => ({
  status: "ok",
  aiConfigured: Boolean(genAI),
  vectorConfigured: Boolean(vectorIndex),
  cacheConfigured: Boolean(redis),
  timestamp: new Date().toISOString(),
}));

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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: getSystemInstruction(ragContext),
    });

    const chat = model.startChat({ history: history ?? [] });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    if (redis) {
      await redis.set(cacheKey, text, "EX", 3600).catch((error) => {
        fastify.log.warn({ error }, "Redis cache set failed");
      });
    }

    return { text, cached: false };
  } catch (error) {
    fastify.log.error(error);
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: "Invalid request body", details: error.errors });
    }
    return reply.status(500).send({ error: "Internal server error" });
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
    return [{ id: Date.now(), ...(request.body as Record<string, unknown>) }];
  }
});

fastify.get("/updates", async () => {
  if (!genAI) {
    return fallbackUpdates;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 4 realistic, non-partisan intelligence portal updates.
Return only valid JSON as an array of objects with:
title, category, time, urgent, description, icon.`;

    const result = await model.generateContent(prompt);
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
    fastify.log.info(`NeuroLearn AI API running on http://localhost:${env.port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

void start();
