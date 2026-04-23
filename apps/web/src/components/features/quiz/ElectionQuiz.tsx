'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

const questions = [
  {
    id: '1',
    text: "Which of the following is most important for our city's growth?",
    options: [
      { id: 'a', text: "Investing in new technology and startups" },
      { id: 'b', text: "Improving public parks and green spaces" },
      { id: 'c', text: "Lowering business taxes to attract industry" },
      { id: 'd', text: "Expanding public transportation networks" }
    ]
  },
  {
    id: '2',
    text: "How should we address public safety concerns?",
    options: [
      { id: 'a', text: "Increasing police presence in all neighborhoods" },
      { id: 'b', text: "Investing in community youth programs" },
      { id: 'c', text: "Improving street lighting and infrastructure" },
      { id: 'd', text: "Focusing on mental health support services" }
    ]
  },
  {
    id: '3',
    text: "What is your stance on renewable energy initiatives?",
    options: [
      { id: 'a', text: "Full transition to solar and wind by 2030" },
      { id: 'b', text: "Gradual shift while maintaining current grids" },
      { id: 'c', text: "Incentivize private companies to lead energy" },
      { id: 'd', text: "Focus on making energy more affordable first" }
    ]
  }
];

export default function ElectionQuiz() {
  const { setActiveSection } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: optionId });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const progress = ((currentStep + (isFinished ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[600px] flex flex-col">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="font-h1 text-4xl text-white tracking-tight">Alignment Quiz</h1>
            <p className="text-slate-500 mt-2">Discover which candidates align with your core values.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Progress</span>
            <span className="text-2xl font-h1 text-white">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary shadow-[0_0_15px_rgba(0,229,255,0.5)]"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-surface/30 relative overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 block">Question {currentStep + 1} of {questions.length}</span>
              <h2 className="text-3xl font-bold text-white mb-10 leading-tight">
                {questions[currentStep].text}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {questions[currentStep].options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(option.id)}
                    className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-left"
                  >
                    <span className="text-lg font-medium text-slate-300 group-hover:text-white transition-colors">{option.text}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-primary flex items-center justify-center transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 translate-x-32 -translate-y-32" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-4xl mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              OK
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Profile Generated</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-[480px] mx-auto">
              We&apos;ve analyzed your responses. Your voter profile is now calibrated to show the most relevant candidates and issues.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: "Primary Value", val: "Innovation", icon: "bolt" },
                { label: "Top Concern", val: "Public Safety", icon: "shield" },
                { label: "Economic View", val: "Sustainable", icon: "eco" },
              ].map((trait) => (
                <div key={trait.label} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <span className="material-symbols-outlined text-primary mb-3">{trait.icon}</span>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{trait.label}</p>
                  <p className="text-xl text-white font-bold">{trait.val}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveSection('candidates')}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-lg"
              >
                View Matched Candidates
              </button>
              <button
                onClick={() => { setIsFinished(false); setCurrentStep(0); setAnswers({}); }}
                className="bg-white/5 text-white px-10 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all"
              >
                Restart Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
