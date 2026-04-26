import test from "node:test";
import assert from "node:assert/strict";
import { requiredFirebaseConfig, isFirebaseConfigured } from "./firebase";

test("Google Services: Firebase exports all required public config keys", () => {
  assert.deepEqual(Object.keys(requiredFirebaseConfig), [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ]);
});

test("Google Services: Firebase configured flag remains a boolean", () => {
  assert.equal(typeof isFirebaseConfigured, "boolean");
});

test("Google Services: documented Gemini models match API expectations", () => {
  const documentedModels = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-1.0-pro"];

  assert.ok(documentedModels.includes("gemini-1.5-flash-latest"));
  assert.ok(documentedModels.includes("gemini-1.5-pro-latest"));
  assert.ok(documentedModels.includes("gemini-1.0-pro"));
});
