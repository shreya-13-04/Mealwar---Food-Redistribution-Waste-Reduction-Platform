import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// ✅ Initialize Firebase ONLY ONCE
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
