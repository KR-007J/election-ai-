import test from "node:test";
import assert from "node:assert/strict";
import { requiredFirebaseConfig, isFirebaseConfigured } from "./firebase";
import { getMapsEmbedUrl, getExternalMapsUrl, isPlausibleApiKey } from "./maps";
// Use the actual source of truth from the API package
import { AVAILABLE_MODELS } from "../../../api/src/constants";

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

test("Google Services: Maps utility identifies invalid API keys", () => {
  assert.equal(isPlausibleApiKey(undefined), false);
  assert.equal(isPlausibleApiKey(""), false);
  assert.equal(isPlausibleApiKey("short_key"), false);
  assert.equal(isPlausibleApiKey("not_a_google_key_even_if_long_enough_12345"), false);
  assert.equal(isPlausibleApiKey("AIza_valid_looking_key_but_just_for_testing"), true);
});

test("Google Services: Maps utility handles misconfigured keys gracefully", () => {
  const zip = "90210";
  assert.equal(getMapsEmbedUrl("invalid_key", zip), null, "Should return null if key format is wrong");
  assert.equal(getMapsEmbedUrl(undefined, zip), null, "Should return null if key is missing");
});

test("Google Services: Maps utility generates correct URLs when configured", () => {
  const key = "AIza_TEST_KEY_LONG_ENOUGH_FOR_VALIDATION";
  const zip = "10001";
  const embedUrl = getMapsEmbedUrl(key, zip);
  const externalUrl = getExternalMapsUrl(zip);

  assert.ok(embedUrl?.includes("key=AIza"), "Embed URL should contain the API key");
  assert.ok(embedUrl?.includes("q=polling+place+near+10001"), "Embed URL should contain encoded zip");
  assert.ok(externalUrl.includes("10001"), "External URL should contain the zip code");
});

test("Google Services: documented Gemini models match actual API constants", () => {
  // This test now imports directly from the API package constants
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-flash-latest"));
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-pro-latest"));
  assert.ok(AVAILABLE_MODELS.includes("gemini-1.0-pro"));
  assert.equal(AVAILABLE_MODELS.length, 3);
});
