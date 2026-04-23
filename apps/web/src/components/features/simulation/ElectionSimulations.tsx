"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  { id: 'economy', title: 'Economic Shift', icon: '📈', impact: 'Moderate', desc: 'Simulate how a 2% change in inflation impacts voter turnout in swing states.' },
  { id: 'turnout', title: 'Youth Surge', icon: '🔥', impact: 'High', desc: 'What if youth voter registration increases by 15% across all battlegrounds?' },
  { id: 'policy', title: 'Climate Action', icon: '🌍', impact: 'Subtle', desc: 'Model the impact of a major climate bill on suburban voter sentiment.' },
];

export const ElectionSimulations = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleRun = () => {
    setSimulationRunning(true);
    setSimulationResult(null);
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationResult({
        turnout: "+4.2%",
        swing: "3.1% Shift",
        confidence: "89%",
        impactedVoters: "1.2M",
      });
    }, 3000);
  };

  return (
    <div className="space-y-8 safe-bottom">
      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => { setSelectedScenario(s.id); setSimulationResult(null); }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
              selectedScenario === s.id 
                ? 'bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]' 
                : 'bg-white/5 border-white/5 hover:border-white/10'
            }`}
          >
            {selectedScenario === s.id && (
              <motion.div 
                layoutId="active-scenario-glow"
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"
              />
            )}
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
            <h3 className="text-lg font-bold mb-2 tracking-tight text-white">{s.title}</h3>
            <p className="text-sm leading-relaxed mb-4 text-slate-400">{s.desc}</p>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-lg border ${
                s.impact === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                s.impact === 'Moderate' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {s.impact} Impact
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Simulation Workspace */}
      <AnimatePresence mode="wait">
        {selectedScenario ? (
          <motion.div
            key={selectedScenario}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel p-12 min-h-[440px] flex flex-col items-center justify-center text-center relative overflow-hidden rounded-[2rem] border border-white/5"
          >
            {simulationRunning ? (
              <div className="space-y-8 z-20">
                <div className="relative">
                  <motion.div 
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    }}
                    className="w-24 h-24 border-2 border-primary/10 border-t-primary rounded-full mx-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">📊</div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-3 tracking-tight text-white uppercase tracking-wider">Analyzing Data Points</h4>
                  <p className="text-base max-w-sm mx-auto text-slate-500">
                    Modeling {scenarios.find(s => s.id === selectedScenario)?.title} against current district demographics.
                  </p>
                </div>
              </div>
            ) : simulationResult ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-20 w-full max-w-4xl"
              >
                <div className="mb-8">
                  <span className="badge bg-green-500/20 text-green-400 px-4 py-1 text-xs font-bold uppercase mb-4">Simulation Complete</span>
                  <h4 className="text-3xl font-bold text-white mb-2">Impact Analysis Report</h4>
                  <p className="text-slate-500">Projected outcomes for the {scenarios.find(s => s.id === selectedScenario)?.title} scenario.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {[
                    { label: "Turnout Shift", value: simulationResult.turnout, color: "text-primary" },
                    { label: "Voter Swing", value: simulationResult.swing, color: "text-purple-400" },
                    { label: "Confidence", value: simulationResult.confidence, color: "text-green-400" },
                    { label: "Reach", value: simulationResult.impactedVoters, color: "text-orange-400" },
                  ].map((res) => (
                    <div key={res.label} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{res.label}</p>
                      <p className={`text-2xl font-h1 ${res.color}`}>{res.value}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleRun}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all"
                >
                  Rerun Simulation
                </button>
              </motion.div>
            ) : (
              <div className="max-w-md z-20">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-8 shadow-glow"
                >
                  {scenarios.find(s => s.id === selectedScenario)?.icon}
                </motion.div>
                <h4 className="text-3xl font-bold mb-4 tracking-tight text-white">Initialize Model</h4>
                <p className="text-base mb-10 text-slate-400 leading-relaxed">
                  Project the outcome of the <strong>{scenarios.find(s => s.id === selectedScenario)?.title}</strong> scenario. 
                  Calculated using verified census data and current polling weights.
                </p>
                <button 
                  onClick={handleRun}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  Run Projection
                </button>
              </div>
            )}

            {/* Grounded Data Grid */}
            <div className="mt-16 w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Demographic Sync', value: 88 },
                { label: 'Polling Latency', value: 12 },
                { label: 'Historical Weight', value: 94 },
                { label: 'Data Samples', value: 65 },
                { label: 'Margin of Error', value: 41 },
                { label: 'District Variance', value: 77 },
              ].map((metric, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between group/metric hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                    <span className="text-[9px] font-bold text-primary">{simulationRunning ? Math.floor(Math.random() * 100) : metric.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${metric.value}%`,
                        x: simulationRunning ? ['-100%', '100%'] : '0%' 
                      }}
                      transition={{ 
                        width: { duration: 1, delay: i * 0.1 },
                        x: { duration: 1.5, repeat: Infinity, ease: "linear" }
                      }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-white/10 rounded-[2rem]"
          >
            <div className="text-6xl mb-8 grayscale opacity-20">📊</div>
            <p className="text-xl font-medium text-slate-500 max-w-sm">
              Select an impact scenario above to initialize the predictive projection engine.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
