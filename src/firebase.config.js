import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAt5Tbnmt-DP16yr8gNLRD9AsTNpMZefjU",
  authDomain: "e-commerce-a6bb0.firebaseapp.com",
  projectId: "e-commerce-a6bb0",
  storageBucket: "e-commerce-a6bb0.appspot.com",
  messagingSenderId: "1046923596744",
  appId: "1:1046923596744:web:4651299f31c8839a69a6fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;