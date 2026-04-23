"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatAssistant = ({ inline = false }: { inline?: boolean }) => {
  const { isChatOpen, toggleChat, messages, addMessage } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: inputValue };
    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue, history }),
      });

      const data = await response.json();
      if (data.text) {
        addMessage({ role: 'model', text: data.text });
      } else {
        addMessage({ role: 'model', text: 'I apologize, but I encountered an error. Please try again.' });
      }
    } catch (error) {
      console.error('Chat Error:', error);
      addMessage({ role: 'model', text: 'Connection lost. Please ensure the API is running.' });
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
    <div className={`card flex flex-col overflow-hidden ${inline ? 'w-full h-[700px]' : 'fixed bottom-6 right-6 w-[400px] h-[560px] z-50'}`}
      style={{ boxShadow: inline ? 'none' : '0 8px 40px rgba(0,0,0,0.5)' }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>ElectIQ Assistant</div>
            <div className="flex items-center gap-1.5">
              <div className="glow-dot" style={{ width: 4, height: 4 }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>Online</span>
            </div>
          </div>
        </div>
        {!inline && (
          <button onClick={toggleChat} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" style={{ color: 'var(--color-text-tertiary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--color-accent-glow)', border: '1px solid rgba(66, 133, 244, 0.15)' }}
            >
              <span className="text-2xl">👋</span>
            </motion.div>
            <p className="text-sm mb-1 font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Hello! I&apos;m your ElectIQ assistant.
            </p>
            <p className="text-xs mb-6" style={{ color: 'var(--color-text-tertiary)' }}>
              Ask me anything about the U.S. election process.
            </p>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => { setInputValue(s); }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'rounded-2xl rounded-br-md'
                : 'rounded-2xl rounded-bl-md'
            }`}
              style={{
                background: m.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface-overlay)',
                color: m.role === 'user' ? '#fff' : 'var(--color-text-secondary)',
                border: m.role === 'user' ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5" style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}>
              <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ background: 'var(--color-text-tertiary)' }} />
              <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ background: 'var(--color-text-tertiary)' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-text-tertiary)' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about voter ID, deadlines..."
            className="w-full rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none transition-all"
            style={{
              background: 'var(--color-surface-overlay)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
          Verified Non-Partisan Intelligence • Powered by Gemini
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
          className="fixed bottom-24 right-6 lg:bottom-6 w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
          style={{ 
            background: 'var(--gradient-brand)', 
            boxShadow: '0 4px 20px rgba(66, 133, 244, 0.35)',
            zIndex: 'var(--z-fixed-overlay)'
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
