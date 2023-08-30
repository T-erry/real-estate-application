// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//storage in our firebase
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhEWvCEKC9-a6iAFpRZ9Fh-7p6BUugYZA",
  authDomain: "realtor-clone-160d9.firebaseapp.com",
  projectId: "realtor-clone-160d9",
  storageBucket: "realtor-clone-160d9.appspot.com",
  messagingSenderId: "6844796960",
  appId: "1:6844796960:web:9ee9323a236030a969ac45"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();