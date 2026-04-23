"use client";

import { useAppStore, type Section } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth
} from "@clerk/nextjs";

interface NavTab {
  id: string;
  label: string;
  icon: string;
}

export const Navbar = () => {
  const { activeSection, setActiveSection } = useAppStore();
  const { isSignedIn } = useAuth();

  const tabs: NavTab[] = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'timeline', label: 'Timeline', icon: '◷' },
    { id: 'guide', label: 'Guide', icon: '☰' },
    { id: 'simulation', label: 'Sims', icon: '⧔' },
    { id: 'deep-dive', label: 'Deep', icon: '⧖' },
    { id: 'quiz', label: 'Quiz', icon: '✧' },
    { id: 'chat', label: 'Chat', icon: '◉' },
  ];

  return (
    <>
      {/* Top Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 h-16 glass-nav"
        style={{ zIndex: 'var(--z-navigation)' }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          {/* Brand */}
          <button
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3" style={{ background: 'var(--gradient-brand)' }}>
              <span className="text-white font-black text-lg">E</span>
            </div>
            <span className="text-2xl font-black tracking-tightest hidden md:block" style={{ color: 'var(--color-text-primary)' }}>
              Elect<span className="text-gradient">IQ</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as Section)}
                className="relative px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:text-white group whitespace-nowrap"
                style={{
                  color: activeSection === tab.id ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {activeSection === tab.id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      background: 'var(--color-accent-glow)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      boxShadow: '0 8px 32px -8px rgba(59, 130, 246, 0.6)' 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {!isSignedIn ? (
              <div className="flex items-center gap-6">
                <SignInButton mode="modal">
                  <button className="text-[11px] font-black uppercase tracking-[0.25em] hover:text-white transition-all opacity-40 hover:opacity-100 px-2">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-[10px] px-10 py-4 uppercase tracking-[0.2em] font-black shadow-premium">
                    Join Platform
                  </button>
                </SignUpButton>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                 <div className="hidden xl:flex items-center gap-3 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ background: 'rgba(16, 185, 129, 0.05)', color: 'var(--color-success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <div className="glow-dot" style={{ width: 6, height: 6 }} />
                    Secure Engine
                 </div>
                 <UserButton appearance={{ elements: { userButtonAvatarBox: "w-11 h-11 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg" } }} />
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile Bottom Tab Bar */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 h-20 lg:hidden px-6 pb-6 glass-nav-bottom"
        style={{
          zIndex: 'var(--z-navigation)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between h-full max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as Section)}
              className="flex flex-col items-center justify-center gap-1.5 min-w-[56px] relative group"
            >
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-active:scale-90"
                style={{
                  background: activeSection === tab.id ? 'var(--color-accent-glow)' : 'transparent',
                  color: activeSection === tab.id ? 'var(--color-accent-hover)' : 'var(--color-text-tertiary)'
                }}
              >
                <span className="text-2xl leading-none">{tab.icon}</span>
              </div>
              <span 
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: activeSection === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}
              >
                {tab.label}
              </span>
              {activeSection === tab.id && (
                <motion.div 
                  layoutId="mobile-indicator"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
              )}
            </button>
          ))}
        </div>
      </motion.nav>
    </>
  );
};
