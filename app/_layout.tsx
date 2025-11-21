import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import './globals.css';

const GOOGLE_SIGNUP_FLAG_KEY = "fromGoogle"; 

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isBypassCheckComplete, setIsBypassCheckComplete] = useState(false);
  
  const isReady = !loading && isBypassCheckComplete;

  useEffect(() => {
    const checkBypassFlag = async () => {
      try {
        const flag = await SecureStore.getItemAsync(GOOGLE_SIGNUP_FLAG_KEY);
        setIsSigningUp(flag === "true");
      } catch (e) {
        console.error("Failed to read Google sign-up flag:", e);
      } finally {
        setIsBypassCheckComplete(true);
      }
    };
    
    if (!loading) {
        checkBypassFlag();
    }
  }, [loading]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } 
    else if (user && inAuthGroup && !isSigningUp) { 
      router.replace('/(tabs)'); 
    }
    
  }, [user, isReady, isSigningUp, router, segments]);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}