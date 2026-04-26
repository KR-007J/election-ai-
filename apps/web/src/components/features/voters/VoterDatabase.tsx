"use client";

import React, { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "@/components/ui/AppIcon";

import { getAdjustedCandidates, type Candidate } from "@/lib/voterLogic";

export function VoterDatabase() {
  const { setActiveSection } = useAppStore();

  // Base candidates with default alignments
  const baseCandidates: Candidate[] = React.useMemo(() => [
    { name: "Eleanor Sterling", office: "Governor", party: "Independent", alignment: 92, platform: "Climate Resilience, Educational Reform", avatar: "E", focus: "progressive" },
    { name: "Marcus Thorne", office: "Governor", party: "Federalist", alignment: 45, platform: "Infrastructure, Tech Innovation", avatar: "M", focus: "conservative" },
    { name: "Sarah Jenkins", office: "District Rep", party: "Civic Action", alignment: 78, platform: "Public Health, Housing Equity", avatar: "S", focus: "moderate" },
    { name: "David Chen", office: "District Rep", party: "Independent", alignment: 61, platform: "Small Business Support, Fiscal Transparency", avatar: "D", focus: "libertarian" },
  ], []);

  // Adjust alignments based on quiz results
  const sortedCandidates = React.useMemo(() => {
    const quizResults = typeof window !== 'undefined' ? localStorage.getItem('election-quiz-results') : null;
    return getAdjustedCandidates(baseCandidates, quizResults);
  }, [baseCandidates]);

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [activeRecord, setActiveRecord] = useState<Candidate | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const toggleCompare = (name: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(name) ? prev.filter((candidateName) => candidateName !== name) : [...prev, name].slice(-2),
    );
  };

  const modalCloseRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!activeRecord && !isComparing && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [activeRecord, isComparing]);

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="font-h1 text-4xl tracking-tight text-white">Candidate Guide</h1>
          <p className="mt-2 text-slate-400">Verified platforms and historical alignment scores for the upcoming election.</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-bold text-green-400">Non-Partisan</span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">Fact-Checked</span>
          </div>
        </div>
        <div className="flex gap-3">
          {selectedCandidates.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setIsComparing(true);
              }}
              className="rounded-xl bg-purple-500 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse"
            >
              Compare ({selectedCandidates.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveSection("quiz")}
            className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Retake Alignment Quiz
          </button>
        </div>
      </div>

      <div role="list" className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {sortedCandidates.map((candidate, index) => (
          <motion.div
            role="listitem"
            key={candidate.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-panel group relative overflow-hidden rounded-[2rem] border p-8 transition-all ${selectedCandidates.includes(candidate.name) ? "border-primary/50 bg-primary/5" : "border-white/5 bg-surface/30"
              }`}
          >
            <div className="relative z-10 flex gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl font-h1 text-primary shadow-lg transition-transform group-hover:scale-105">
                {candidate.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary">{candidate.name}</h3>
                    <p className="text-sm font-medium text-slate-500">
                      {candidate.office} | {candidate.party}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-black uppercase text-slate-600">Alignment</p>
                      <span className="text-[8px] bg-green-500/20 text-green-400 px-1 py-0.5 rounded font-bold">Verified</span>
                    </div>
                    <p className="font-h1 text-2xl text-primary" aria-label={`Alignment score: ${candidate.alignment}%`}>
                      {candidate.alignment}%
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.platform.split(", ").map((issue) => (
                      <span key={issue} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {issue}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        triggerRef.current = e.currentTarget;
                        setActiveRecord(candidate);
                      }}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase text-white transition-all hover:bg-white/10"
                    >
                      Voting Record
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(candidate.name)}
                      className={`flex-1 rounded-xl border py-3 text-[10px] font-black uppercase transition-all ${selectedCandidates.includes(candidate.name)
                          ? "border-primary bg-primary text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                        }`}
                    >
                      {selectedCandidates.includes(candidate.name) ? "Selected" : "Compare"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 -z-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-primary/5 blur-3xl" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRecord(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-surface/80 p-10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="candidate-record-title"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-3xl font-h1 text-primary">
                    {activeRecord.avatar}
                  </div>
                  <div>
                    <h2 id="candidate-record-title" className="text-2xl font-bold text-white">{activeRecord.name}</h2>
                    <p className="font-medium text-slate-500">{activeRecord.office} | Historical Record</p>
                  </div>
                </div>
                <button
                  type="button"
                  ref={modalCloseRef}
                  autoFocus
                  onClick={() => setActiveRecord(null)}
                  className="rounded-full p-2 hover:bg-white/5"
                >
                  <AppIcon name="close" className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-8">
                  <h4 className="mb-4 text-xs font-black uppercase text-primary">Key Legislation Votes</h4>
                  <div className="space-y-6">
                    {[
                      { bill: "Climate Resilience Act 2023", vote: "Yes" },
                      { bill: "Public Transit Expansion", vote: "Yes" },
                      { bill: "State Budget Amendment B", vote: "No" },
                    ].map((vote) => (
                      <div key={vote.bill} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                        <span className="text-sm font-medium text-white">{vote.bill}</span>
                        <span className={`text-[10px] font-black uppercase ${vote.vote === "Yes" ? "text-green-400" : "text-red-400"}`}>
                          {vote.vote}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Bipartisan Score</p>
                    <p className="font-h2 text-xl text-white">74%</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Attendance Rate</p>
                    <p className="font-h2 text-xl text-white">98.2%</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRecord(null)}
                className="mt-10 w-full rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Close Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComparing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComparing(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="glass-panel relative max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-[2.5rem] border border-white/10 bg-surface/80 p-12 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="comparison-title"
            >
              <div className="mb-12 flex items-center justify-between">
                <h2 id="comparison-title" className="font-h1 text-3xl font-bold text-white">Head-to-Head Comparison</h2>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setIsComparing(false)}
                  className="rounded-full p-3 transition-colors hover:bg-white/5"
                >
                  <AppIcon name="close" className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-12 pt-24">
                  <div className="flex h-10 items-center text-[10px] font-black uppercase text-primary">Key Focus Areas</div>
                </div>
                {selectedCandidates
                  .map((name) => sortedCandidates.find((candidate) => candidate.name === name))
                  .map(
                    (candidate) =>
                      candidate && (
                        <div key={candidate.name} className="col-span-1 space-y-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-3xl font-h1 text-primary">
                              {candidate.avatar}
                            </div>
                            <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                            <p className="text-sm text-slate-500">{candidate.party}</p>
                          </div>

                          <div className="flex h-10 items-center justify-center font-h1 text-2xl text-white">{candidate.office}</div>
                          <div className="flex h-10 items-center justify-center font-h1 text-3xl text-primary">{candidate.alignment}%</div>
                          <div className="flex h-20 flex-wrap content-center justify-center gap-2">
                            {candidate.platform.split(", ").map((issue) => (
                              <span key={issue} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[8px] font-bold uppercase text-slate-400">
                                {issue}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
              </div>

              <button
                type="button"
                onClick={() => setIsComparing(false)}
                className="mt-12 w-full rounded-2xl bg-gradient-to-r from-primary to-purple-500 py-5 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98"
              >
                Return to Directory
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-6">
        <div className="flex items-start gap-3">
          <AppIcon name="help" className="mt-0.5 h-5 w-5 text-yellow-400" />
          <div>
            <h4 className="text-sm font-bold text-yellow-400 mb-2">Non-Partisan Information</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              This candidate database is provided for informational purposes only. Alignment scores are based on historical voting records and stated positions.
              We are committed to factual, unbiased information. Always verify candidate information through official sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
