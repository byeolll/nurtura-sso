import { useAuth } from "@/contexts/AuthContext";
import { cleanInput, validateEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginInvalid, setIsLoginInvalid] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { signIn, googleSignInAndVerify } = useAuth();

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const handleEmailChange = (value: string) => {
    const cleaned = cleanInput(value);
    setEmail(cleaned);

    if (cleaned.trim() === "") {
      setEmailError("");
      setIsLoginInvalid(false);
      return;
    }

    const error = validateEmail(cleaned);
    setEmailError(error);
  };

  const handlePasswordChange = (value: string) => {
    const cleaned = cleanInput(value);
    setPassword(cleaned);
    if (cleaned.trim() === "" || email.trim() === "") {
      setIsLoginInvalid(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    setIsLoginInvalid(false);

    try {
      await signIn(email, password);
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      setIsLoginInvalid(true);
      Alert.alert("Invalid Login", "No account found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoginInvalid(false);
    setLoading(true);

    try {
      if (!LOCAL_IP || !PORT) {
        Alert.alert("Error", "Configuration error. Please contact support.");
        return;
      }

      const success = await googleSignInAndVerify(LOCAL_IP, PORT);

      if (success) {
        router.replace("/(tabs)/profile");
      } else {
        Alert.alert(
          "Google Sign-In Failed",
          "No account found. Please try again."
        );
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    isPasswordVisible,
    isLoginInvalid,
    emailError,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleLogin,
    handleGoogleSignIn,
  };
};
