"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { buildApiUrl } from "@/lib/api";
import { initAnalytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

/**
 * ChatAssistant component provides an AI-powered conversational interface 
 * using the Gemini API. It includes offline fallbacks and accessibility features.
 */
export const ChatAssistant = ({ inline = false }: { inline?: boolean }) => {
  const { isChatOpen, toggleChat, messages, addMessage } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getOfflineResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('register') || lowerQuery.includes('registration')) {
      return "To register to vote, visit your state's election website or Vote.org. You'll need proof of residency and ID. Many states allow online registration.";
    }
    if (lowerQuery.includes('id') || lowerQuery.includes('identification')) {
      return "Voter ID requirements vary by state. Most states require some form of ID, but 8 states have no requirement. Check your state's election office for specifics.";
    }
    if (lowerQuery.includes('when') || lowerQuery.includes('election') || lowerQuery.includes('date')) {
      return "The next major election events are the 2026 Midterms. Primary season is currently underway. Check the Timeline section for specific district milestones.";
    }
    return "I'm currently offline, but I can help with basic voting information. For detailed assistance, please ensure the AI service is configured properly.";
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: "user" as const, text: inputValue };
    addMessage(userMessage);
    setInputValue("");
    setIsLoading(true);

    // Track chat engagement
    const analytics = await initAnalytics();
    if (analytics) {
      logEvent(analytics, 'chat_message_sent', { length: inputValue.length });
    }

    try {
      const history = messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      }));

      // Add context from user's progress
      const quizResults = localStorage.getItem('election-quiz-results');
      let contextMessage = "";
      if (quizResults) {
        const parsed = JSON.parse(quizResults);
        contextMessage = `User has completed the voter quiz with profile: ${JSON.stringify(parsed.profile)}. `;
      }

      const response = await fetch(buildApiUrl("/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contextMessage + inputValue,
          history
        }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        addMessage({ role: "model", text: data.text });
      } else {
        // Try offline fallback
        const offlineResponse = getOfflineResponse(inputValue);
        addMessage({
          role: "model",
          text: offlineResponse,
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      // Enhanced error handling with offline fallback
      const offlineResponse = getOfflineResponse(inputValue);
      addMessage({
        role: "model",
        text: offlineResponse,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "How do I register to vote?",
    "When is the next election?",
    "What ID do I need to vote?",
  ];

  const content = (
    <div
      className={`card flex flex-col overflow-hidden ${inline ? "w-full h-[700px]" : "fixed bottom-6 right-6 z-50 h-[560px] w-[400px]"}`}
      style={{ boxShadow: inline ? "none" : "0 8px 40px rgba(0,0,0,0.5)" }}
    >
      <div
        className="flex items-center justify-between p-4 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              ElectIQ Assistant
            </div>
            <div className="flex items-center gap-1.5">
              <div className="glow-dot" style={{ width: 4, height: 4 }} />
              <span className="text-[10px] font-medium" style={{ color: "var(--color-success)" }}>
                Online
              </span>
            </div>
          </div>
        </div>
        {!inline && (
          <button
            onClick={toggleChat}
            aria-label="Close chat assistant"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5 focus:outline-2 focus:outline-primary"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-grow space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "var(--color-accent-glow)", border: "1px solid rgba(66, 133, 244, 0.15)" }}
            >
              <span className="text-2xl">Hi</span>
            </motion.div>
            <p className="mb-1 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
              Hello! I&apos;m your ElectIQ assistant.
            </p>
            <p className="mb-6 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              Ask me anything about the U.S. election process.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => {
                      setInputValue(suggestion);
                    }}
                    aria-label={`Use suggestion: ${suggestion}`}
                    className="rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 focus:outline-2 focus:outline-primary"
                    style={{
                      background: "var(--color-surface-overlay)",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <motion.div
            key={`${message.role}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                message.role === "user" ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"
              }`}
              style={{
                background: message.role === "user" ? "var(--color-accent)" : "var(--color-surface-overlay)",
                color: message.role === "user" ? "#fff" : "var(--color-text-secondary)",
                border: message.role === "user" ? "none" : "1px solid var(--color-border)",
              }}
            >
              {message.text}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="flex gap-1.5 rounded-2xl rounded-bl-md px-4 py-3"
              style={{ background: "var(--color-surface-overlay)", border: "1px solid var(--color-border)" }}
            >
              <div className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" style={{ background: "var(--color-text-tertiary)" }} />
              <div className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" style={{ background: "var(--color-text-tertiary)" }} />
              <div className="h-2 w-2 animate-bounce rounded-full" style={{ background: "var(--color-text-tertiary)" }} />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 p-4" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSend()}
            placeholder="Ask about voter ID, deadlines..."
            aria-label="Type your question for the AI assistant"
            className="w-full rounded-xl py-3 pl-4 pr-12 text-sm transition-all focus:outline-2 focus:outline-primary"
            style={{
              background: "var(--color-surface-overlay)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white transition-all disabled:cursor-not-allowed disabled:opacity-30 focus:outline-2 focus:outline-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
          Verified Non-Partisan Intelligence | Powered by Gemini
        </p>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <AnimatePresence>
      {isChatOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {content}
        </motion.div>
      ) : (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          aria-label="Open AI chat assistant"
          className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all lg:bottom-6 focus:outline-2 focus:outline-white"
          style={{
            background: "var(--gradient-brand)",
            boxShadow: "0 4px 20px rgba(66, 133, 244, 0.35)",
            zIndex: "var(--z-fixed-overlay)",
          }}
        >
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
