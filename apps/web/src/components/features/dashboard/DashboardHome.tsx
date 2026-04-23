"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppStore } from "@/stores/useAppStore";

interface Bulletin {
  title: string;
  category: string;
  time: string;
  urgent: boolean;
  description?: string;
  icon?: string;
}

export function DashboardHome() {
  const { setActiveSection } = useAppStore();
  const [bulletins, setBulletins] = useState<Bulletin[]>([
    { title: "National Voter Registration Day", category: "Deadline", time: "2h ago", urgent: true, description: "Final call for registration updates before the November general election.", icon: "event_busy" },
    { title: "New Polling Locations in District 4", category: "Update", time: "5h ago", urgent: false, description: "Check our updated map for three new sites available for early voting.", icon: "location_on" },
    { title: "Mail-in Ballot Instructions Released", category: "Guide", time: "1d ago", urgent: false, description: "Step-by-step video guide now available for first-time mail-in voters.", icon: "description" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBulletins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/updates');
      if (!res.ok) throw new Error("API Offline");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setBulletins(data);
    } catch (e) {
      console.warn("API Offline or connection error. Using local bulletins.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletins();
  }, []);

  const voterStats = [
    { label: "Days Until Election", value: "12", change: "Final Stretch", icon: "timer", color: "#FF3D00" },
    { label: "District Participation", value: "82.4%", change: "+4.1% vs 2022", icon: "how_to_vote", color: "#00E5FF" },
    { label: "Registration Status", value: "Active", change: "Verified", icon: "verified", color: "#7000FF" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Enterprise Header Section */}
      <div className="relative overflow-hidden bg-[#0A0E1A]/60 p-8 md:p-12 rounded-[2rem] border border-white/5 backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-h1 text-4xl md:text-5xl text-white mb-4 tracking-tight"
            >
              Welcome to <span className="text-primary italic">Election AI Assistant</span>
            </motion.h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Your centralized dashboard for verified election information, candidate tracking, and polling logistics.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="badge border-primary/30 bg-primary/10 text-primary px-4 py-1.5 text-sm font-bold uppercase tracking-widest mb-2">
                Nov 5, 2024 • General
              </div>
              <p className="text-4xl font-h1 text-white tabular-nums tracking-tighter">12 <span className="text-sm font-body uppercase text-slate-500 tracking-normal">Days Left</span></p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {voterStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-2xl inner-glow border border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-h1 text-white tracking-tight">{stat.value}</h3>
            <p className="text-slate-500 text-[10px] uppercase font-black mt-2 tracking-[0.2em]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Resource Center */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Priority Tasks */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-surface/30">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-h3 text-2xl text-white">Your Voter Checklist</h3>
              <button onClick={() => setActiveSection('guide')} className="text-primary text-xs font-bold hover:underline">Complete Full Guide</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Verify Registration", icon: "assignment_ind", status: "Done", color: "text-green-400", bg: "bg-green-500/10" },
                { title: "Sample Ballot", icon: "description", status: "Review", color: "text-primary", bg: "bg-primary/10" },
                { title: "Polling Directions", icon: "map", status: "Incomplete", color: "text-slate-500", bg: "bg-white/5" },
              ].map((task) => (
                <button key={task.title} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all text-left group">
                  <div className={`w-10 h-10 rounded-lg ${task.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <span className={`material-symbols-outlined ${task.color}`}>{task.icon}</span>
                  </div>
                  <p className="text-white font-bold text-base mb-1">{task.title}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${task.color}`}>{task.status}</p>
                </button>
              ))}
            </div>
          </div>

          {/* District Participation Mock Chart */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col h-[340px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl text-white font-bold">District Participation</h3>
                <p className="text-xs text-slate-500 mt-1">Real-time engagement trends vs. previous cycles</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                <button className="px-3 py-1 text-[10px] font-bold text-primary bg-primary/10 rounded-md">District</button>
                <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-white">State</button>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
              {[42, 58, 48, 72, 85, 65, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-full bg-gradient-to-t from-primary/10 to-primary/40 rounded-t-lg border-x border-t border-primary/20 group-hover:brightness-125 transition-all"
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold">T-{14-i*2}D</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Official Bulletins */}
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-panel p-8 rounded-3xl h-full border border-white/5 flex flex-col bg-surface/20">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <h3 className="font-h3 text-xl text-white">Live Updates</h3>
              </div>
              <button 
                onClick={fetchBulletins}
                disabled={isLoading}
                className="p-2 hover:bg-white/5 rounded-full transition-colors disabled:opacity-30"
              >
                <span className={`material-symbols-outlined text-slate-400 ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
              </button>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-2 w-1/4" />
                      <Skeleton className="h-2 w-1/4" />
                    </div>
                  </div>
                ))
              ) : (
                bulletins.map((bulletin, i) => (
                  <motion.div
                    key={bulletin.title + i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                      bulletin.urgent 
                        ? "bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.05)]" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${bulletin.urgent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-500'}`}>
                        {bulletin.category}
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">{bulletin.time}</span>
                    </div>
                    <p className="text-white font-bold leading-snug group-hover:text-primary transition-colors mb-1">
                      {bulletin.title}
                    </p>
                    {bulletin.description && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{bulletin.description}</p>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-4 bg-white/5 rounded-2xl text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition-all border border-white/5 hover:border-white/10">
              Explore All Bulletins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
