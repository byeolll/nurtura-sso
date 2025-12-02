import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/authService";
import {
  cleanInput,
  validateEmail as validateEmailUtil,
} from "@/utils/validation";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";

export const USER_INFO_STORAGE_KEY = "temp_user_info";
export const SSO_INFO_STORAGE_KEY = "sso_temp_user_info";

const STORAGE_KEYS = [
  USER_INFO_STORAGE_KEY,
  SSO_INFO_STORAGE_KEY,
  "signup_email",
  "verified_email",
  "signup_password",
  "signup_confirm_password",
  "fromGoogle",
  "firebaseToken",
];

export const useCreateAccount = () => {
  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const [email, setEmail] = useState("");
  const [isCheckedTS, setIsCheckedTS] = useState(false);
  const [isCheckedPP, setIsCheckedPP] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [currentConsentType, setCurrentConsentType] = useState<
    "TS" | "PP" | null
  >(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  const { googleSignUp } = useAuth();

  // Initialize auth service
  const authService = LOCAL_IP && PORT ? new AuthService(LOCAL_IP, PORT) : null;

  // Clear storage on first mount
  useEffect(() => {
    const clearStorageOnFirstEntry = async () => {
      if (isFirstMount) {
        await Promise.all(
          STORAGE_KEYS.map((key) => SecureStore.deleteItemAsync(key))
        );
        setIsFirstMount(false);
      }
    };
    clearStorageOnFirstEntry();
  }, []);

  // Load saved email after first mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      if (!isFirstMount) {
        const savedEmail = await SecureStore.getItemAsync("signup_email");
        if (savedEmail) {
          setEmail(savedEmail);
          validateEmail(savedEmail);
        }
      }
    };
    loadSavedEmail();
  }, [isFirstMount]);

  // Handle back button
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Go back?", "Your progress will be deleted and cleared.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              await Promise.all(
                STORAGE_KEYS.map((key) => SecureStore.deleteItemAsync(key))
              );
              router.back();
            },
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  const validateEmail = (value: string) => {
    const error = validateEmailUtil(value);
    if (error) {
      setEmailError(error);
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
  };

  const handleEmailChange = (value: string) => {
    const cleanText = cleanInput(value);
    setEmail(cleanText);
    validateEmail(cleanText);
  };

  const handleCheckboxToggleTS = () => {
    if (!isCheckedTS) {
      setCurrentConsentType("TS");
      setShowConsentModal(true);
    } else {
      setIsCheckedTS(false);
    }
  };

  const handleCheckboxTogglePP = () => {
    if (!isCheckedPP) {
      setCurrentConsentType("PP");
      setShowConsentModal(true);
    } else {
      setIsCheckedPP(false);
    }
  };

  const handleConsentAccept = () => {
    if (currentConsentType === "TS") setIsCheckedTS(true);
    if (currentConsentType === "PP") setIsCheckedPP(true);
    setHasScrolledToEnd(false);
    setShowConsentModal(false);
  };

  const handleConsentDecline = () => {
    setHasScrolledToEnd(false);
    setShowConsentModal(false);
  };

  const handleNextPress = async () => {
    if (!isNextButtonEnabled || !authService) return;

    setLoading(true);

    try {
      // Check if email changed
      const savedEmail = await SecureStore.getItemAsync("signup_email");
      const verifiedEmail = await SecureStore.getItemAsync("verified_email");

      if (savedEmail && savedEmail !== email) {
        console.log("Email changed, clearing related data");
        await Promise.all([
          SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY),
          SecureStore.deleteItemAsync("signup_password"),
          SecureStore.deleteItemAsync("signup_confirm_password"),
          SecureStore.deleteItemAsync("verified_email"),
          SecureStore.deleteItemAsync("fromGoogle"),
        ]);
      }

      await SecureStore.setItemAsync("signup_email", email);

      // Skip OTP if already verified
      if (verifiedEmail === email) {
        console.log("Email already verified, skipping OTP");
        router.push("/(auth)/signup/createPassword");
        return;
      }

      // Check if email is already registered
      const emailExists = await authService.checkEmailExists(email);
      if (emailExists) {
        Alert.alert("Error", "Email is already registered!");
        return;
      }

      // Generate and send OTP
      const otp = authService.generateOTP();
      const expiryTime = authService.getOTPExpiryTime();

      await authService.sendOTP({
        email,
        code: otp,
        time: expiryTime,
      });

      Alert.alert("Success", "OTP has been sent to your email.");
      await SecureStore.setItemAsync("fromGoogle", "false");
      router.push("/(auth)/signup/emailOTP");
    } catch (error: any) {
      console.error("Error in handleNextPress:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = async () => {
    if (!isGoogleButtonEnabled || !authService) return;

    setLoading(true);

    try {
      // Clear temp storage
      await Promise.all([
        SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY),
        SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY),
      ]);

      // Sign up with Google
      const { userData } = await googleSignUp();

      // Check if user is new
      const result = await authService.checkSSONewUser(userData.email);

      if (result.isNewUser) {
        const dataToSave = {
          email: userData.email ?? "",
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          token: userData.token ?? "",
        };

        await SecureStore.setItemAsync(
          SSO_INFO_STORAGE_KEY,
          JSON.stringify(dataToSave)
        );
        await SecureStore.setItemAsync("fromGoogle", "true");

        console.log("Google Sign-Up successful");
        router.push("/(auth)/signup/createUserInfo");
      }
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      Alert.alert("Google Sign-Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const isNextButtonEnabled =
    email.length > 0 && isEmailValid && isCheckedTS && isCheckedPP;
  const isGoogleButtonEnabled = isCheckedTS && isCheckedPP;

  return {
    email,
    isCheckedTS,
    isCheckedPP,
    loading,
    emailError,
    showConsentModal,
    currentConsentType,
    hasScrolledToEnd,
    isNextButtonEnabled,
    isGoogleButtonEnabled,
    handleEmailChange,
    handleCheckboxToggleTS,
    handleCheckboxTogglePP,
    handleConsentAccept,
    handleConsentDecline,
    setHasScrolledToEnd,
    handleNextPress,
    handleGooglePress,
    setShowConsentModal,
    setCurrentConsentType,
  };
};
