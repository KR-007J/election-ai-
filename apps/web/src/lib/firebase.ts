import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD9MC5OVwjZdINiBMYfeaSJbftv-aneetk",
  authDomain: "neurolearn-ai-932b3e.firebaseapp.com",
  projectId: "neurolearn-ai-932b3e",
  storageBucket: "neurolearn-ai-932b3e.firebasestorage.app",
  messagingSenderId: "565317568870",
  appId: "1:565317568870:web:edfb0de029c82da95a60a7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (optional, only on client side)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app };
