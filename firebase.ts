// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQEUsWhzDnyk-cFuG4jfakvsq67VnqtL0",
  authDomain: "nurtura-b967b.firebaseapp.com",
  projectId: "nurtura-b967b",
  storageBucket: "nurtura-b967b.firebasestorage.app",
  messagingSenderId: "871389551301",
  appId: "1:871389551301:web:b1ded72dbe665ef77e6eac"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const googleProvider = new GoogleAuthProvider();