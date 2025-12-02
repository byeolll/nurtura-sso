import { AuthService } from "@/services/authService";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";

const RESEND_COOLDOWN = 30;

export const useEmailOTP = () => {
  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [isOtpInvalid, setIsOtpInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
 
  const authService = LOCAL_IP && PORT ? new AuthService(LOCAL_IP, PORT) : null;
 
  useEffect(() => {
    const loadEmail = async () => {
      const email = await SecureStore.getItemAsync("signup_email");
      setSavedEmail(email);
    };
    loadEmail();
  }, []);
 
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (text: string, index: number) => { 
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
 
    if (isOtpInvalid) {
      setIsOtpInvalid(false);
    }

    if (text && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = () => {
    const firstEmpty = otp.findIndex((v) => v === "");
    if (firstEmpty !== -1) {
      inputs.current[firstEmpty]?.focus();
    }
  };

  const handleNextPress = async () => {
    if (!authService || !savedEmail) {
      Alert.alert("Error", "Configuration error. Please try again.");
      return;
    }

    const code = otp.join("");
    setLoading(true);

    try {
      await authService.verifyOTP({
        email: savedEmail,
        code,
        purpose: "registration",
      });

      console.log("OTP Verified");
      await SecureStore.setItemAsync("verified_email", savedEmail);
      router.replace("/(auth)/signup/createPassword");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setIsOtpInvalid(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendPress = async () => {
    if (timer > 0) return;
    if (!authService || !savedEmail) {
      Alert.alert("Error", "Configuration error. Please try again.");
      return;
    }

    console.log("Resend clicked");
    setTimer(RESEND_COOLDOWN);

    try {
      await authService.resendOTP(savedEmail);
      Alert.alert("Success", "OTP has been resent to your email.");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      Alert.alert("Error", error.message || "Failed to resend OTP.");
      setTimer(0);
    }
  };

  const allFilled = otp.every((v) => v !== "");

  return {
    otp,
    inputs,
    savedEmail,
    isOtpInvalid,
    loading,
    timer,
    allFilled,
    handleChange,
    handleKeyPress,
    handleFocus,
    handleNextPress,
    handleResendPress,
  };
};
