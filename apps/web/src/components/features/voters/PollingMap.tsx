"use client";

import React, { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";

export function PollingMap() {
  const [zipCode, setZipCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode) return;
    setIsSearching(true);
    // Simulate lookup delay
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-surface/30">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-h3 text-white tracking-tight">Polling Location Finder</h3>
          <p className="text-sm text-slate-500 mt-1">Real-time direction data powered by Google Maps</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <AppIcon name="verified" className="h-4 w-4 text-blue-400" />
          <span className="text-[10px] font-black uppercase text-blue-400">Official Data</span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <AppIcon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Enter Zip Code or Address..."
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={!zipCode || isSearching}
          className="bg-primary hover:bg-primary/80 disabled:opacity-50 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/20"
        >
          {isSearching ? "Searching..." : "Find Location"}
        </button>
      </form>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0e1a]">
        {zipCode && !isSearching ? (
          <iframe
            title="Google Maps Polling Place"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=polling+place+near+${encodeURIComponent(zipCode)}`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <AppIcon name="map" className="h-10 w-10 text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium max-w-xs">
              Enter your zip code above to visualize verified polling locations in your district.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
          <AppIcon name="timer" className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-bold text-white">General Poll Hours</p>
            <p className="text-[10px] text-slate-500">7:00 AM — 8:00 PM (Local Time)</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
          <AppIcon name="description" className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs font-bold text-white">Identification Requirements</p>
            <p className="text-[10px] text-slate-500">Photo ID required in most districts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
