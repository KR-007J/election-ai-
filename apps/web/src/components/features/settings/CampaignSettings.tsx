"use client";

import React from "react";
import { motion } from "framer-motion";

export function CampaignSettings() {
  const [saveMessage, setSaveMessage] = React.useState("");
  const preferences = [
    { id: "notif-email", label: "Email Bulletins", description: "Receive official election updates and deadline reminders via email.", active: true },
    { id: "notif-sms", label: "SMS Alerts", description: "Get real-time text alerts for polling place changes or emergency updates.", active: false },
    { id: "accessibility", label: "Accessibility Support", description: "Request on-site assistance or specialized equipment for in-person voting.", active: false },
  ];

  return (
    <div className="space-y-8 max-w-screen-container-max mx-auto">
      <div>
        <h2 className="font-h2 text-h2 text-white mb-2">Voter Preferences</h2>
        <p className="text-on-surface-variant font-body-lg">Customize your election experience and manage how we communicate with you.</p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Navigation Tabs */}
        <div className="col-span-12 lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 custom-scrollbar">
          <button className="flex items-center gap-3 px-6 py-4 rounded-xl glass-panel text-white border-primary/20 whitespace-nowrap bg-white/10 ring-1 ring-primary/30">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="font-h3 text-[18px]">Notifications</span>
          </button>
          {["Account Security", "Accessibility", "Language", "Data Privacy"].map((tab, i) => (
            <button key={tab} className="flex items-center gap-3 px-6 py-4 rounded-xl glass-panel text-slate-400 hover:text-white transition-colors whitespace-nowrap border border-white/5">
              <span className="material-symbols-outlined">
                {["security", "accessibility_new", "translate", "lock"][i]}
              </span>
              <span className="font-h3 text-[18px]">{tab}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9 space-y-md">
          {/* Notification Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-md rounded-xl border border-white/5"
          >
            <div className="mb-lg">
              <h3 className="font-h3 text-h3 text-white mb-1">Communication Channels</h3>
              <p className="text-sm text-slate-500">Configure how you receive official election information.</p>
            </div>

            <div className="space-y-4">
              {preferences.map((pref) => (
                <div key={pref.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all flex justify-between items-center group">
                  <div className="max-w-xl">
                    <h4 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">{pref.label}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{pref.description}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${pref.active ? "bg-primary" : "bg-slate-700"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${pref.active ? "right-1" : "left-1"}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Verification Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-md rounded-xl border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">verified_user</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Voter Identity Verified</h4>
                <p className="text-sm text-slate-500 mt-1">Your identity has been authenticated with official records. (ID: TX-****-9201)</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
              Update Identity Info
            </button>
          </motion.div>

          {/* Interest Tailoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-md rounded-xl border border-white/5"
          >
            <h4 className="text-white font-bold mb-4">Tailor Your Experience</h4>
            <p className="text-sm text-slate-500 mb-6">Select issues that matter most to you to receive more relevant candidate information.</p>
            <div className="flex flex-wrap gap-3">
              {["Education", "Healthcare", "Economy", "Climate", "Technology", "Infrastructure", "Human Rights"].map(issue => (
                <button key={issue} className="px-5 py-2 rounded-full border border-white/10 hover:border-primary/50 text-xs font-bold text-slate-400 hover:text-primary transition-all">
                  {issue}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-gutter pt-lg border-t border-white/5">
        {saveMessage && (
          <p className="mr-auto text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {saveMessage}
          </p>
        )}
        <button className="text-slate-400 hover:text-white transition-colors font-bold px-6 py-2">
          Discard Changes
        </button>
        <button 
          onClick={() => {
            setSaveMessage("Preferences saved");
            window.setTimeout(() => setSaveMessage(""), 2500);
          }}
          className="bg-primary text-white px-xl py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
