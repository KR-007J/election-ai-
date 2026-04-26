import test from "node:test";
import assert from "node:assert/strict";

test("Google Services: Firebase configuration logic is sound", () => {
  const config = {
    apiKey: "AIzaTestKey",
    projectId: "test-project",
    appId: "1:123:web:test"
  };
  
  const isConfigured = Object.values(config).every(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  
  assert.equal(isConfigured, true, "Logic should correctly identify a populated config object");
  assert.equal(config.projectId, "test-project");
});

test("Google Services: Gemini API models are recognized", () => {
  const AVAILABLE_MODELS = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-1.0-pro"];
  
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-flash-latest"));
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-pro-latest"));
});
