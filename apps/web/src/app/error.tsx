"use client";

import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] p-6 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <AppIcon name="help" className="h-12 w-12" />
      </div>
      
      <h1 className="mb-4 font-h1 text-4xl font-black text-white md:text-5xl">
        Intelligence Disruption
      </h1>
      
      <p className="mb-10 max-w-md text-lg leading-relaxed text-slate-400">
        We&apos;ve encountered an unexpected error while processing election data. 
        Don&apos;t worry, your progress is saved locally.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Reboot System
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
        >
          Return to Base
        </button>
      </div>

      <div className="mt-16 rounded-xl border border-white/5 bg-white/5 p-4">
        <p className="font-mono text-[10px] text-slate-600">
          ERROR_CODE: {error.digest || "UNKNOWN_SYSTEM_FAILURE"}
        </p>
      </div>
    </div>
  );
}
