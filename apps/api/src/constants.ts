/**
 * Widely available Gemini models in order of preference.
 * 1.5 Flash is the most accessible (low latency, high quota)
 * 1.5 Pro is for complex reasoning
 * 1.0 Pro is the stable legacy baseline
 */
export const AVAILABLE_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro"
] as const;

export type AvailableModel = (typeof AVAILABLE_MODELS)[number];
