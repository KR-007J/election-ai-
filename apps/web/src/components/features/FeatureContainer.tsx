"use client";

import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Timeline } from './timeline/Timeline';
import { VoterGuide } from './guide/VoterGuide';
import { ElectionQuiz } from './quiz/ElectionQuiz';
import { ChatAssistant } from './chat/ChatAssistant';
import { ElectionSimulations } from './simulation/ElectionSimulations';
import { PolicyDeepDive } from './guide/PolicyDeepDive';
import { AnimatePresence, motion } from 'framer-motion';

const sectionMeta: Record<string, { title: string; subtitle: string }> = {
  timeline: { title: 'Election Timeline', subtitle: 'Follow key milestones from primaries to inauguration day' },
  guide: { title: 'Voter Guide', subtitle: 'Everything you need to prepare for election day' },
  simulation: { title: 'Election Simulations', subtitle: 'Interactive scenarios and candidate projections' },
  'deep-dive': { title: 'Policy Deep Dives', subtitle: 'Detailed non-partisan breakdowns of key issues' },
  quiz: { title: 'Knowledge Challenge', subtitle: 'Test your understanding of the U.S. election process' },
  chat: { title: 'AI Assistant', subtitle: 'Get instant, non-partisan answers to any election question' },
};

export const FeatureContainer = () => {
  const { activeSection } = useAppStore();
  const meta = sectionMeta[activeSection];

  return (
    <motion.section
      key={activeSection}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pt-28 lg:pt-36 pb-32 lg:pb-24 relative safe-bottom"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative p-8 lg:p-12 rounded-[2.5rem] overflow-hidden group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-white/[0.02] border border-white/5 backdrop-blur-3xl" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" 
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
               Operational Intelligence
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest mb-6">
              <span className="text-gradient">{meta.title}</span>
            </h2>
            <p className="text-sm sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium opacity-50 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
              {meta.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeSection === 'timeline' && <Timeline />}
        {activeSection === 'guide' && <VoterGuide />}
        {activeSection === 'simulation' && <ElectionSimulations />}
        {activeSection === 'deep-dive' && <PolicyDeepDive />}
        {activeSection === 'quiz' && <ElectionQuiz />}
        {activeSection === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <ChatAssistant inline />
          </div>
        )}
      </div>
    </motion.section>
  );
};
