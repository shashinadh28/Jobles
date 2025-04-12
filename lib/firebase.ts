// Import the necessary functions from the SDKs
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase configuration object - updated for Vercel deployment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Trigger redeployment with updated environment variables

// Debug environment variables - log the full values in development, partial values in production
if (typeof window !== 'undefined') {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  console.log("Environment:", isProd ? "Production" : "Development");
  console.log("Firebase environment variables check:");
  
  // Only show first few characters of sensitive values in logs
  const maskValue = (value: string | undefined): string => {
    if (!value) return "Not set";
    if (isProd) return value.substring(0, 5) + "...";
    return value; // Show full value in development
  };
  
  console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? maskValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) : "Not set");
  console.log("Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? maskValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) : "Not set");
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? maskValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) : "Not set");
  console.log("Storage Bucket:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Not set");
  console.log("Messaging Sender ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Not set");
  console.log("App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Not set");
  console.log("Measurement ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? "Set" : "Not set");
}

// Initialize Firebase with error handling
let firebaseApp!: FirebaseApp;
let db!: Firestore;
let auth!: Auth;
let storage!: FirebaseStorage;
let analytics: Analytics | undefined;

try {
  // Check if any configuration values are missing
  const missingConfigs = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingConfigs.length > 0) {
    console.error(`Missing Firebase configuration values: ${missingConfigs.join(', ')}`);
    throw new Error("Incomplete Firebase configuration");
  }

  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    console.log("Initializing Firebase app...");
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully!");
  } else {
    console.log("Firebase app already initialized, getting existing app");
    firebaseApp = getApp();
  }

  // Initialize Firestore
  db = getFirestore(firebaseApp);
  console.log("Firestore initialized with db object:", db ? "Success" : "Failed");
  
  // Enable offline persistence for Firestore
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log("Firestore persistence enabled");
      })
      .catch((err) => {
        console.error("Error enabling Firestore persistence:", err);
        if (err.code === 'failed-precondition') {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
          console.warn("The current browser does not support offline persistence.");
        }
      });
  }

  // Initialize other Firebase services
  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);
  
  // Only initialize analytics in the browser
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(firebaseApp);
  }
  
  console.log("All Firebase services initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Initialize with empty objects for error cases to avoid crashes
  if (!db) db = {} as Firestore;
  if (!auth) auth = {} as Auth;
  if (!storage) storage = {} as FirebaseStorage;
}

// Export the initialized services for use in other files
export { db, auth, storage, analytics };

// Function to check if we're online 
export const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

// Export function to reset Firebase connection if needed
export const resetFirebaseConnection = async () => {
  try {
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error resetting Firebase connection:", error);
    return false;
  }
}; 