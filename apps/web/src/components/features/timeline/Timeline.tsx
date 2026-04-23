"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimelineEvents } from '@/actions/electionData';

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  description: string;
  details: string[];
  tags: string[];
  phase: string;
  phaseLabel: string;
}

const phaseColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  pre: { bg: 'rgba(52, 168, 83, 0.08)', text: '#4ade80', dot: '#34a853', border: 'rgba(52, 168, 83, 0.2)' },
  primary: { bg: 'rgba(251, 188, 4, 0.08)', text: '#fbbf24', dot: '#fbbc04', border: 'rgba(251, 188, 4, 0.2)' },
  general: { bg: 'rgba(66, 133, 244, 0.08)', text: '#60a5fa', dot: '#4285f4', border: 'rgba(66, 133, 244, 0.2)' },
  post: { bg: 'rgba(168, 85, 247, 0.08)', text: '#c084fc', dot: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
};

const TimelineCard = ({ item, activeId, setActiveId, index }: { item: TimelineItem; activeId: number | null; setActiveId: (id: number | null) => void; index: number }) => {
  const isActive = activeId === item.id;
  const colors = phaseColors[item.phase] || phaseColors.post;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-6"
    >
      {/* Timeline Line & Dot */}
      <div className="flex flex-col items-center w-11 shrink-0">
        <div className="w-px h-6 bg-gradient-to-b from-transparent to-[var(--color-border)]" />
        <motion.div
          className="w-4 h-4 rounded-full z-10 shrink-0 border-4"
          style={{ 
            background: colors.dot, 
            borderColor: 'var(--color-surface)',
            boxShadow: `0 0 20px ${colors.dot}80` 
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 300 }}
        />
        <div className="w-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* Card */}
      <motion.div
        onClick={() => setActiveId(isActive ? null : item.id)}
        className="flex-1 card cursor-pointer mb-6"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {item.phaseLabel}
            </span>
            <span className="text-xs ml-auto" style={{ color: 'var(--color-text-tertiary)' }}>{item.date}</span>
          </div>

          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="text-sm leading-relaxed mt-3 mb-4" style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>

                <ul className="space-y-2 mb-4">
                  {item.details.map((detail, i) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      key={i}
                      className="flex gap-3 text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span style={{ color: 'var(--color-accent)' }}>→</span>
                      {detail}
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isActive && (
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>Click to expand →</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Timeline = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);

  React.useEffect(() => {
    getTimelineEvents().then(setTimelineData);
  }, []);

  if (timelineData.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 relative">
      {/* Background Glow Path */}
      <div className="absolute left-[21px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-blue-500/40 blur-[2px]" />
      
      <div className="space-y-2">
        {timelineData.map((item, i) => (
          <TimelineCard key={item.id} item={item} index={i} activeId={activeId} setActiveId={setActiveId} />
        ))}
      </div>
    </div>
  );
};
