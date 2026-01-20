"use client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAc4OW8ZeWVq9Wsd2aFmpXu2KW_ixm9QvY",
    authDomain: "grev-d436d.firebaseapp.com",
    databaseURL: "https://grev-d436d.firebaseio.com",
    projectId: "grev-d436d",
    storageBucket: "grev-d436d.firebasestorage.app",
    messagingSenderId: "23176065109",
    appId: "1:23176065109:web:d195006fba2e134c0b64dc",
    measurementId: "G-7VDRJ62Q9Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };
