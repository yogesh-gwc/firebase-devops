// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnP9Omq5KbnwkHZbxaDIWwIMU9pxbxSs8",
  authDomain: "sample-project-aee1e.firebaseapp.com",
  databaseURL: "https://sample-project-aee1e-default-rtdb.firebaseio.com",
  projectId: "sample-project-aee1e",
  storageBucket: "sample-project-aee1e.firebasestorage.app",
  messagingSenderId: "577574918982",
  appId: "1:577574918982:web:8d08f646f7ae6fd7d42347",
  measurementId: "G-RWGH96TGLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');