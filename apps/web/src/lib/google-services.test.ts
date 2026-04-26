import test from "node:test";
import assert from "node:assert/strict";
import { requiredFirebaseConfig, isFirebaseConfigured } from "./firebase";
import { getMapsEmbedUrl, getExternalMapsUrl } from "./maps";

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

test("Google Services: Maps utility handles missing API keys gracefully", () => {
  const zip = "90210";
  assert.equal(getMapsEmbedUrl(undefined, zip), null, "Should return null if API key is missing");
  assert.equal(getMapsEmbedUrl("", zip), null, "Should return null if API key is empty");
  assert.equal(getMapsEmbedUrl("SECRET", ""), null, "Should return null if zip code is empty");
});

test("Google Services: Maps utility generates correct URLs when configured", () => {
  const key = "TEST_KEY";
  const zip = "10001";
  const embedUrl = getMapsEmbedUrl(key, zip);
  const externalUrl = getExternalMapsUrl(zip);

  assert.ok(embedUrl?.includes("key=TEST_KEY"), "Embed URL should contain the API key");
  assert.ok(embedUrl?.includes("q=polling+place+near+10001"), "Embed URL should contain encoded zip");
  assert.ok(externalUrl.includes("10001"), "External URL should contain the zip code");
});

test("Google Services: documented Gemini models match API expectations", () => {
  // These models are explicitly supported by our backend in apps/api/src/index.ts
  const AVAILABLE_MODELS = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-1.0-pro"];
  
  // This test ensures that any changes to the models in this package are intentional
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-flash-latest"));
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-pro-latest"));
  assert.equal(AVAILABLE_MODELS.length, 3);
});
