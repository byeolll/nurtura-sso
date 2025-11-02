import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ForgotPassword1 = () => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = React.useState("");

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    const clearStorageOnFirstEntry = async () => {
      if (isFirstMount) {
        await SecureStore.deleteItemAsync("forgot_password_email");
        await SecureStore.deleteItemAsync("forgot_password_verified_email");
        await SecureStore.deleteItemAsync("forgot_password_new_password");
        await SecureStore.deleteItemAsync("forgot_password_confirm_password");
        setIsFirstMount(false);
      }
    };

    clearStorageOnFirstEntry();
  }, []);

  useEffect(() => {
    const loadSavedEmail = async () => {
      const savedEmail = await SecureStore.getItemAsync(
        "forgot_password_email"
      );
      if (savedEmail) {
        setEmail(savedEmail);
        validateEmail(savedEmail);
      }
    };
    loadSavedEmail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Go back?", "Your process will be deleted and cleared.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              await SecureStore.deleteItemAsync("forgot_password_email");
              await SecureStore.deleteItemAsync(
                "forgot_password_verified_email"
              );
              await SecureStore.deleteItemAsync("forgot_password_new_password");
              await SecureStore.deleteItemAsync(
                "forgot_password_confirm_password"
              );
              router.back();
            },
          },
        ]);
        return true; // prevent default back action
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  const cleanInput = (text: string) => {
    return text
      .replace(/\s/g, "") // remove spaces
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
        ""
      ); // remove emojis
  };

  const isNextButtonEnabled = email.length > 0 && isEmailValid;

  const handleEmailChange = (value: string) => {
    const cleanValue = cleanInput(value);
    setEmail(cleanValue);
    validateEmail(cleanValue);
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError("Please enter a valid email address.");
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
  };

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

  const handleNextPress = async () => {
    if (!isNextButtonEnabled) return;

    setLoading(true);

    try {
      const savedEmail = await SecureStore.getItemAsync(
        "forgot_password_email"
      );
      const verifiedEmail = await SecureStore.getItemAsync(
        "forgot_password_verified_email"
      );

      if (savedEmail && savedEmail !== email) {
        console.log("Email changed, clearing previous data");
        await SecureStore.deleteItemAsync("forgot_password_verified_email");
        await SecureStore.deleteItemAsync("forgot_password_new_password");
        await SecureStore.deleteItemAsync("forgot_password_confirm_password");
      }

      await SecureStore.setItemAsync("forgot_password_email", email);

      // Skip OTP if already verified
      if (verifiedEmail === email) {
        console.log("Email already verified, skipping OTP");
        router.push({
          pathname: "/(auth)/forgetpassword/forgotPassword3",
          params: { email },
        });
        setLoading(false);
        return;
      }

      const emailTaken = await isEmailAlreadyRegistered(email);

      if (!emailTaken) {
        setLoading(false);
        return Alert.alert("Error", "Email is not registered!");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setLoading(false);
      return Alert.alert("Error", "An error occured when verifying the email.");
    }

    try {
      const otp = Math.floor(10000 + Math.random() * 90000);
      const currentTime = new Date();
      const expireTime = new Date(currentTime.getTime() + 15 * 60000);
      const formattedTime = expireTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/email-service/forgot-password-otp`,
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
        setLoading(false);

        router.push({
          pathname: "/(auth)/forgetpassword/forgotPassword2",
          params: { email },
        });
      } else {
        setLoading(false);
        console.error("Error sending OTP:", result.message);
        Alert.alert("Error", "Failed to send OTP.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Unable to send OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] mb-[20px] pl-2">
          Find your account
        </Text>

        <View
          className={`w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] ${
            emailError ? "border-[#ef8d8d]" : "border-[#919191]"
          }`}
        >
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
            Email
          </Text>

          <TextInput
            className="text-black text-[16px]"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={handleEmailChange}
            value={email}
          />
        </View>

        {/* 🔹 Error message */}
        {emailError.length > 0 && (
          <Text className="text-[#E65656] text-[13px] mt-1 pl-2">
            {emailError}
          </Text>
        )}
      </View>

      <View className="w-full">
        <TouchableOpacity
          onPress={handleNextPress}
          className={`w-full p-6 rounded-[12px] mt-2 flex items-center ${
            isNextButtonEnabled ? "bg-primary" : "bg-[#919191]"
          }`}
          disabled={!isNextButtonEnabled || loading}
        >
          <Text className="text-white text-[16px] font-bold">
            {loading ? "Loading..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword1;
