import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const requiredFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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
export const isFirebaseConfigured = Object.values(requiredFirebaseConfig).every(Boolean);

export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported && isFirebaseConfigured) {
      return getAnalytics(app);
    }
  }

  return null;
};

export default app;
