import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '@/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read'],
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
      await createUserWithEmailAndPassword(auth, email, password);
    };

  const signIn = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      
      const idToken = result.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google');

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      //access permission prompt to sa google bday
      const accessToken = (await GoogleSignin.getTokens()).accessToken;
      let birthday: string | null = null;
      try {
        const response = await fetch(
          'https://people.googleapis.com/v1/people/me?personFields=birthdays',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await response.json();
        if (data.birthdays && data.birthdays.length > 0) {
          const date = data.birthdays[0].date;
          birthday = `${date.year || ''}-${date.month || ''}-${date.day || ''}`;
        }
      } catch (err) {
        console.log('Failed to fetch birthday:', err);
      }

      const displayName = firebaseUser.displayName || '';
      const [firstName, lastName] = displayName.split(' ');

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firstName || null,
        lastName: lastName || null,
        username: firebaseUser.email?.split('@')[0] || null,
        photo: firebaseUser.photoURL || null,
        birthday,
      });
    } catch (error) {
      console.log('Google Sign-In Error:', error);
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
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};