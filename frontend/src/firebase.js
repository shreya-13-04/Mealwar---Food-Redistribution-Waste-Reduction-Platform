import { initializeApp } from "firebase/app";

// 🔐 Firebase config (from Firebase Console → Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyCD-eR4yC1eiAv7ja0U2vHAmzKyIZSb6Uk",
  authDomain: "mealwar-b21fb.firebaseapp.com",
  projectId: "mealwar-b21fb",
  storageBucket: "mealwar-b21fb.firebasestorage.app",
  messagingSenderId: "980471042143",
  appId: "1:980471042143:web:f080b685e73297952b4bea",
};

// Initialize Firebase (client-side)
export const app = initializeApp(firebaseConfig);
