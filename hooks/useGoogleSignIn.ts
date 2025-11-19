// hooks/useGoogleSignIn.ts
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
const PORT = process.env.EXPO_PUBLIC_PORT;

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { googleSignIn, logout } = useAuth();

  const checkUserExists = async (email: string) => {
    const response = await fetch(
      `http://${LOCAL_IP}:${PORT}/users/SSO-isNewUser`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();
    return { response, result };
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { userData } = await googleSignIn();

      if (!userData?.email) {
        Alert.alert("Error", "No email found from Google account.");
        return;
      }

      const { response, result } = await checkUserExists(userData.email);

      if (response.status === 404) {
        await logout();
        return Alert.alert("Error", "Account not found. Please sign up.");
      }

      if (result.isNewUser) {
        await GoogleSignin.signOut();
        return Alert.alert(
          "Error",
          "This account is not registered. Please use Sign Up instead."
        );
      }

      router.replace({
        pathname: "/(tabs)/profile",
        params: { email: userData.email },
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleSignIn,
  };
};