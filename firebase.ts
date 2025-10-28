// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB29swhL51Yma7m6-oPEtNTpE3acuReRnU",
  authDomain: "nurtura-825b4.firebaseapp.com",
  projectId: "nurtura-825b4",
  storageBucket: "nurtura-825b4.firebasestorage.app",
  messagingSenderId: "98356197107",
  appId: "1:98356197107:web:67a54c6e76813fecb06986",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const googleProvider = new GoogleAuthProvider();