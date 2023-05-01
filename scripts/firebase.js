// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKglLyclrqKhfYgDl6SWdTZvha09Jj768",
  authDomain: "fluttergatopedia.firebaseapp.com",
  databaseURL: "https://fluttergatopedia-default-rtdb.firebaseio.com",
  projectId: "fluttergatopedia",
  storageBucket: "fluttergatopedia.appspot.com",
  messagingSenderId: "906400327488",
  appId: "1:906400327488:web:32c39cf107be006691fca5",
  measurementId: "G-XD3EN1YDVE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
