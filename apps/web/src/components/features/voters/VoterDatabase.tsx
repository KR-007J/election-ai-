"use client";

import React, { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export function VoterDatabase() {
  const { setActiveSection } = useAppStore();
  const candidates = [
    { name: "Eleanor Sterling", office: "Governor", party: "Independent", alignment: 92, platform: "Climate Resilience, Educational Reform", avatar: "E" },
    { name: "Marcus Thorne", office: "Governor", party: "Federalist", alignment: 45, platform: "Infrastructure, Tech Innovation", avatar: "M" },
    { name: "Sarah Jenkins", office: "District Rep", party: "Civic Action", alignment: 78, platform: "Public Health, Housing Equity", avatar: "S" },
    { name: "David Chen", office: "District Rep", party: "Independent", alignment: 61, platform: "Small Business Support, Fiscal Transparency", avatar: "D" },
  ];

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const toggleCompare = (name: string) => {
    setSelectedCandidates(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name].slice(-2)
    );
  };

  return (
    <div className="space-y-8 relative">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-h1 text-4xl text-white tracking-tight">Candidate Guide</h1>
          <p className="text-slate-400 mt-2">Verified platforms and historical alignment scores for the upcoming election.</p>
        </div>
        <div className="flex gap-3">
          {selectedCandidates.length > 1 && (
            <button 
              onClick={() => setIsComparing(true)}
              className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              Compare ({selectedCandidates.length})
            </button>
          )}
          <button 
            onClick={() => setActiveSection('quiz')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
          >
            Retake Alignment Quiz
          </button>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((candidate, i) => (
          <motion.div
            key={candidate.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel rounded-[2rem] p-8 border transition-all group relative overflow-hidden ${
              selectedCandidates.includes(candidate.name) ? 'border-primary/50 bg-primary/5' : 'border-white/5 bg-surface/30'
            }`}
          >
            <div className="flex gap-6 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-h1 text-primary shadow-lg group-hover:scale-105 transition-transform">
                {candidate.avatar}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{candidate.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{candidate.office} • {candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-1">Alignment</p>
                    <p className="text-2xl font-h1 text-primary">{candidate.alignment}%</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.platform.split(', ').map(issue => (
                      <span key={issue} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        {issue}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setActiveRecord(candidate)}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                    >
                      Voting Record
                    </button>
                    <button 
                      onClick={() => toggleCompare(candidate.name)}
                      className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedCandidates.includes(candidate.name) 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {selectedCandidates.includes(candidate.name) ? 'Selected' : 'Compare'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-16 -translate-y-16"></div>
          </motion.div>
        ))}
      </div>

      {/* Voting Record Modal */}
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
              className="relative w-full max-w-2xl glass-panel p-10 rounded-[2rem] border border-white/10 shadow-2xl bg-surface/80"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-h1 text-primary">
                    {activeRecord.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{activeRecord.name}</h2>
                    <p className="text-slate-500 font-medium">{activeRecord.office} • Historical Record</p>
                  </div>
                </div>
                <button onClick={() => setActiveRecord(null)} className="p-2 hover:bg-white/5 rounded-full">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Key Legislation Votes</h4>
                  <div className="space-y-6">
                    {[
                      { bill: "Climate Resilience Act 2023", vote: "Yes", impact: "High" },
                      { bill: "Public Transit Expansion", vote: "Yes", impact: "Moderate" },
                      { bill: "State Budget Amendment B", vote: "No", impact: "Critical" },
                    ].map((v) => (
                      <div key={v.bill} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm text-white font-medium">{v.bill}</span>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${v.vote === 'Yes' ? 'text-green-400' : 'text-red-400'}`}>{v.vote}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Bipartisan Score</p>
                    <p className="text-xl text-white font-h2">74%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Attendance Rate</p>
                    <p className="text-xl text-white font-h2">98.2%</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveRecord(null)}
                className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Close Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
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
              className="relative w-full max-w-5xl glass-panel p-12 rounded-[2.5rem] border border-white/10 shadow-2xl bg-surface/80 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-white font-h1">Head-to-Head Comparison</h2>
                <button onClick={() => setIsComparing(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 pt-24 space-y-12">
                  <div className="h-10 flex items-center text-[10px] font-black uppercase tracking-widest text-primary">Office Target</div>
                  <div className="h-10 flex items-center text-[10px] font-black uppercase tracking-widest text-primary">Alignment Score</div>
                  <div className="h-10 flex items-center text-[10px] font-black uppercase tracking-widest text-primary">Key Focus Areas</div>
                </div>
                {selectedCandidates.map(name => candidates.find(c => c.name === name)).map(c => c && (
                  <div key={c.name} className="col-span-1 space-y-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-h1 text-primary mb-4">
                        {c.avatar}
                      </div>
                      <h3 className="text-xl font-bold text-white">{c.name}</h3>
                      <p className="text-sm text-slate-500">{c.party}</p>
                    </div>
                    
                    <div className="h-10 flex items-center justify-center text-2xl font-h1 text-white">{c.office}</div>
                    <div className="h-10 flex items-center justify-center text-3xl font-h1 text-primary">{c.alignment}%</div>
                    <div className="h-20 flex flex-wrap gap-2 justify-center content-center">
                      {c.platform.split(', ').map(issue => (
                        <span key={issue} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsComparing(false)}
                className="w-full mt-12 py-5 bg-gradient-to-r from-primary to-purple-500 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all"
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
