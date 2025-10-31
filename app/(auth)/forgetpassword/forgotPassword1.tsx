import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const ForgotPassword1 = () => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = React.useState("");

  const removeEmojis = (text: string) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
  };

  const isNextButtonEnabled = email.length > 0 && isEmailValid;

  const handleEmailChange = (value: string) => {
    const cleanValue = removeEmojis(value);
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

  const handleNextPress = async () => {
    router.push("/(auth)/forgetpassword/forgotPassword2");
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
            {loading ? "Sending..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword1;
