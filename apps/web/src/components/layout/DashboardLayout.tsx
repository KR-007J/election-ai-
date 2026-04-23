"use client";

import React from "react";
import { useAppStore, type Section } from "@/stores/useAppStore";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeSection, setActiveSection } = useAppStore();
  const { user } = useUser();

  const navItems = [
    { id: "home" as Section, icon: "dashboard", label: "Overview" },
    { id: "guide" as Section, icon: "how_to_vote", label: "Voter Guide" },
    { id: "candidates" as Section, icon: "person_search", label: "Candidate Search" },
    { id: "timeline" as Section, icon: "calendar_month", label: "Election Calendar" },
    { id: "simulation" as Section, icon: "model_training", label: "Interactive Tools" },
    { id: "quiz" as Section, icon: "quiz", label: "Voter Quiz" },
    { id: "settings" as Section, icon: "settings", label: "Preferences" },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-on-background font-body-md overflow-hidden">
      {/* SideNavBar */}
      <nav className="bg-[#0A0E1A]/90 backdrop-blur-2xl text-blue-500 dark:text-blue-400 font-h1 antialiased border-r border-white/5 shadow-2xl flex flex-col h-full py-8 px-6 w-72 shrink-0 z-50">
        <div className="flex items-center gap-4 mb-10 px-2 cursor-pointer" onClick={() => setActiveSection('home')}>
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary">account_balance</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Election Assistance</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Voter Portal</p>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? "bg-primary/10 text-primary border-r-4 border-primary ring-1 ring-primary/20"
                  : "text-slate-500 hover:bg-white/5 hover:translate-x-1"
              }`}
            >
              <span className={`material-symbols-outlined ${activeSection === item.id ? "fill-1" : ""}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto pt-6 space-y-4 border-t border-white/5">
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* TopAppBar */}
        <header className="bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] h-20 flex justify-between items-center w-full px-8 shrink-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-full py-2.5 pl-12 pr-4 text-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-600 text-white"
                placeholder="Search voting information, candidates, or deadlines..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-slate-400">
              <button 
                onClick={() => setActiveSection('chat')}
                className="material-symbols-outlined hover:text-primary transition-all duration-300 scale-95 active:opacity-80"
              >
                support_agent
              </button>
              <button 
                onClick={() => setActiveSection('settings')} 
                className="material-symbols-outlined hover:text-primary transition-all duration-300 scale-95 active:opacity-80"
              >
                settings
              </button>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-h3 text-sm text-white leading-tight uppercase tracking-wide">{user?.fullName || "Citizen User"}</p>
                <p className="text-[10px] text-primary uppercase tracking-wider font-bold">Voter Status: Active</p>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 rounded-full border-2 border-primary/20",
                  }
                }}
              />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar relative">
          {children}
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
