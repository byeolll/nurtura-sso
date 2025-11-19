import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useCreatePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load saved passwords
  useEffect(() => {
    const loadPasswords = async () => {
      const savedPassword = await SecureStore.getItemAsync("signup_password");
      const savedConfirm = await SecureStore.getItemAsync("signup_confirm_password");

      if (savedPassword) setPassword(savedPassword);
      if (savedConfirm) setConfirmPassword(savedConfirm);
    };
    loadPasswords();
  }, []);

  // Save passwords when they change
  useEffect(() => {
    const savePasswords = async () => {
      await SecureStore.setItemAsync("signup_password", password);
      await SecureStore.setItemAsync("signup_confirm_password", confirmPassword);
    };
    savePasswords();
  }, [password, confirmPassword]);

  // Password validation regex
  const isStrongPassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasSymbol && hasDigit && isLongEnough;
  };

  // Real-time validation
  useEffect(() => {
    if (password.length > 0) {
      const valid = isStrongPassword(password);
      setIsPasswordValid(valid);
    }

    if (confirmPassword.length > 0) {
      const valid = isStrongPassword(confirmPassword);
      setIsConfirmPasswordValid(valid);
    }

    if (password && confirmPassword) {
      const match = password === confirmPassword;
      setPasswordsMatch(match);
    }
  }, [password, confirmPassword]);

  const handlePasswordChange = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text.replace(/\s/g, ""));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleNextPress = async () => {
    setLoading(true);

    if (passwordsMatch && isPasswordValid && isConfirmPasswordValid) {
      try {
        console.log("Password set successfully.");
        router.push("/(auth)/signup/createUserInfo");
      } catch (error: any) {
        console.error("Error setting password:", error);
        Alert.alert("Error", "Unable to set password. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Invalid Password", "Please check your inputs again.");
      setLoading(false);
    }
  };

  const isNextButtonEnabled = isPasswordValid && isConfirmPasswordValid && passwordsMatch;

  // Get border color for password field
  const getPasswordBorderColor = () => {
    if (password.length === 0) return "#919191";
    return isPasswordValid ? "#4CAF50" : "#E65656";
  };

  // Get border color for confirm password field
  const getConfirmPasswordBorderColor = () => {
    if (confirmPassword.length === 0) return "#919191";
    if (!passwordsMatch) return "#E65656";
    return isConfirmPasswordValid ? "#4CAF50" : "#E65656";
  };

  return {
    isPasswordVisible,
    password,
    confirmPassword,
    isPasswordValid,
    isConfirmPasswordValid,
    passwordsMatch,
    loading,
    isNextButtonEnabled,
    handlePasswordChange,
    handleConfirmPasswordChange,
    togglePasswordVisibility,
    handleNextPress,
    getPasswordBorderColor,
    getConfirmPasswordBorderColor,
  };
};