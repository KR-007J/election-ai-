"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppStore } from "@/stores/useAppStore";
import { buildApiUrl } from "@/lib/api";

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
      const res = await fetch(buildApiUrl('/updates'));
      if (!res.ok) throw new Error("API Offline");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setBulletins(data);
    } catch {
      console.warn("API Offline or connection error. Using local bulletins.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchBulletins();
    };
    void run();
  }, []);

  const voterStats = [
    { label: "Days Until Election", value: "12", change: "Final Stretch", icon: "timer", color: "#FF3D00" },
    { label: "District Participation", value: "82.4%", change: "+4.1% vs 2022", icon: "how_to_vote", color: "#00E5FF" },
    { label: "Registration Status", value: "Active", change: "Verified", icon: "verified", color: "#7000FF" },
  ];

  return (
    <div className="space-y-gutter pb-12">
      {/* Enterprise Header Section */}
      <div className="relative overflow-hidden bg-[#0A0E1A]/60 p-10 md:p-14 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.3)]">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="badge border-primary/30 bg-primary/10 text-primary px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-flex">
                Election AI Assistant
              </div>
              <h1 className="font-h1 text-5xl md:text-7xl text-white mb-8 tracking-tight leading-[1.05] max-w-3xl">
                The Intelligence Command for <span className="text-primary font-black">Election AI</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0 opacity-80">
                Strategic voter assistance, verified intelligence modules, and real-time polling analytics in one centralized platform.
              </p>
            </motion.div>
          </div>
          <div className="flex items-center gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shrink-0">
            <div className="text-right min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Cycle Update</p>
              <p className="text-5xl font-h1 text-white tabular-nums tracking-tighter">12 <span className="text-sm font-body uppercase text-primary tracking-normal font-black">Days</span></p>
              <p className="text-[10px] text-slate-400 mt-2 font-bold">Protocol Active</p>
            </div>
            <div className="w-px h-16 bg-white/10"></div>
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 relative">
              <span className="material-symbols-outlined text-primary text-4xl">account_balance</span>
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {voterStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-10 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">{stat.change}</span>
              </div>
              <h3 className="text-4xl font-h1 text-white tracking-tight tabular-nums">{stat.value}</h3>
              <p className="text-slate-500 text-[10px] uppercase font-black mt-3 tracking-[0.3em]">{stat.label}</p>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full translate-x-1/2 translate-y-1/2"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Resource Center */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Priority Tasks */}
          <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-surface/30">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-h3 text-2xl text-white tracking-tight">Your Voter Checklist</h3>
                <p className="text-slate-500 text-sm mt-1">Operational readiness for the upcoming cycle</p>
              </div>
              <button onClick={() => setActiveSection('guide')} className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                Full Protocol
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Verify Registration", icon: "assignment_ind", status: "Verified", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                { title: "Sample Ballot", icon: "description", status: "Available", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                { title: "Polling Directions", icon: "map", status: "Pending", color: "text-slate-500", bg: "bg-white/5", border: "border-white/10" },
              ].map((task) => (
                <button key={task.title} className={`p-8 rounded-2xl bg-white/5 border ${task.border} hover:scale-[1.02] transition-all text-left group`}>
                  <div className={`w-12 h-12 rounded-xl ${task.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                    <span className={`material-symbols-outlined text-2xl ${task.color}`}>{task.icon}</span>
                  </div>
                  <p className="text-white font-bold text-lg mb-2">{task.title}</p>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${task.color}`}>{task.status}</p>
                </button>
              ))}
            </div>
          </div>

          {/* District Participation Mock Chart */}
          <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl text-white font-h3 tracking-tight">District Participation</h3>
                <p className="text-sm text-slate-500 mt-1">Real-time engagement trends vs. historical benchmarks</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
                <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-lg shadow-lg">District</button>
                <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">National</button>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-6 px-4 pb-4">
              {[42, 58, 48, 72, 85, 65, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-5 group">
                  <div className="w-full relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-full bg-gradient-to-t from-primary/5 via-primary/20 to-primary/50 rounded-t-xl border-x border-t border-primary/30 group-hover:brightness-125 transition-all shadow-[0_-10px_30px_rgba(0,229,255,0.1)]"
                    />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-2xl">
                      {h}%
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">T-{14-i*2}D</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Official Bulletins */}
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-panel p-10 rounded-[2.5rem] h-full border border-white/5 flex flex-col bg-surface/20 min-h-[600px]">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                </div>
                <h3 className="font-h3 text-2xl text-white tracking-tight">Live Updates</h3>
              </div>
              <button 
                onClick={fetchBulletins}
                disabled={isLoading}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 border border-white/5"
              >
                <span className={`material-symbols-outlined text-slate-400 text-xl ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
              </button>
            </div>
            
            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-5">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/4" />
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
                    className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                      bulletin.urgent 
                        ? "bg-primary/5 border-primary/20 shadow-[0_10px_30px_rgba(0,229,255,0.05)]" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] ${bulletin.urgent ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                        {bulletin.category}
                      </div>
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{bulletin.time}</span>
                    </div>
                    <p className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors mb-3">
                      {bulletin.title}
                    </p>
                    {bulletin.description && (
                      <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-3">{bulletin.description}</p>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            <button className="w-full mt-8 py-5 bg-white/5 rounded-2xl text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all border border-white/10">
              Protocol Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
