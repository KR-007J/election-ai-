import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAuevfgjcomG1vdUJ7oH73Za09n_kPwX38",
  authDomain: "neurolearn-ai-krish-3244.firebaseapp.com",
  projectId: "neurolearn-ai-krish-3244",
  storageBucket: "neurolearn-ai-krish-3244.firebasestorage.app",
  messagingSenderId: "335977019259",
  appId: "1:335977019259:web:c51bd2430307c662a32fde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default app;
