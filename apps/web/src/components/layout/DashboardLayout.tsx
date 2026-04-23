"use client";

import React, { useEffect, useState } from "react";
import { useAppStore, type Section } from "@/stores/useAppStore";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeSection, setActiveSection } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    { id: "settings" as Section, icon: "settings", label: "Preferences" },
  ];

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-on-background font-body-md overflow-hidden">
      {/* SideNavBar */}
      <nav className="bg-[#0A0E1A]/90 backdrop-blur-2xl text-blue-500 dark:text-blue-400 font-h1 antialiased border-r border-white/5 shadow-2xl flex flex-col h-full py-10 px-8 w-80 shrink-0 z-50">
        <div className="flex items-center gap-5 mb-12 px-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => setActiveSection('home')}>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">NeuroLearn AI<br/>Platform</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-primary mt-1 font-black opacity-70">Intelligence</p>
          </div>
        </div>
        
        <div className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group relative ${
                activeSection === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
            >
              {activeSection === item.id && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${activeSection === item.id ? "fill-1" : ""}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="mt-4 w-full flex items-center gap-3 p-3 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all mb-4"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium">Logout</span>
        </button>

        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-4">
          Developed by <span className="text-primary">Krish Joshi</span> & Partner <span className="text-primary">Antigravity</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        {/* TopAppBar */}
        <header className="bg-[#0A0E1A]/60 backdrop-blur-3xl border-b border-white/5 h-20 flex justify-center items-center w-full px-12 shrink-0 z-40">
          <div className="w-full max-w-[1400px] flex justify-between items-center gap-12">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                <input
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-14 pr-6 text-sm focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white outline-none"
                  placeholder="Search intelligence database, learning modules, or polling analytics..."
                  type="text"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 pr-4">
                <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
              </div>
              
              <div className="flex items-center gap-4 pl-8 border-l border-white/5">
                <div className="text-right hidden lg:block">
                  <p className="font-bold text-sm text-white leading-none mb-1">
                    {user ? user.displayName : "Guest Intelligence"}
                  </p>
                  <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-black opacity-70">
                    {user ? "Verified Agent" : "Anonymous Access"}
                  </p>
                </div>
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="User"
                    width={44}
                    height={44}
                    unoptimized
                    className="h-11 w-11 rounded-2xl border border-primary/30 object-cover shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">person</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-[1400px] mx-auto p-8 md:p-12 space-y-10">
            {children}
          </div>
        </section>

        {/* FAB */}
        <button 
          onClick={() => setActiveSection('guide')}
          className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-primary text-white shadow-[0_0_30px_rgba(0,229,255,0.3)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group z-50"
        >
          <span className="material-symbols-outlined text-3xl font-bold">how_to_reg</span>
          <span className="absolute right-20 bg-surface px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 text-white">
            Quick Register
          </span>
        </button>
      </main>
    </div>
  );
}
