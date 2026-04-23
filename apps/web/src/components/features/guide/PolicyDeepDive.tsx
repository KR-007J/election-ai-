"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const issues = [
  { 
    id: 'economy', 
    title: 'Economic Strategy', 
    icon: '💰',
    points: [
      { label: 'Taxation', candidateA: 'Advocates for corporate tax reduction to 15%', candidateB: 'Proposes progressive tax increase on top earners' },
      { label: 'Trade', candidateA: 'Supports domestic tariff protections', candidateB: 'Favors multilateral trade agreements' },
      { label: 'Wages', candidateA: 'State-level minimum wage autonomy', candidateB: 'Federal $15 minimum wage mandate' },
    ]
  },
  { 
    id: 'healthcare', 
    title: 'Healthcare Reform', 
    icon: '🏥',
    points: [
      { label: 'Coverage', candidateA: 'Expansion of private market competition', candidateB: 'Universal public option implementation' },
      { label: 'Costs', candidateA: 'Drug pricing deregulation', candidateB: 'Federal price negotiation for medication' },
      { label: 'Access', candidateA: 'Focus on rural telehealth credits', candidateB: 'Expanded community clinic funding' },
    ]
  }
];

export const PolicyDeepDive = () => {
  const [activeIssue, setActiveIssue] = useState(issues[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar: Issues */}
      <div className="lg:col-span-1 space-y-2">
        {issues.map((issue) => (
          <button
            key={issue.id}
            onClick={() => setActiveIssue(issue)}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all border flex items-center gap-3 ${
              activeIssue.id === issue.id 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-white shadow-lg' 
                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{issue.icon}</span>
            <span className="font-semibold text-sm">{issue.title}</span>
          </button>
        ))}
        
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
           <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Enterprise Tip</h4>
           <p className="text-xs text-gray-400 leading-relaxed">
             Our AI analyzes thousands of pages of official policy papers to generate these comparisons.
           </p>
        </div>
      </div>

      {/* Main Panel: Comparison */}
      <div className="lg:col-span-3">
        <motion.div
          key={activeIssue.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card overflow-visible"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{activeIssue.title}</h3>
              <p className="text-sm text-gray-400 mt-1">Side-by-side platform comparison</p>
            </div>
            <div className="flex gap-2">
               <div className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-tighter">Candidate A</div>
               <div className="px-3 py-1 rounded-md bg-pink-500/10 text-pink-400 text-[10px] font-bold border border-pink-500/20 uppercase tracking-tighter">Candidate B</div>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {activeIssue.points.map((point, i) => (
              <div key={i} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-white/5 hidden md:block" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{point.label}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{point.candidateA}</p>
                </div>

                <div className="space-y-3 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{point.label}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{point.candidateB}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-black/20 flex justify-center">
             <button className="btn-secondary text-xs">
                Request AI Context Deep-Dive
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
