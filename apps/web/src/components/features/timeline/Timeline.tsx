"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTimelineEvents } from "@/actions/electionData";

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
  pre: { bg: "rgba(52, 168, 83, 0.08)", text: "#4ade80", dot: "#34a853", border: "rgba(52, 168, 83, 0.2)" },
  primary: { bg: "rgba(251, 188, 4, 0.08)", text: "#fbbf24", dot: "#fbbc04", border: "rgba(251, 188, 4, 0.2)" },
  general: { bg: "rgba(66, 133, 244, 0.08)", text: "#60a5fa", dot: "#4285f4", border: "rgba(66, 133, 244, 0.2)" },
  post: { bg: "rgba(168, 85, 247, 0.08)", text: "#c084fc", dot: "#a855f7", border: "rgba(168, 85, 247, 0.2)" },
};

const TimelineCard = ({
  item,
  activeId,
  setActiveId,
  index,
}: {
  item: TimelineItem;
  activeId: number | null;
  setActiveId: (id: number | null) => void;
  index: number;
}) => {
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
      <div className="flex w-11 shrink-0 flex-col items-center">
        <div className="h-6 w-px bg-gradient-to-b from-transparent to-[var(--color-border)]" />
        <motion.div
          className="z-10 h-4 w-4 shrink-0 rounded-full border-4"
          style={{
            background: colors.dot,
            borderColor: "var(--color-surface)",
            boxShadow: `0 0 20px ${colors.dot}80`,
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.2, type: "spring", stiffness: 300 }}
        />
        <div className="w-px flex-1 bg-[var(--color-border)]" />
      </div>

      <motion.div
        onClick={() => setActiveId(isActive ? null : item.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveId(isActive ? null : item.id);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        aria-controls={`timeline-details-${item.id}`}
        aria-label={`Expand details for ${item.title}`}
        className="card mb-6 flex-1 cursor-pointer focus:outline-2 focus:outline-primary"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {item.phaseLabel}
            </span>
            <span className="ml-auto text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              {item.date}
            </span>
          </div>

          <h3 className="mb-1 text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {item.title}
          </h3>

          <AnimatePresence>
            {isActive && (
              <motion.div
                id={`timeline-details-${item.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-3 mb-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {item.description}
                </p>

                <ul className="mb-4 space-y-2">
                  {item.details.map((detail, i) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      key={i}
                      className="flex gap-3 text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <span style={{ color: "var(--color-accent)" }}>&rarr;</span>
                      {detail}
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-1 text-xs"
                      style={{
                        background: "var(--color-surface-overlay)",
                        color: "var(--color-text-tertiary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isActive && (
            <p className="mt-2 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
              Click to expand &rarr;
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Timeline = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTimelineEvents();
        setTimelineData(data);
      } catch (err) {
        console.error('Failed to load timeline:', err);
        setError('Unable to load election timeline. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    loadTimeline();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div
          className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-t-transparent mb-4"
          style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
        />
        <p className="text-slate-400">Loading election timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <span className="material-symbols-outlined text-red-400 mb-4 text-4xl">error</span>
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary px-6 py-3 rounded-xl font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (timelineData.length === 0) {
    return (
      <div className="py-20 text-center">
        <span className="material-symbols-outlined text-yellow-400 mb-4 text-4xl">info</span>
        <p className="text-slate-400">No timeline events available.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-3xl py-4">
      <div className="absolute top-6 bottom-6 left-[21px] w-[2px] bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-blue-500/40 blur-[2px]" />

      <div className="space-y-2">
        {timelineData.map((item, i) => (
          <TimelineCard key={item.id} item={item} index={i} activeId={activeId} setActiveId={setActiveId} />
        ))}
      </div>

      {/* Sources and Verification */}
      <div className="mt-12 rounded-xl bg-blue-500/10 border border-blue-500/20 p-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-400 mt-0.5">verified</span>
          <div>
            <h4 className="text-sm font-bold text-blue-400 mb-2">Information Sources</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Timeline information is compiled from official election authorities and verified non-partisan sources.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Federal Election Commission</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">State Election Boards</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Verified News Sources</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
