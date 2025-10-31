import React from "react";
import { Text, View } from "react-native";

const privacyPolicy = () => {
  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <View className="flex-1 bg-white p-6 rounded-3xl shadow-md space-y-6">
        <Text className="text-[#6C7C59] text-center text-[24px] font-bold mb-4">
          Privacy Policy
        </Text>

        <Text className="text-gray-500 text-center text-[12px] mb-6 mt-2">
          Last updated: October 31, 2025
        </Text>

        <Text className="text-gray-700 text-base leading-loose text-center mb-6">
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use
          our app.
        </Text>

        <View>
          <Text className="text-black font-bold text-[18px] mb-2">
            1. Information We Collect
          </Text>
          <Text className="text-gray-700 text-base leading-loose mb-4">
            We may collect personal information such as your name, birthday,
            email address, and usage data to provide a better experience and
            improve our services.
          </Text>
        </View>

        <View>
          <Text className="text-black font-bold text-[18px] mb-2">
            2. How We Use Your Information
          </Text>
          <Text className="text-gray-700 text-base leading-loose mb-4">
            The data we collect is used to operate and maintain the app,
            personalize your experience, send important notifications, and
            improve system performance.
          </Text>
        </View>

        <View>
          <Text className="text-black font-bold text-[18px] mb-2">
            3. Data Security
          </Text>
          <Text className="text-gray-700 text-base leading-loose mb-4">
            We implement security measures to protect your data, but please be
            aware that no system is completely secure from potential breaches.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default privacyPolicy;
