import test from "node:test";
import assert from "node:assert/strict";
import { buildApiUrl, normalizeApiBaseUrl, trimTrailingSlash } from "./api";

test("trimTrailingSlash removes only trailing slashes", () => {
  assert.equal(trimTrailingSlash("https://example.com///"), "https://example.com");
  assert.equal(trimTrailingSlash("https://example.com/path"), "https://example.com/path");
});

test("normalizeApiBaseUrl accepts valid http and https urls", () => {
  assert.equal(normalizeApiBaseUrl("https://api.example.com/"), "https://api.example.com");
  assert.equal(normalizeApiBaseUrl(" http://localhost:3001/test/ "), "http://localhost:3001/test");
});

test("normalizeApiBaseUrl rejects invalid or unsafe values", () => {
  assert.equal(normalizeApiBaseUrl("javascript:alert(1)"), null);
  assert.equal(normalizeApiBaseUrl("not-a-url"), null);
  assert.equal(normalizeApiBaseUrl(""), null);
});

test("buildApiUrl appends normalized paths", () => {
  const previous = process.env.NEXT_PUBLIC_API_BASE_URL;
  process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com/";

  assert.equal(buildApiUrl("chat"), "https://api.example.com/chat");
  assert.equal(buildApiUrl("/health"), "https://api.example.com/health");

  process.env.NEXT_PUBLIC_API_BASE_URL = previous;
});
