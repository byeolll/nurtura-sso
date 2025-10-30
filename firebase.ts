// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider, signInWithCredential, getAuth, Auth } from "firebase/auth";
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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const googleProvider = new GoogleAuthProvider();

export function signInWithGoogleCredential(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export { app, auth };