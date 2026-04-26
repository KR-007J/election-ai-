"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppStore, type Section } from "@/stores/useAppStore";
import { auth, initAnalytics, initPerformance } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DEFAULT_USER_PROGRESS = {
  quizCompleted: false,
  guideViewed: false,
  candidatesExplored: false,
  timelineViewed: false,
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeSection, setActiveSection, engineStatus } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(false);
  const [savedUserProgress] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_USER_PROGRESS;
    }

    try {
      const savedProgress = localStorage.getItem("user-progress");
      const parsedProgress = savedProgress
        ? { ...DEFAULT_USER_PROGRESS, ...JSON.parse(savedProgress) }
        : DEFAULT_USER_PROGRESS;

      return localStorage.getItem("election-quiz-results")
        ? { ...parsedProgress, quizCompleted: true }
        : parsedProgress;
    } catch {
      return DEFAULT_USER_PROGRESS;
    }
  });
  const router = useRouter();
  const canUseSpeechSynthesis =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Voice guidance function
  const speakText = (text: string) => {
    if (voiceGuidance && canUseSpeechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for elderly users
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const userProgress = React.useMemo(() => {
    const next = { ...savedUserProgress };

    switch (activeSection) {
      case "quiz":
        next.quizCompleted = true;
        break;
      case "guide":
        next.guideViewed = true;
        break;
      case "candidates":
        next.candidatesExplored = true;
        break;
      case "timeline":
        next.timelineViewed = true;
        break;
      default:
        break;
    }

    return next;
  }, [activeSection, savedUserProgress]);

  useEffect(() => {
    localStorage.setItem("user-progress", JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        // Optional: Redirect to login if not already there
        // router.push("/login"); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const setupAnalytics = async () => {
      const analytics = await initAnalytics();
      if (analytics) {
        logEvent(analytics, 'page_view', { page_title: activeSection });
      }
    };
    setupAnalytics();
    initPerformance();
  }, [activeSection]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const navItems = [
    { id: "home" as Section, icon: "dashboard", label: "Overview" },
    { id: "guide" as Section, icon: "how_to_vote", label: "Voter Guide" },
    { id: "candidates" as Section, icon: "person_search", label: "Candidate Search" },
    { id: "timeline" as Section, icon: "calendar_month", label: "Election Calendar" },
    { id: "simulation" as Section, icon: "model_training", label: "Interactive Tools" },
    { id: "quiz" as Section, icon: "quiz", label: "Voter Quiz" },
    { id: "chat" as Section, icon: "chat", label: "AI Assistant" },
    { id: "settings" as Section, icon: "settings", label: "Preferences" },
  ] satisfies Array<{ id: Section; icon: AppIconName; label: string }>;

  const progressItems = [
    { key: 'quizCompleted', label: 'Quiz', icon: 'quiz' },
    { key: 'guideViewed', label: 'Guide', icon: 'how_to_vote' },
    { key: 'candidatesExplored', label: 'Candidates', icon: 'person_search' },
    { key: 'timelineViewed', label: 'Timeline', icon: 'calendar_month' }
  ] satisfies Array<{ key: keyof typeof DEFAULT_USER_PROGRESS; label: string; icon: AppIconName }>;

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-on-background font-body-md overflow-hidden">
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* SideNavBar */}
      <nav aria-label="Main navigation" className="bg-[#0A0E1A]/90 backdrop-blur-2xl text-blue-500 dark:text-blue-400 font-h1 antialiased border-r border-white/5 shadow-2xl flex flex-col h-full py-10 px-8 w-80 shrink-0 z-50 overflow-y-auto">
        <button
          type="button"
          className="mb-12 flex items-center gap-4 px-2 text-left transition-opacity hover:opacity-80"
          onClick={() => setActiveSection("home")}
          aria-label="Return to dashboard overview"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.1)] shrink-0">
            <AppIcon name="account_balance" className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex flex-col justify-center leading-none">
            <h1 className="text-base font-black text-white truncate">Election AI</h1>
          </div>
        </button>
        
        {/* Progress Section */}
        <div className="mb-6 rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-500">Progress</h3>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              aria-label={showHelp ? "Hide help and tips" : "Show help and tips"}
              aria-expanded={showHelp}
              aria-controls="quick-help-dialog"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <AppIcon name="help" className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {progressItems.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center gap-3">
                <AppIcon
                  name={userProgress[key] ? "check_circle" : icon}
                  className={`h-4 w-4 ${userProgress[key] ? 'text-green-400' : 'text-slate-600'}`}
                />
                <span className={`text-xs ${userProgress[key] ? 'text-green-400' : 'text-slate-500'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                speakText(`Navigating to ${item.label}`);
              }}
              aria-current={activeSection === item.id ? "page" : undefined}
              aria-label={`Navigate to ${item.label}`}
              className={`w-full flex items-center justify-start gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden text-left ${
                activeSection === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
            >
              {activeSection === item.id && (
                <div 
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              <AppIcon name={item.icon} className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="min-w-0 font-bold text-sm leading-none">{item.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout from account"
          className="mt-4 w-full flex items-center gap-3 p-3 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all mb-4"
        >
          <AppIcon name="logout" className="h-5 w-5" />
          <span className="font-medium leading-none">Logout</span>
        </button>

        <div className="mt-auto pt-4 space-y-4">
            {/* Neural Engine Status */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                engineStatus === 'connected' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 
                engineStatus === 'reconnecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white leading-none uppercase tracking-wider">Neural Engine</p>
                <p className="text-[8px] text-slate-500 leading-none mt-1">
                  {engineStatus === 'connected' ? 'Quantum Link Secure' : 
                   engineStatus === 'reconnecting' ? 'Re-establishing Link...' : 'Connection Lost'}
                </p>
              </div>
              <AppIcon name="verified" className="h-3 w-3 text-slate-600" />
            </div>

            {/* Minimal Disclaimer */}
            <div className="text-[8px] text-slate-600 leading-tight opacity-50 px-2">
              <p>Verified information only. Always check official sources.</p>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        {/* TopAppBar */}
        <header className="bg-[#0A0E1A]/60 backdrop-blur-3xl border-b border-white/5 h-20 flex justify-center items-center w-full px-12 shrink-0 z-40">
          <div className="w-full max-w-[1400px] flex justify-between items-center gap-12">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="relative w-full">
                <AppIcon name="search" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  aria-label="Search election information and tools"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-14 pr-6 text-sm focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white outline-none"
                  placeholder="Search intelligence database, learning modules, or polling analytics..."
                  type="text"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 pr-4">
                <button
                  type="button"
                  aria-label="View notifications"
                  className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                  onClick={() => speakText("You have no new notifications")}
                >
                  <AppIcon name="notifications" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceGuidance(!voiceGuidance)}
                  aria-label={`${voiceGuidance ? 'Disable' : 'Enable'} voice guidance for accessibility`}
                  aria-pressed={voiceGuidance}
                  className={`p-2.5 rounded-xl border transition-all ${
                    voiceGuidance
                      ? 'bg-green-500/20 text-green-400 border-green-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/5'
                  }`}
                >
                  <AppIcon name={voiceGuidance ? "volume_up" : "volume_off"} className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm text-white leading-none">
                    {user ? user.displayName : "Guest User"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/5">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={`${user.displayName ?? "User"} avatar`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  ) : (
                    <AppIcon name="person" className="h-6 w-6 text-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="main-content" className="flex-1 overflow-y-auto custom-scrollbar relative" aria-label="Main content area">
          <div className="max-w-[1400px] mx-auto p-8 md:p-12 space-y-10">
            {children}
          </div>
        </section>

        {/* Help Overlay */}
        {showHelp && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
            <div
              id="quick-help-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-help-title"
              className="glass-panel max-w-md w-full rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="quick-help-title" className="text-lg font-bold text-white">Quick Help Guide</h2>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  aria-label="Close help"
                  className="text-slate-400 hover:text-white"
                >
                  <AppIcon name="close" className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <AppIcon name="quiz" className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-white">Alignment Quiz</h3>
                    <p className="text-sm text-slate-400">Take our quiz to find candidates that match your values.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AppIcon name="how_to_vote" className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-white">Voter Guide</h3>
                    <p className="text-sm text-slate-400">Step-by-step guide to prepare for voting.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AppIcon name="person_search" className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-white">Candidates</h3>
                    <p className="text-sm text-slate-400">Compare candidates and view their records.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AppIcon name="chat" className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-white">AI Assistant</h3>
                    <p className="text-sm text-slate-400">Ask questions about the election process.</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 bg-primary py-3 rounded-xl font-bold text-white"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* FAB */}
        <button
          type="button"
          onClick={() => setActiveSection('guide')}
          aria-label="Quick access to voter registration guide"
          className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-primary text-white shadow-[0_0_30px_rgba(0,229,255,0.3)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group z-50"
        >
          <AppIcon name="how_to_reg" className="h-7 w-7" />
          <span className="absolute right-20 bg-surface px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 text-white">
            Quick Register
          </span>
        </button>
      </main>
    </div>
  );
}
