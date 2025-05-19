// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWSjTznIUvFbDfFjkCQN4C6yo8YUwe1ps",
  authDomain: "memo-app-131506.firebaseapp.com",
  projectId: "memo-app-131506",
  storageBucket: "memo-app-131506.firebasestorage.com",
  messagingSenderId: "177781629248",
  appId: "1:177781629248:web:5897109367333ff8125aa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//FireStoreの認証
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db,auth, provider };

