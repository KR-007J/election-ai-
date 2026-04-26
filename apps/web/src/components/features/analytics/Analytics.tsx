"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";

export function Analytics() {
  const [syncMessage, setSyncMessage] = useState("");
  const deadlines = [
    { date: "Oct 15", event: "Voter Registration Deadline", status: "Critical", color: "#FF3D00" },
    { date: "Oct 25", event: "Mail-in Ballot Request Ends", status: "Upcoming", color: "#00E5FF" },
    { date: "Nov 01", event: "Early Voting Begins", status: "Information", color: "#7000FF" },
    { date: "Nov 05", event: "ELECTION DAY", status: "Main Event", color: "#FFFFFF" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-h1 text-h1 text-white">Election Calendar & Stats</h1>
          <p className="text-on-surface-variant mt-2">Important dates and historical turnout data for your election district.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => {
              setSyncMessage("Calendar sync queued");
              window.setTimeout(() => setSyncMessage(""), 2500);
            }}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
          >
            Sync to My Calendar
          </button>
          {syncMessage && <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{syncMessage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Turnout Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-panel rounded-2xl inner-glow p-8 flex flex-col border border-white/5"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-h3 text-h3 text-white">Historical Turnout</h3>
              <p className="text-xs text-slate-500">Voter participation trends over the last 4 election cycles</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:ring-1 focus:ring-primary outline-none">
              <option>General Elections</option>
              <option>Primaries</option>
              <option>Local Elections</option>
            </select>
          </div>
          <div className="flex-1 flex items-end justify-around pb-10">
            {[45, 52, 68, 74].map((val, i) => (
              <div key={i} className="w-24 flex flex-col items-center gap-4">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className="w-full bg-gradient-to-t from-primary/10 to-primary/40 rounded-t-xl relative group border-x border-t border-primary/20"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}%
                  </div>
                </motion.div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{2012 + i * 4}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deadlines Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl inner-glow p-lg flex flex-col space-y-6 border border-white/5"
        >
          <h3 className="font-h3 text-h3 text-white mb-2">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {deadlines.map((item, i) => (
              <motion.div
                key={item.event}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 group hover:border-primary/50 transition-all"
              >
                <div className="text-center shrink-0">
                  <p className="text-[10px] text-primary font-black uppercase tracking-tighter">{item.date.split(' ')[0]}</p>
                  <p className="text-lg text-white font-h2 leading-none">{item.date.split(' ')[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-bold truncate group-hover:text-primary transition-colors">{item.event}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button type="button" className="w-full py-4 border border-dashed border-white/20 rounded-xl text-[10px] text-slate-500 uppercase font-black tracking-widest hover:border-primary hover:text-primary transition-all">
            View Full Schedule
          </button>
        </motion.div>
      </div>

      {/* Participation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(() => {
          const metrics: Array<{ label: string; value: string; sub: string; icon: AppIconName; color: string }> = [
          { label: "District Rank", value: "#4 of 12", sub: "Top 33% in Turnout", icon: "verified", color: "#FFD700" },
          { label: "Active Voters", value: "84,291", sub: "+2.4% vs Last Month", icon: "person", color: "#00E5FF" },
          { label: "Registered Mail", value: "12.5k", sub: "Requested Ballots", icon: "mail", color: "#7000FF" },
          ];

          return metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="glass-panel p-lg rounded-2xl inner-glow flex items-center gap-6 border border-white/5"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <AppIcon name={metric.icon} className="h-7 w-7" style={{ color: metric.color }} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{metric.label}</p>
              <p className="text-2xl text-white font-h2 mt-1">{metric.value}</p>
              <p className="text-[10px] text-primary font-bold mt-1 opacity-70">{metric.sub}</p>
            </div>
          </motion.div>
          ));
        })()}
      </div>
    </div>
  );
}
