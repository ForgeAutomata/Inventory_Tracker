// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvQqxiZJy_DvxZ6SPl3AEvgeKktxwUY1M",
  authDomain: "inventory-management-42889.firebaseapp.com",
  projectId: "inventory-management-42889",
  storageBucket: "inventory-management-42889.appspot.com",
  messagingSenderId: "90651316894",
  appId: "1:90651316894:web:8a2c91c828348b27c8218f",
  measurementId: "G-T6G1HXN2J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}