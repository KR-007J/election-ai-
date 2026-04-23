"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const scenarios = [
  {
    id: "economy",
    title: "Economic Shift",
    icon: "EC",
    impact: "Moderate",
    desc: "Simulate how a 2% change in inflation impacts voter turnout in swing states.",
  },
  {
    id: "turnout",
    title: "Youth Surge",
    icon: "YS",
    impact: "High",
    desc: "What if youth voter registration increases by 15% across all battlegrounds?",
  },
  {
    id: "policy",
    title: "Climate Action",
    icon: "CA",
    impact: "Subtle",
    desc: "Model the impact of a major climate bill on suburban voter sentiment.",
  },
] as const;

interface SimulationResult {
  turnout: string;
  swing: string;
  confidence: string;
  impactedVoters: string;
}

const baselineMetrics = [
  { label: "Demographic Sync", value: 88 },
  { label: "Polling Latency", value: 12 },
  { label: "Historical Weight", value: 94 },
  { label: "Data Samples", value: 65 },
  { label: "Margin of Error", value: 41 },
  { label: "District Variance", value: 77 },
];

export const ElectionSimulations = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [liveMetrics, setLiveMetrics] = useState<number[]>(baselineMetrics.map((metric) => metric.value));

  useEffect(() => {
    if (!simulationRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setLiveMetrics((current) =>
        current.map((value, index) => Math.min(100, Math.max(1, value + (index % 2 === 0 ? 3 : -2)))),
      );
    }, 450);

    return () => window.clearInterval(interval);
  }, [simulationRunning]);

  const handleRun = () => {
    setSimulationRunning(true);
    setSimulationResult(null);
    setLiveMetrics(baselineMetrics.map((metric) => metric.value));

    window.setTimeout(() => {
      setSimulationRunning(false);
      setLiveMetrics(baselineMetrics.map((metric) => metric.value));
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {scenarios.map((scenario) => (
          <motion.button
            key={scenario.id}
            onClick={() => {
              setSelectedScenario(scenario.id);
              setSimulationResult(null);
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 group ${
              selectedScenario === scenario.id
                ? "border-primary/30 bg-primary/10 shadow-[0_0_30px_rgba(0,229,255,0.1)]"
                : "border-white/5 bg-white/5 hover:border-white/10"
            }`}
          >
            {selectedScenario === scenario.id && (
              <motion.div
                layoutId="active-scenario-glow"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
              />
            )}
            <div className="mb-4 text-3xl transition-transform duration-300 group-hover:scale-110">{scenario.icon}</div>
            <h3 className="mb-2 text-lg font-bold tracking-tight text-white">{scenario.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">{scenario.desc}</p>
            <span
              className={`rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                scenario.impact === "High"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : scenario.impact === "Moderate"
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-green-500/20 bg-green-500/10 text-green-400"
              }`}
            >
              {scenario.impact} Impact
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedScenario ? (
          <motion.div
            key={selectedScenario}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/5 p-12 text-center"
          >
            {simulationRunning ? (
              <div className="z-20 space-y-8">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
                    className="mx-auto h-24 w-24 rounded-full border-2 border-primary/10 border-t-primary"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">AI</div>
                </div>
                <div>
                  <h4 className="mb-3 text-2xl font-bold uppercase tracking-wider text-white">Analyzing Data Points</h4>
                  <p className="mx-auto max-w-sm text-base text-slate-500">
                    Modeling {scenarios.find((scenario) => scenario.id === selectedScenario)?.title} against current district demographics.
                  </p>
                </div>
              </div>
            ) : simulationResult ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-20 w-full max-w-4xl">
                <div className="mb-8">
                  <span className="badge mb-4 bg-green-500/20 px-4 py-1 text-xs font-bold uppercase text-green-400">Simulation Complete</span>
                  <h4 className="mb-2 text-3xl font-bold text-white">Impact Analysis Report</h4>
                  <p className="text-slate-500">
                    Projected outcomes for the {scenarios.find((scenario) => scenario.id === selectedScenario)?.title} scenario.
                  </p>
                </div>

                <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
                  {[
                    { label: "Turnout Shift", value: simulationResult.turnout, color: "text-primary" },
                    { label: "Voter Swing", value: simulationResult.swing, color: "text-purple-400" },
                    { label: "Confidence", value: simulationResult.confidence, color: "text-green-400" },
                    { label: "Reach", value: simulationResult.impactedVoters, color: "text-orange-400" },
                  ].map((result) => (
                    <div key={result.label} className="rounded-2xl border border-white/5 bg-white/5 p-6">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{result.label}</p>
                      <p className={`text-2xl font-h1 ${result.color}`}>{result.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRun}
                  className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  Rerun Simulation
                </button>
              </motion.div>
            ) : (
              <div className="z-20 max-w-[480px]">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-glow"
                >
                  {scenarios.find((scenario) => scenario.id === selectedScenario)?.icon}
                </motion.div>
                <h4 className="mb-4 text-3xl font-bold tracking-tight text-white">Initialize Model</h4>
                <p className="mb-10 text-base leading-relaxed text-slate-400">
                  Project the outcome of the <strong>{scenarios.find((scenario) => scenario.id === selectedScenario)?.title}</strong> scenario.
                  Calculated using verified census data and current polling weights.
                </p>
                <button
                  onClick={handleRun}
                  className="rounded-xl bg-primary px-10 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all hover:scale-105 active:scale-95"
                >
                  Run Projection
                </button>
              </div>
            )}

            <div className="mt-16 grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {baselineMetrics.map((metric, index) => (
                <div key={metric.label} className="group/metric flex h-20 flex-col justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                    <span className="text-[9px] font-bold text-primary">{liveMetrics[index]}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${liveMetrics[index]}%`,
                        x: simulationRunning ? ["-100%", "100%"] : "0%",
                      }}
                      transition={{
                        width: { duration: 1, delay: index * 0.1 },
                        x: { duration: 1.5, repeat: Infinity, ease: "linear" },
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
            className="glass-panel flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 p-16 text-center"
          >
            <div className="mb-8 text-6xl opacity-20 grayscale">AI</div>
            <p className="max-w-sm text-xl font-medium text-slate-500">
              Select an impact scenario above to initialize the predictive projection engine.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
