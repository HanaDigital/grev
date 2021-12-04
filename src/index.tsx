import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App";
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from "firebase/analytics";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const firebaseConfig = {
  apiKey: "AIzaSyAc4OW8ZeWVq9Wsd2aFmpXu2KW_ixm9QvY",
  authDomain: "grev-d436d.firebaseapp.com",
  databaseURL: "https://grev-d436d.firebaseio.com",
  projectId: "grev-d436d",
  storageBucket: "grev-d436d.appspot.com",
  messagingSenderId: "23176065109",
  appId: "1:23176065109:web:d195006fba2e134c0b64dc",
  measurementId: "G-7VDRJ62Q9Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, "page_loaded");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();