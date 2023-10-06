// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAKFGFBIQCilV0P5RryGQZynqKm3dPMde0",
    authDomain: "empireapplications-5f8d5.firebaseapp.com",
    projectId: "empireapplications-5f8d5",
    storageBucket: "empireapplications-5f8d5.appspot.com",
    messagingSenderId: "930496669380",
    appId: "1:930496669380:web:a5ad107a88644b898c0b91",
    measurementId: "G-0H11DVRDBW"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
