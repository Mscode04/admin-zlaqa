// Firebase configuration - Unauthenticated access (dev/testing only)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBYahUo9iBNRSxgEv6_SgK6svT-w2rfJk",
  authDomain: "fir-dd32d.firebaseapp.com",
  projectId: "fir-dd32d",
  storageBucket: "fir-dd32d.firebasestorage.app",
  messagingSenderId: "705822768402",
  appId: "1:705822768402:web:689e7d9d1c23edeaf607cb",
  measurementId: "G-RCD993QNPS"
};

// Initialize Firebase App
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Core services
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export default firebaseConfig;