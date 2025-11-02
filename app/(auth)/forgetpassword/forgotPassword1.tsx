import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const ForgotPassword1 = () => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = React.useState("");

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

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
      console.error("Error checking email:", error);
      throw error;
    }
  };

  const handleNextPress = async () => {
    if (!isNextButtonEnabled) return;

    setLoading(true);

    try {
      const emailTaken = await isEmailAlreadyRegistered(email);

      if (!emailTaken) {
        setLoading(false);
        return Alert.alert("Error", "Email is not registered!");
      }

      const otp = Math.floor(10000 + Math.random() * 90000);
      const currentTime = new Date();
      const expireTime = new Date(currentTime.getTime() + 15 * 60000);
      const formattedTime = expireTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const EMAIL_BORDER_COLOR = emailError
        ? "border-red-500"
        : "border-[#919191]";

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
        Alert.alert("Success", "OTP has been sent to your email.");
        console.log("Email sent successfully:", result);
        router.push({
          pathname: "/(auth)/forgetpassword/forgotPassword2",
          params: { email },
        });
        setLoading(false);
      } else {
        Alert.alert("Error", result.message || "Failed to send OTP.");
        console.error(result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Unable to send OTP. Please try again later.");
      setLoading(false);
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
