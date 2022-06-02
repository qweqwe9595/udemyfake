// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMQwfBMwT_UGY8QGqS86gk8kp-g1yyd_s",
  authDomain: "udemyfake-64b38.firebaseapp.com",
  projectId: "udemyfake-64b38",
  storageBucket: "udemyfake-64b38.appspot.com",
  messagingSenderId: "743427137962",
  appId: "1:743427137962:web:559c8ad843995418a00bd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db} 