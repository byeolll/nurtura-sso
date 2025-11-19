import { useAuth } from "@/contexts/AuthContext";
import { cleanInput, validateEmail } from "@/utils/validation";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";

export const USER_INFO_STORAGE_KEY = "user_info";
export const SSO_INFO_STORAGE_KEY = "sso_temp_user_info";

export const useCreateAccount = () => {
  const [email, setEmail] = useState("");
  const [isCheckedTS, setIsCheckedTS] = useState(false);
  const [isCheckedPP, setIsCheckedPP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [currentConsentType, setCurrentConsentType] = useState<"TS" | "PP" | null>(null);

  const { googleSignUp } = useAuth();

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  useEffect(() => {
    const clearStorageOnFirstEntry = async () => {
      if (isFirstMount) {
        await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync("signup_email");
        await SecureStore.deleteItemAsync("verified_email");
        await SecureStore.deleteItemAsync("signup_password");
        await SecureStore.deleteItemAsync("signup_confirm_password");
        await SecureStore.deleteItemAsync("fromGoogle");
        await SecureStore.deleteItemAsync("firebaseToken");
        setIsFirstMount(false);
      }
    };

    clearStorageOnFirstEntry();
  }, [isFirstMount]);

  // Load saved email
  useEffect(() => {
    const loadSavedEmail = async () => {
      if (!isFirstMount) {
        const savedEmail = await SecureStore.getItemAsync("signup_email");
        if (savedEmail) {
          setEmail(savedEmail);
          setEmailError(validateEmail(savedEmail));
        }
      }
    };
    loadSavedEmail();
  }, [isFirstMount]);

  // Back handler
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Go back?", "Your process will be deleted and cleared.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
              await SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY);
              await SecureStore.deleteItemAsync("signup_password");
              await SecureStore.deleteItemAsync("signup_confirm_password");
              await SecureStore.deleteItemAsync("verified_email");
              await SecureStore.deleteItemAsync("signup_email");
              await SecureStore.deleteItemAsync("fromGoogle");
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

  const isEmailAlreadyRegistered = async (email: string) => {
    try {
      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/users/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status === 409) {
        return true; // Email taken
      }

      return false; // Email available
    } catch (error) {
      throw error;
    }
  };

  const handleEmailChange = (value: string) => {
    const cleanText = cleanInput(value);
    setEmail(cleanText);
    setEmailError(validateEmail(cleanText));
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

  const handleNextPress = async () => {
    const isNextButtonEnabled = email.length > 0 && !emailError && isCheckedTS && isCheckedPP;
    if (!isNextButtonEnabled) return;

    setLoading(true);

    try {
      const savedEmail = await SecureStore.getItemAsync("signup_email");
      const verifiedEmail = await SecureStore.getItemAsync("verified_email");

      if (savedEmail && savedEmail !== email) {
        console.log("Email changed from", savedEmail, "to", email);
        await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync("signup_password");
        await SecureStore.deleteItemAsync("signup_confirm_password");
        await SecureStore.deleteItemAsync("verified_email");
        await SecureStore.deleteItemAsync("fromGoogle");
      }

      await SecureStore.setItemAsync("signup_email", email);

      if (verifiedEmail === email) {
        console.log("Email already verified, skipping OTP");
        router.push("/(auth)/signup/createPassword");
        setLoading(false);
        return;
      }

      try {
        const emailTaken = await isEmailAlreadyRegistered(email);

        if (emailTaken) {
          setLoading(false);
          return Alert.alert("Error", "Email is already registered!");
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setLoading(false);
        return Alert.alert(
          "Error",
          "An error occured when verifying the email."
        );
      }

      const otp = Math.floor(10000 + Math.random() * 90000);
      const currentTime = new Date();
      const expireTime = new Date(currentTime.getTime() + 15 * 60000);
      const formattedTime = expireTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/email-service/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code: otp,
            time: formattedTime,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Email sent successfully:", result);
        Alert.alert("Success", "OTP has been sent to your email.");
        await SecureStore.setItemAsync("fromGoogle", "false");

        router.push("/(auth)/signup/emailOTP");
      } else {
        console.error("Error sending OTP:", result.message);
        Alert.alert("Error", "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Unable to send OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = async () => {
    const isGoogleButtonEnabled = isCheckedTS && isCheckedPP;
    if (!isGoogleButtonEnabled) return;

    setLoading(true);
    try {
      await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
      await SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY);

      const { userData } = await googleSignUp();

      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/users/SSO-isNewUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email }),
        }
      );

      const result = await response.json();

      if (response.status === 404) {
        return Alert.alert("Error", "Account not found. Please sign up.");
      }

      if (!result.isNewUser) {
        return Alert.alert(
          "Error",
          "This account is already registered. Please Log In instead."
        );
      }

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
        router.replace("/(auth)/signup/createUserInfo");
      }
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      Alert.alert("Google Sign-Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConsentAccept = () => {
    if (currentConsentType === "TS") setIsCheckedTS(true);
    if (currentConsentType === "PP") setIsCheckedPP(true);
    setShowConsentModal(false);
    setCurrentConsentType(null);
  };

  const handleConsentClose = () => {
    setShowConsentModal(false);
    setCurrentConsentType(null);
  };

  const isNextButtonEnabled = email.length > 0 && !emailError && isCheckedTS && isCheckedPP;
  const isGoogleButtonEnabled = isCheckedTS && isCheckedPP;

  return {
    email,
    isCheckedTS,
    isCheckedPP,
    loading,
    emailError,
    showConsentModal,
    currentConsentType,
    isNextButtonEnabled,
    isGoogleButtonEnabled,
    handleEmailChange,
    handleCheckboxToggleTS,
    handleCheckboxTogglePP,
    handleNextPress,
    handleGooglePress,
    handleConsentAccept,
    handleConsentClose,
    setShowConsentModal,
    setCurrentConsentType,
  };
};