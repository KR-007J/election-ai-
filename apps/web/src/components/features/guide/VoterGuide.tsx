"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVoterGuideSteps } from '@/actions/electionData';

interface VoterGuideStep {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  body: string;
  checklist: string[];
  tip: string;
}

export const VoterGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<VoterGuideStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const loadSteps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVoterGuideSteps();
        setSteps(data);
      } catch (err) {
        console.error('Failed to load voter guide:', err);
        setError('Unable to load voter guide. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    loadSteps();
  }, []);

  const step = steps[currentStep];

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
        <p className="text-slate-400">Loading voter guide...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
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

  if (!step) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-yellow-400 mb-4 text-4xl">info</span>
        <p className="text-slate-400">No guide steps available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 safe-bottom">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Step Sidebar */}
        <div className="lg:col-span-1 overflow-x-auto no-scrollbar lg:overflow-visible pb-4 lg:pb-0">
          <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 px-1">
            {steps.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => setCurrentStep(i)}
                aria-current={currentStep === i ? 'step' : undefined}
                aria-label={`Go to step ${s.id}: ${s.title}`}
                className="w-48 lg:w-full text-left p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-3 lg:gap-4 transition-all duration-300 shrink-0 focus:outline-2 focus:outline-primary"
                style={{
                  background: currentStep === i ? 'var(--color-accent-glow)' : 'var(--color-surface-overlay)',
                  border: `1px solid ${currentStep === i ? 'rgba(66, 133, 244, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                }}
              >
                <span className="text-xl lg:text-2xl shrink-0 transition-transform duration-300" style={{ transform: currentStep === i ? 'scale(1.1)' : 'scale(1)' }}>{s.icon}</span>
                <div className="min-w-0">
                  <div className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest mb-0.5 lg:mb-1 opacity-40">Step {s.id}</div>
                  <div className="text-xs lg:text-sm font-bold truncate" style={{ color: currentStep === i ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>{s.title}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 card p-10 min-h-[520px] flex flex-col"
          >
            {/* Step Header */}
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-glow" style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}>
                {step.icon}
              </div>
              <div>
                <div className="badge badge-accent mb-2">Preparation Phase</div>
                <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{step.title}</h3>
              </div>
            </div>

            <p className="text-base leading-relaxed mb-10 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>{step.body}</p>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 flex-grow">
              {step.checklist.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 items-start p-5 rounded-2xl transition-colors hover:bg-white/[0.02]"
                  style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0" style={{ background: 'var(--gradient-brand)' }}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Tip Box */}
            <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--color-accent-glow)', border: '1px solid rgba(66, 133, 244, 0.15)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>Expert Tip</span>
              </div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: step.tip }} />
            </div>

            {/* Elderly-friendly help */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-yellow-400 mt-0.5">elderly</span>
                <div>
                  <h4 className="text-sm font-bold text-yellow-400 mb-1">Need Help?</h4>
                  <p className="text-xs text-slate-300 mb-2">
                    If you need assistance with any step, contact your local election office or senior center.
                  </p>
                  <button className="text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded hover:bg-yellow-500/30 transition-colors">
                    Find Help Near You
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                aria-label="Go to previous step"
                className="text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-30 focus:outline-2 focus:outline-primary"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Previous
              </button>

              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    aria-label={`Go to step ${i + 1}`}
                    aria-current={i === currentStep ? 'step' : undefined}
                    className="h-1.5 rounded-full transition-all duration-300 focus:outline-2 focus:outline-primary"
                    style={{
                      width: i === currentStep ? 24 : 8,
                      background: i === currentStep ? 'var(--color-accent)' : 'var(--color-surface-overlay)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                aria-label="Go to next step"
                className="text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-30 focus:outline-2 focus:outline-primary"
                style={{ color: 'var(--color-accent)' }}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
