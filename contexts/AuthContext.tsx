import { auth } from '@/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserInfo {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photo?: string | null;
  birthday?: string | null; 
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ user: any, token: string }>;
  signIn: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  googleSignUp: (onNewUserRedirect?: (userData: UserInfo) => void) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '871389551301-8d4an920eclthuah35lobfiqum80bnri.apps.googleusercontent.com', 
      offlineAccess: true, 
      forceCodeForRefreshToken: true, 
      scopes: ['profile', 'email'],
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const displayName = firebaseUser.displayName || '';
        const [firstName, lastName] = displayName.split(' ');

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firstName || null,
          lastName: lastName || null,
          username: firebaseUser.email?.split('@')[0] || null,
          photo: firebaseUser.photoURL || null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const token = await userCredential.user.getIdToken();

      return{
        user: userCredential.user,
        token
      }
    };

  const signIn = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google');

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const additionalInfo = (userCredential as any).additionalUserInfo;

      // pang check if existing
      if (additionalInfo?.isNewUser) {
        throw new Error('This account is not registered. Please use Sign Up instead.');
      }

      const firebaseUser = userCredential.user;
      const googleUser = result.data?.user;

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: googleUser?.givenName || null,
        lastName: googleUser?.familyName || null,
        username: firebaseUser.email?.split('@')[0] || null,
        photo: firebaseUser.photoURL || null,
      });

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const googleSignUp = async (onNewUserRedirect?: (userData: UserInfo) => void) => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google');

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const additionalInfo = (userCredential as any).additionalUserInfo;
      const firebaseUser = userCredential.user;
      const googleUser = result.data?.user;

      const userData: UserInfo = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: googleUser?.givenName || null,
        lastName: googleUser?.familyName || null,
        username: firebaseUser.email?.split('@')[0] || null,
        photo: firebaseUser.photoURL || null,
      };

      if (additionalInfo?.isNewUser) {
        console.log('New Google user detected, redirecting to createUserInfo...');
        if (onNewUserRedirect) {
          onNewUserRedirect(userData);
        } else {
          router.replace(`/(auth)/signup/createUserInfo?fromGoogle=true`);
        }
      } else {
        console.log('User already exists, please sign in instead.');
      }

      setUser(userData);

    } catch (error) {
      console.error('Google Sign-Up Error:', error);
      throw error;
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