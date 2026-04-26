import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const requiredFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(requiredFirebaseConfig).every(
  (value) => typeof value === "string" && value.trim().length > 0,
);

const firebaseConfig = {
  apiKey: requiredFirebaseConfig.apiKey ?? "dev-missing-api-key",
  authDomain: requiredFirebaseConfig.authDomain ?? "dev.local",
  projectId: requiredFirebaseConfig.projectId ?? "dev-project",
  storageBucket: requiredFirebaseConfig.storageBucket ?? "dev-project.appspot.com",
  messagingSenderId: requiredFirebaseConfig.messagingSenderId ?? "0",
  appId: requiredFirebaseConfig.appId ?? "0:0:web:dev",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const initAnalytics = async () => {
  if (typeof window === "undefined" || !isFirebaseConfigured) {
    return null;
  }

  try {
    const supported = await isAnalyticsSupported();
    return supported ? getAnalytics(app) : null;
  } catch {
    return null;
  }
};

export const initPerformance = () => {
  if (typeof window === "undefined" || !isFirebaseConfigured) {
    return null;
  }
  
  try {
    return getPerformance(app);
  } catch {
    return null;
  }
};

export default app;
