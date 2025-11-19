import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from "react-native";

export const useEmailOTP = () => {
  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [isOtpInvalid, setIsOtpInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Load saved email
  useEffect(() => {
    const loadEmail = async () => {
      const email = await SecureStore.getItemAsync("signup_email");
      setSavedEmail(email);
    };
    loadEmail();
  }, []);

  // Timer effect
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
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (isOtpInvalid) {
        setIsOtpInvalid(false);
      }

      if (newOtp.every((v) => v === "")) {
        setIsOtpInvalid(false);
      }

      if (text && index < 4) {
        inputs.current[index + 1]?.focus();
      }
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
    const code = otp.join("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/email-service/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: savedEmail, code, purpose: "registration" }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("OTP Verified");
        await SecureStore.setItemAsync("verified_email", savedEmail as string);
        router.replace("/(auth)/signup/createPassword");
      } else {
        console.error("Error verifying OTP:", result.message);
        setIsOtpInvalid(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendPress = async () => {
    if (timer === 0) {
      console.log("Resend clicked");
      setTimer(30);

      try {
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
              email: savedEmail,
              code: otp,
              time: formattedTime,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Success", "OTP has been resent to your email.");
          console.log("OTP resent", result);
        } else {
          Alert.alert("Error", result.message || "Failed to resend OTP.");
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        Alert.alert("Error", "Unable to send OTP. Please try again later.");
      }
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