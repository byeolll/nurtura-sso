import { auth } from '@/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserInfo {
  uid: User['uid'] | null ;
  email: User['email'] | null;
  firstName: string | null;
  lastName: string | null;
  token: string | null;
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  email: string | null;
  fetchSignInMethods:(email: string) => Promise<string[]>;
  signUp: (email: string, password: string) => Promise<{ user: any, token: string }>;
  signIn: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<{ userData: any }>;
  googleSignUp: () => Promise<{ userData: any }>;
  logout: () => Promise<void>;
  googleSignInAndVerify: (localIp: string, port: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>("");
  const [googleLoggedIn, setGoogleLoggedIn] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '871389551301-8d4an920eclthuah35lobfiqum80bnri.apps.googleusercontent.com', 
      offlineAccess: true, 
      forceCodeForRefreshToken: true, 
      scopes: ['profile', 'email'],
    });
  }, []);

  if (googleLoggedIn) {
    
  }

useEffect(() => {
  if (googleLoggedIn) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const firebaseToken = await firebaseUser.getIdToken();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firebaseUser.displayName?.split(" ")[0] || null,
          lastName: firebaseUser.displayName?.split(" ")[1] || null,
          token: firebaseToken,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

  return unsubscribe;
  }
}, []);

  const googleSignInAndVerify = async (localIp: string, port: string) => {
    try {
        // Get Google info without touching Firebase
        await GoogleSignin.hasPlayServices();
        const result = await GoogleSignin.signIn();
        const googleEmail = result.data?.user?.email;

        if (!googleEmail) {
            throw new Error("No email found from Google account.");
        }

        const response = await fetch(`http://${localIp}:${port}/users/SSO-isNewUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: googleEmail }),
        });

        const apiResult = await response.json();

        // Check if user doesn't exist in database
        if (response.status === 404 || apiResult.isNewUser) {
            await GoogleSignin.signOut(); 
            throw new Error(response.status === 404 ?
                "Account not found. Please sign up." : 
                "This account is not registered. Please use Sign Up instead."
            );
        }

        // Check if user registered with Google
        const providers = apiResult.providers || [];
        const hasGoogleProvider = providers.includes('google.com');
        
        console.log("Providers for this email:", providers);
        
        if (!hasGoogleProvider) {
            await GoogleSignin.signOut();
            throw new Error(
                "This email is registered with a password. Please sign in using email and password instead."
            );
        }

        // If everything is good, proceed with Firebase sign-in
        const idToken = result.data?.idToken;
        if (!idToken) throw new Error('No ID token returned from Google');

        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);

        const firebaseUser = userCredential.user;
        const firebaseToken = await firebaseUser.getIdToken();
        await SecureStore.setItemAsync("firebaseToken", firebaseToken);

        const googleUser = result.data?.user;

        const userData: UserInfo = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: googleUser?.givenName || null,
          lastName: googleUser?.familyName || null,
          token: firebaseToken
        };

        setUser(userData);
        setGoogleLoggedIn(true);
        return true;

    } catch (error: any) {
        console.error("Verification Error:", error.message);
        await GoogleSignin.signOut();
        setUser(null);
        setGoogleLoggedIn(false);
        return false;
    }
  };


  const fetchSignInMethods = async (email: string) => {
    return await fetchSignInMethodsForEmail(auth, email);
  };

  const signUp = async (email: string, password: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const token = await userCredential.user.getIdToken();

      setEmail(email);

      return{
        user: userCredential.user,
        token
      }
    };

  const signIn = async (email: string, password: string) => {
      setEmail(email);
      
      await signInWithEmailAndPassword(auth, email, password);

    };

  const googleSignIn = async (): Promise<{ userData: UserInfo }> => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google');

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      const firebaseUser = userCredential.user;
      const firebaseToken = await firebaseUser.getIdToken();
      await SecureStore.setItemAsync("firebaseToken", firebaseToken);
      const googleUser = result.data?.user;

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: googleUser?.givenName || null,
        lastName: googleUser?.familyName || null,
        token: firebaseToken
      });

      setEmail(email);

      const userData: UserInfo = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: googleUser?.givenName || null,
        lastName: googleUser?.familyName || null,
        token: firebaseToken,
      };

      return { userData };

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const googleSignUp = async (): Promise<{ userData: UserInfo }> => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;
      if (!idToken) throw new Error("No ID token returned from Google");

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      const firebaseToken = await firebaseUser.getIdToken();
      await SecureStore.setItemAsync("firebaseToken", firebaseToken);
      const googleUser = result.data?.user;

      console.log("SignUp" + firebaseUser.email);

      const userData: UserInfo = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: googleUser?.givenName || null,
        lastName: googleUser?.familyName || null,
        token: firebaseToken,
      };

      return { userData };

      } catch (error: any) {
        throw new Error(error.message);
      }
    };

  const logout = async () => {
    try {
      setUser(null);
      await GoogleSignin.signOut();
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        email,
        fetchSignInMethods,
        googleSignInAndVerify,
        signUp,
        signIn,
        googleSignIn,
        googleSignUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};