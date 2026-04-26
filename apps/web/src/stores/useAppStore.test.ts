import test from "node:test";
import assert from "node:assert/strict";
import { useAppStore } from "./useAppStore";

test("app store updates active section", () => {
  useAppStore.setState({ activeSection: "home", isChatOpen: false, messages: [] });
  useAppStore.getState().setActiveSection("quiz");
  assert.equal(useAppStore.getState().activeSection, "quiz");
});

test("app store toggles chat visibility", () => {
  useAppStore.setState({ activeSection: "home", isChatOpen: false, messages: [] });
  useAppStore.getState().toggleChat();
  assert.equal(useAppStore.getState().isChatOpen, true);
});

test("app store appends messages", () => {
  useAppStore.setState({ activeSection: "home", isChatOpen: false, messages: [] });
  useAppStore.getState().addMessage({ role: "user", text: "hello" });
  assert.equal(useAppStore.getState().messages.length, 1);
});
