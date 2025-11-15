// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later
const firebaseConfig = {
  apiKey: "AIzaSyDDatdTv6dY4ZD0ZkbyV5jRc6JkSyAVDR4",
  authDomain: "mindsync-23edf.firebaseapp.com",
  projectId: "mindsync-23edf",
  storageBucket: "mindsync-23edf.firebasestorage.app",
  messagingSenderId: "601692426960",
  appId: "1:601692426960:web:389a6aa38c75a2e65244d5",
  measurementId: "G-RYXBDFDNQ6"
};

if (firebaseConfig.apiKey === "TU_API_KEY") {
  console.warn("ADVERTENCIA: Faltan las credenciales de Firebase en src/lib/firebase.ts. La base de datos no funcionará.");
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);