import { auth } from '@/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
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
  token: string | null;
  //birthday?: string | null; 
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
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>("");

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '871389551301-8d4an920eclthuah35lobfiqum80bnri.apps.googleusercontent.com', 
      offlineAccess: true, 
      forceCodeForRefreshToken: true, 
      scopes: ['profile', 'email'],
    });
  }, []);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     if (firebaseUser) {
  //       const displayName = firebaseUser.displayName || '';
  //       const [firstName, lastName] = displayName.split(' ');
  //       const firebaseToken = await firebaseUser.getIdToken();

  //       setUser({
  //         uid: firebaseUser.uid,
  //         email: firebaseUser.email,
  //         firstName: firstName || null,
  //         lastName: lastName || null,
  //         token: firebaseToken
  //       });
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);


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
      const additionalInfo = (userCredential as any).additionalUserInfo;

      const firebaseUser = userCredential.user;
      const firebaseToken = await firebaseUser.getIdToken();
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
      const additionalInfo = (userCredential as any).additionalUserInfo;
      const firebaseUser = userCredential.user;
      const firebaseToken = await firebaseUser.getIdToken();
      const googleUser = result.data?.user;

      console.log("SignUp" + firebaseUser.email);

        setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: googleUser?.givenName || null,
        lastName: googleUser?.familyName || null,
        token: firebaseToken
      });


      setEmail(firebaseUser.email);

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