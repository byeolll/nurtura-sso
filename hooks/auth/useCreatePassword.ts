import { isStrongPassword } from "@/utils/validation";
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

  useEffect(() => {
    const loadPasswords = async () => {
      const savedPassword = await SecureStore.getItemAsync("signup_password");
      const savedConfirm = await SecureStore.getItemAsync(
        "signup_confirm_password"
      );

      if (savedPassword) setPassword(savedPassword);
      if (savedConfirm) setConfirmPassword(savedConfirm);
    };
    loadPasswords();
  }, []);

  useEffect(() => {
    const savePasswords = async () => {
      await SecureStore.setItemAsync("signup_password", password);
      await SecureStore.setItemAsync(
        "signup_confirm_password",
        confirmPassword
      );
    };
    savePasswords();
  }, [password, confirmPassword]);

  useEffect(() => {
    if (password.length > 0) {
      const valid = isStrongPassword(password);
      setIsPasswordValid(valid);
      console.log(
        valid ? "Set password is valid." : "Set password is not valid."
      );
    }

    if (confirmPassword.length > 0) {
      const valid = isStrongPassword(confirmPassword);
      setIsConfirmPasswordValid(valid);
      console.log(
        valid ? "Confirm password is valid." : "Confirm password is not valid."
      );
    }

    if (password && confirmPassword) {
      const match = password === confirmPassword;
      setPasswordsMatch(match);
      console.log(match ? "Passwords match." : "Passwords do not match.");
    }
  }, [password, confirmPassword]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text.replace(/\s/g, ""));
  };

  const handleNextPress = async () => {
    console.log("Next button pressed!");
    setLoading(true);

    if (passwordsMatch && isPasswordValid && isConfirmPasswordValid) {
      try {
        console.log("Password set successfully.");
        router.push("/(auth)/signup/createUserInfo");
      } catch (error: any) {
        console.error("Error resetting password:", error);
        Alert.alert("Error", "Unable to reset password. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Invalid Password", "Please check your inputs again.");
      setLoading(false);
    }
  };

  const isNextButtonEnabled =
    isPasswordValid && isConfirmPasswordValid && passwordsMatch;

  return {
    isPasswordVisible,
    password,
    confirmPassword,
    isPasswordValid,
    isConfirmPasswordValid,
    passwordsMatch,
    loading,
    isNextButtonEnabled,
    togglePasswordVisibility,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNextPress,
  };
};
