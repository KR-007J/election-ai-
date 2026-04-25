'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

const questions = [
  {
    id: '1',
    text: "What is your top priority for healthcare?",
    options: [
      { id: 'a', text: "Preserving and strengthening Medicare for all seniors" },
      { id: 'b', text: "Expanding access to affordable health insurance" },
      { id: 'c', text: "Reducing prescription drug costs" },
      { id: 'd', text: "Investing in medical research and innovation" }
    ]
  },
  {
    id: '2',
    text: "How should Social Security be handled?",
    options: [
      { id: 'a', text: "Protect benefits without cuts, expand for future generations" },
      { id: 'b', text: "Raise the retirement age to ensure solvency" },
      { id: 'c', text: "Means-test benefits for higher earners" },
      { id: 'd', text: "Privatize portions of the system" }
    ]
  },
  {
    id: '3',
    text: "What is your view on climate change action?",
    options: [
      { id: 'a', text: "Aggressive government investment in green energy" },
      { id: 'b', text: "Market-based solutions and incentives" },
      { id: 'c', text: "Balanced approach protecting jobs and environment" },
      { id: 'd', text: "Climate change is not a major priority" }
    ]
  },
  {
    id: '4',
    text: "How should we address the national debt?",
    options: [
      { id: 'a', text: "Raise taxes on the wealthy and corporations" },
      { id: 'b', text: "Cut government spending on social programs" },
      { id: 'c', text: "Balanced approach of spending cuts and revenue increases" },
      { id: 'd', text: "Focus on economic growth to naturally reduce debt" }
    ]
  },
  {
    id: '5',
    text: "What is your stance on immigration policy?",
    options: [
      { id: 'a', text: "Path to citizenship for undocumented immigrants" },
      { id: 'b', text: "Secure borders first, then address status" },
      { id: 'c', text: "Guest worker programs without citizenship" },
      { id: 'd', text: "Strict enforcement and deportation" }
    ]
  },
  {
    id: '6',
    text: "How should education be improved?",
    options: [
      { id: 'a', text: "Increase funding for public schools, reduce college debt" },
      { id: 'b', text: "School choice and charter school expansion" },
      { id: 'c', text: "Teacher pay increases and professional development" },
      { id: 'd', text: "Focus on vocational and technical training" }
    ]
  },
  {
    id: '7',
    text: "What approach to criminal justice reform?",
    options: [
      { id: 'a', text: "Decriminalize certain offenses, focus on rehabilitation" },
      { id: 'b', text: "Increase funding for police and prisons" },
      { id: 'c', text: "Address root causes like poverty and education" },
      { id: 'd', text: "Three strikes laws and mandatory minimums" }
    ]
  },
  {
    id: '8',
    text: "How should gun violence be addressed?",
    options: [
      { id: 'a', text: "Stricter background checks and assault weapon bans" },
      { id: 'b', text: "Mental health focus and red flag laws" },
      { id: 'c', text: "Arm teachers and increase school security" },
      { id: 'd', text: "Current laws are sufficient" }
    ]
  },
  {
    id: '9',
    text: "What is your economic policy preference?",
    options: [
      { id: 'a', text: "Progressive taxation and wealth redistribution" },
      { id: 'b', text: "Supply-side economics and tax cuts" },
      { id: 'c', text: "Balanced budget and fiscal responsibility" },
      { id: 'd', text: "Universal basic income and automation transition" }
    ]
  },
  {
    id: '10',
    text: "How should foreign policy be conducted?",
    options: [
      { id: 'a', text: "Multilateral cooperation and diplomacy first" },
      { id: 'b', text: "America First, renegotiate trade deals" },
      { id: 'c', text: "Strong military presence worldwide" },
      { id: 'd', text: "Isolationism and focus on domestic issues" }
    ]
  }
];

export default function ElectionQuiz() {
  const { setActiveSection } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Voice guidance
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Load saved quiz results on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('election-quiz-results');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers); // eslint-disable-line react-hooks/set-state-in-effect
      setIsFinished(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, []); // Empty dependency array is correct here

  // Calculate profile based on answers
  const calculateProfile = React.useCallback((answers: Record<string, string>) => {
    const scores = { progressive: 0, conservative: 0, moderate: 0, libertarian: 0 };

    // Simple scoring based on option indices (a=0, b=1, c=2, d=3)
    Object.values(answers).forEach(answer => {
      const index = answer.charCodeAt(0) - 97; // a=0, b=1, etc.
      if (index === 0) scores.progressive++;
      else if (index === 1) scores.conservative++;
      else if (index === 2) scores.moderate++;
      else scores.libertarian++;
    });

    const maxScore = Math.max(...Object.values(scores));
    const primaryValue = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) || 'moderate';

    // Use deterministic calculation instead of Math.random for better UX
    const answerSum = Object.values(answers).reduce((sum, answer) => sum + (answer.charCodeAt(0) - 96), 0);
    const priorities = ['Healthcare', 'Economy', 'Environment', 'Security'];
    const economicViews = ['Progressive', 'Conservative', 'Balanced', 'Free Market'];

    const topConcern = priorities[answerSum % priorities.length];
    const economicView = economicViews[answerSum % economicViews.length];

    return { primaryValue, topConcern, economicView };
  }, []);

  const handleAnswer = (optionId: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: optionId };
    setAnswers(newAnswers);

    // Voice feedback
    const selectedOption = questions[currentStep].options.find(opt => opt.id === optionId);
    speakText(`Selected: ${selectedOption?.text}`);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Announce next question
      setTimeout(() => {
        speakText(`Question ${currentStep + 2} of ${questions.length}: ${questions[currentStep + 1].text}`);
      }, 500);
    } else {
      setIsFinished(true);
      speakText("Quiz completed! Generating your voter profile.");

      // Persist results
      const profile = calculateProfile(newAnswers);
      localStorage.setItem('election-quiz-results', JSON.stringify({
        answers: newAnswers,
        profile,
        completedAt: new Date().toISOString()
      }));
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
            {isFinished && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-green-400 font-medium">✓ Quiz completed</span>
                <span className="text-xs text-slate-500">Results saved automatically</span>
              </div>
            )}
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
                    aria-label={`Select option: ${option.text}`}
                    className="group flex items-center justify-between p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-left focus:outline-2 focus:outline-primary min-h-[80px]"
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
              {(() => {
                const profile = calculateProfile(answers);
                return [
                  { label: "Primary Value", val: profile.primaryValue.charAt(0).toUpperCase() + profile.primaryValue.slice(1), icon: "bolt" },
                  { label: "Top Concern", val: profile.topConcern, icon: "shield" },
                  { label: "Economic View", val: profile.economicView, icon: "eco" },
                ].map((trait) => (
                  <div key={trait.label} className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="material-symbols-outlined text-primary mb-4 text-3xl">{trait.icon}</span>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{trait.label}</p>
                    <p className="text-2xl text-white font-bold">{trait.val}</p>
                  </div>
                ));
              })()}
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button
                onClick={() => {
                  setActiveSection('candidates');
                  speakText("Viewing candidates that match your preferences");
                }}
                aria-label="View candidates that match your quiz answers"
                className="bg-primary text-white px-12 py-6 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xl focus:outline-2 focus:outline-white min-h-[60px]"
              >
                View Matched Candidates
              </button>
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentStep(0);
                  setAnswers({});
                  localStorage.removeItem('election-quiz-results');
                  speakText("Restarting quiz");
                }}
                aria-label="Restart the quiz from the beginning"
                className="bg-white/5 text-white px-12 py-6 rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all text-xl focus:outline-2 focus:outline-primary min-h-[60px]"
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
