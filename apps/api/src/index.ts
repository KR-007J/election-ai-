import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import Redis from 'ioredis';
import { Index } from '@upstash/vector';

dotenv.config();

const fastify = Fastify({ logger: true });

// Redis for Semantic Caching
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});

redis.on('error', (err) => {
  fastify.log.warn('Redis Connection Error: ' + err.message);
});

// Upstash Vector for RAG
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL || 'https://mock.upstash.io',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || 'mock-token',
});

// Register Plugins
fastify.register(cors, { origin: '*' });
fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ChatSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() }))
  })).optional(),
});

const getSystemInstruction = (context: string) => `
You are ElectIQ, a non-partisan AI election assistant.
Your goal is to provide accurate, unbiased, and factual information about the U.S. election process, candidates, and voting requirements.

CRITICAL GUIDELINES:
1. NEVER express a political preference or endorse any candidate or party.
2. If asked for an opinion on a candidate, provide balanced information based on their official platforms and public records.
3. Prioritize information about deadlines, registration, and polling locations.
4. You can guide users to specific app sections: "Timeline" for milestones, "Voter Guide" for prep, "Simulations" for interactive scenarios, and "Deep Dives" for policy comparisons.
5. Use clear, accessible language.
6. If you don't know an answer for certain, suggest checking official government sources like vote.gov or state election websites.
7. Keep responses concise and helpful.
8. Avoid engaging in inflammatory or divisive rhetoric.

CONTEXT TO USE FOR ANSWERING (if relevant):
${context}
`;

import { db } from './db';
import * as schema from './db/schema';
import { desc } from 'drizzle-orm';

fastify.post('/chat', async (request, reply) => {
  try {
    const { message, history } = ChatSchema.parse(request.body);

    const cacheKey = `chat:cache:${Buffer.from(message).toString('base64').slice(0, 50)}`;
    let cachedResponse = null;
    try {
      cachedResponse = await redis.get(cacheKey);
    } catch (e) {
      fastify.log.warn('Redis Cache Get Failed: ' + e);
    }

    if (cachedResponse) {
      fastify.log.info('Cache hit for: ' + message);
      return { text: cachedResponse, cached: true };
    }

    let ragContext = "";
    try {
      if (process.env.UPSTASH_VECTOR_REST_URL) {
        const queryResult = await vectorIndex.query({
          data: message,
          topK: 3,
          includeMetadata: true,
        });

        if (queryResult && queryResult.length > 0) {
          ragContext = queryResult
            .map(match => match.metadata?.text || '')
            .filter(text => text)
            .join('\n\n');
        }
      }
    } catch (e) {
      fastify.log.warn('Vector Search Failed: ' + e);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: getSystemInstruction(ragContext)
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    try {
      await redis.set(cacheKey, text, 'EX', 3600);
    } catch (e) {
      fastify.log.warn('Redis Cache Set Failed: ' + e);
    }

    return { text, cached: false };
  } catch (error) {
    fastify.log.error(error);
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: 'Invalid request body', details: error.errors });
    }
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

fastify.get('/voters', async () => {
  try {
    return await db.select().from(schema.voters).orderBy(desc(schema.voters.lastActive));
  } catch (e) {
    fastify.log.error(e);
    return [
      { id: 1, name: "Arthur Vance", email: "vance@electionassistance.gov", status: "Registered", sentiment: "Positive", location: "District 12", lastActive: new Date() },
      { id: 2, name: "Sloane Reyes", email: "reyes.s@electionassistance.gov", status: "Pending", sentiment: "Neutral", location: "District 4", lastActive: new Date() },
    ];
  }
});

fastify.post('/voters', async (request) => {
  const voter = request.body as any;
  try {
    return await db.insert(schema.voters).values(voter).returning();
  } catch (e) {
    fastify.log.error(e);
    return { ...voter, id: Math.random() };
  }
});

fastify.get('/updates', async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 4 realistic, official-style election bulletins for a "Voter Assistance Portal". 
    Focus on registration deadlines, polling location updates, early voting dates, and non-partisan voter education info. 
    Include specific details like district numbers or office locations. 
    Format ONLY as a JSON array of objects with keys: title, description, time (e.g. "2 mins ago"), and icon (material symbol name).`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    fastify.log.error(e);
    return [
      { title: "Mass SMS Campaign Completed", description: "Target: District 12 | 84% Read Rate", time: "2 mins ago", icon: "mail" },
      { title: "Anomalous Voter Flux Detected", description: "Sector 4, Zone B | High Variance", time: "15 mins ago", icon: "report" },
    ];
  }
});

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 ElectIQ API running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
