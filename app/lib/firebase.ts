import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ storage import

const firebaseConfig = {
  apiKey: "AIzaSyDAFvOw8ZZFDqqVVHLCUgnQWUIGBwdLgiQ",
  authDomain: "imsinger-reserve.firebaseapp.com",
  projectId: "imsinger-reserve",
  storageBucket: "imsinger-reserve.appspot.com", // ✅ .appspot.com 으로 정확하게!
  messagingSenderId: "1076968010737",
  appId: "1:1076968010737:web:f78fe1277af94eea9d8a50",
  measurementId: "G-02TY9RDH06"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ storage 객체 export
export default app;
