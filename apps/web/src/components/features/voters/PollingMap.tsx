"use client";

import React, { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { getMapsEmbedUrl, getExternalMapsUrl } from "@/lib/maps";

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

  const embedUrl = getMapsEmbedUrl(apiKey, zipCode);
  const externalUrl = getExternalMapsUrl(zipCode);

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-surface/30">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-h3 text-white tracking-tight">Polling Location Search</h3>
          <p className="text-sm text-slate-500 mt-1">Utility for finding nearby polling locations via Google Maps</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
          <AppIcon name="map" className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Maps Utility</span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <AppIcon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Enter Zip Code (e.g. 90210)..."
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={!zipCode || isSearching}
          className="bg-primary hover:bg-primary/80 disabled:opacity-50 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
        >
          {isSearching ? "Updating..." : "Find Sites"}
        </button>
      </form>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0e1a]">
        {zipCode && !isSearching ? (
          embedUrl ? (
            <iframe
              title="Google Maps Polling Place"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-surface/40">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20">
                <AppIcon name="help" className="h-8 w-8 text-yellow-500" />
              </div>
              <h4 className="text-white font-bold mb-2">Maps Preview Unavailable</h4>
              <p className="text-slate-500 text-sm max-w-sm mb-6">
                Google Maps integration is not active in this environment. You can view polling locations directly on the official Google Maps site.
              </p>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <AppIcon name="map" className="h-4 w-4" />
                Open External Maps
              </a>
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <AppIcon name="map" className="h-10 w-10 text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium max-w-xs">
              Enter your zip code above to locate suggested polling sites near your area.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
          <AppIcon name="timer" className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-bold text-white">General Poll Hours</p>
            <p className="text-[10px] text-slate-500">Hours vary by district. Typical: 7:00 AM — 8:00 PM.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
          <AppIcon name="description" className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs font-bold text-white">Voter Identification</p>
            <p className="text-[10px] text-slate-500">Check local requirements for photo ID and registration proof.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
