"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-body">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <span className="material-symbols-outlined text-4xl text-primary">account_balance</span>
            </div>
            <h1 className="text-3xl font-h1 text-white mb-3 tracking-tight">Election AI Assistant</h1>
            <p className="text-slate-400 text-sm">Sign in to access your intelligence dashboard</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {error && (
              <p className="text-red-400 text-xs text-center font-bold px-4">{error}</p>
            )}

            <div className="flex items-center gap-4 my-8">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">Secure Enterprise Login</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              By signing in, you agree to the Election AI Assistant <br/>
              <span className="text-slate-400 hover:underline cursor-pointer">Terms of Intelligence</span> and <span className="text-slate-400 hover:underline cursor-pointer">Data Privacy Protocol</span>.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            Powered by <span className="text-slate-400 font-bold">Election AI Assistant</span> & Antigravity
          </p>
        </div>
      </motion.div>
    </div>
  );
}
