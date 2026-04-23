"use client";

import React, { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

interface Candidate {
  name: string;
  office: string;
  party: string;
  alignment: number;
  platform: string;
  avatar: string;
}

export function VoterDatabase() {
  const { setActiveSection } = useAppStore();
  const candidates: Candidate[] = [
    { name: "Eleanor Sterling", office: "Governor", party: "Independent", alignment: 92, platform: "Climate Resilience, Educational Reform", avatar: "E" },
    { name: "Marcus Thorne", office: "Governor", party: "Federalist", alignment: 45, platform: "Infrastructure, Tech Innovation", avatar: "M" },
    { name: "Sarah Jenkins", office: "District Rep", party: "Civic Action", alignment: 78, platform: "Public Health, Housing Equity", avatar: "S" },
    { name: "David Chen", office: "District Rep", party: "Independent", alignment: 61, platform: "Small Business Support, Fiscal Transparency", avatar: "D" },
  ];

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [activeRecord, setActiveRecord] = useState<Candidate | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const toggleCompare = (name: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(name) ? prev.filter((candidateName) => candidateName !== name) : [...prev, name].slice(-2),
    );
  };

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="font-h1 text-4xl tracking-tight text-white">Candidate Guide</h1>
          <p className="mt-2 text-slate-400">Verified platforms and historical alignment scores for the upcoming election.</p>
        </div>
        <div className="flex gap-3">
          {selectedCandidates.length > 1 && (
            <button
              onClick={() => setIsComparing(true)}
              className="rounded-xl bg-purple-500 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse"
            >
              Compare ({selectedCandidates.length})
            </button>
          )}
          <button
            onClick={() => setActiveSection("quiz")}
            className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Retake Alignment Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-panel group relative overflow-hidden rounded-[2rem] border p-8 transition-all ${
              selectedCandidates.includes(candidate.name) ? "border-primary/50 bg-primary/5" : "border-white/5 bg-surface/30"
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
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-600">Alignment</p>
                    <p className="font-h1 text-2xl text-primary">{candidate.alignment}%</p>
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
                      onClick={() => setActiveRecord(candidate)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                    >
                      Voting Record
                    </button>
                    <button
                      onClick={() => toggleCompare(candidate.name)}
                      className={`flex-1 rounded-xl border py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedCandidates.includes(candidate.name)
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
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-3xl font-h1 text-primary">
                    {activeRecord.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{activeRecord.name}</h2>
                    <p className="font-medium text-slate-500">{activeRecord.office} | Historical Record</p>
                  </div>
                </div>
                <button onClick={() => setActiveRecord(null)} className="rounded-full p-2 hover:bg-white/5">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-8">
                  <h4 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-primary">Key Legislation Votes</h4>
                  <div className="space-y-6">
                    {[
                      { bill: "Climate Resilience Act 2023", vote: "Yes" },
                      { bill: "Public Transit Expansion", vote: "Yes" },
                      { bill: "State Budget Amendment B", vote: "No" },
                    ].map((vote) => (
                      <div key={vote.bill} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                        <span className="text-sm font-medium text-white">{vote.bill}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${vote.vote === "Yes" ? "text-green-400" : "text-red-400"}`}>
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
            >
              <div className="mb-12 flex items-center justify-between">
                <h2 className="font-h1 text-3xl font-bold text-white">Head-to-Head Comparison</h2>
                <button onClick={() => setIsComparing(false)} className="rounded-full p-3 transition-colors hover:bg-white/5">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-12 pt-24">
                  <div className="flex h-10 items-center text-[10px] font-black uppercase tracking-widest text-primary">Office Target</div>
                  <div className="flex h-10 items-center text-[10px] font-black uppercase tracking-widest text-primary">Alignment Score</div>
                  <div className="flex h-10 items-center text-[10px] font-black uppercase tracking-widest text-primary">Key Focus Areas</div>
                </div>
                {selectedCandidates
                  .map((name) => candidates.find((candidate) => candidate.name === name))
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
                              <span key={issue} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                {issue}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
              </div>

              <button
                onClick={() => setIsComparing(false)}
                className="mt-12 w-full rounded-2xl bg-gradient-to-r from-primary to-purple-500 py-5 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98"
              >
                Return to Directory
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
