/**
 * Firebase Configuration
 * Urban Living - Property Management Platform
 * 
 * TODO: Replace the firebaseConfig values with your actual Firebase project credentials
 * Get these from: Firebase Console > Project Settings > General > Your apps
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration object
// Project: urban-living-4b969
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBlSOYAeADvVJVgkUwbrJAFUc68oWUfyIs",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "urban-living-4b969.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "urban-living-4b969",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "urban-living-4b969.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "467793665080",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:467793665080:web:30806850d4c01be2271acd",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GQQD51Z7BT"
};

// Initialize Firebase (singleton pattern to prevent multiple initializations)
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Initialize Firebase services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// Initialize Analytics (only on client-side)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
export { analytics };

// Export the app instance
export default app;
