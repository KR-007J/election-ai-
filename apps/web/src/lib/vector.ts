import { Index } from "@upstash/vector";

export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL || "https://mock.upstash.io",
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || "mock-token",
});
