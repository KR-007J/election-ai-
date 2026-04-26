import { create } from 'zustand';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export type Section = 'home' | 'timeline' | 'guide' | 'quiz' | 'chat' | 'simulation' | 'deep-dive' | 'settings' | 'candidates';

interface AppState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  engineStatus: 'connected' | 'reconnecting' | 'offline';
  setEngineStatus: (status: 'connected' | 'reconnecting' | 'offline') => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  isHighContrast: false,
  toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
  engineStatus: 'connected',
  setEngineStatus: (status) => set({ engineStatus: status }),
}));
