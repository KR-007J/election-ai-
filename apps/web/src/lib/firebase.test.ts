import test from "node:test";
import assert from "node:assert/strict";
import { requiredFirebaseConfig, isFirebaseConfigured } from "./firebase";

test("firebase config exports all required public keys", () => {
  assert.deepEqual(Object.keys(requiredFirebaseConfig), [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ]);
});

test("firebase configured flag is boolean", () => {
  assert.equal(typeof isFirebaseConfigured, "boolean");
});
