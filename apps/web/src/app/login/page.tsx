"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      setError("Authentication is not configured. Add Firebase public env vars.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020617] font-body selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[70%] w-[70%] rounded-full bg-blue-600/5 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[480px]"
        >
          <div className="glass-panel rounded-[3.5rem] border border-white/5 p-10 text-center shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl md:p-14">
            <div className="mb-12">
              <div className="group relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl">
                <span className="material-symbols-outlined text-5xl text-primary transition-transform duration-500 group-hover:rotate-12">
                  account_balance
                </span>
                <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              </div>
              <h1 className="mb-4 text-4xl font-black leading-tight tracking-tighter text-white md:text-5xl">
                NeuroLearn AI
                <br />
                Platform
              </h1>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Command Login</span>
              </div>
            </div>

            <div className="space-y-8">
              <button
                onClick={handleGoogleLogin}
                disabled={loading || !isFirebaseConfigured}
                className="group relative flex w-full items-center justify-center gap-5 overflow-hidden rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] transition-all hover:bg-slate-100 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                {loading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                ) : (
                  <>
                    <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="relative z-10">
                      {isFirebaseConfigured ? "Authenticate via Google" : "Authentication Unavailable"}
                    </span>
                  </>
                )}
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 py-4 text-[10px] font-black uppercase tracking-widest text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <div className="my-10 flex items-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">Protected Secure Gateway</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-medium leading-relaxed text-slate-500">
                  By accessing this intelligence portal, you authorize secure <br className="hidden md:block" />
                  validation of your identity and agree to the <br className="hidden md:block" />
                  <span className="cursor-pointer font-bold text-primary/70 underline decoration-dotted underline-offset-4 transition-colors hover:text-primary">
                    Terms of Command
                  </span>{" "}
                  and{" "}
                  <span className="cursor-pointer font-bold text-primary/70 underline decoration-dotted underline-offset-4 transition-colors hover:text-primary">
                    Privacy Protocol
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-2 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">
              System Identity: <span className="text-slate-500">NeuroLearn AI v1.0.5</span>
            </p>
            <div className="mx-auto h-1 w-12 rounded-full bg-primary/20" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
