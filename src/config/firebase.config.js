import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-0cT9Jr_h874r0La0yIl40cpww-6lCY4",
  authDomain: "cv-maker-v2-db596.firebaseapp.com",
  projectId: "cv-maker-v2-db596",
  storageBucket: "cv-maker-v2-db596.appspot.com",
  messagingSenderId: "559182910195",
  appId: "1:559182910195:web:f643926cd4769f2517dd86",
  measurementId: "G-P932KX040C"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
