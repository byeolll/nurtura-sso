import React from "react";
import { ScrollView, Text, View } from "react-native";

const termsAndConditions = () => {
  return (
    <ScrollView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-1 bg-white p-6 rounded-3xl shadow-md space-y-6">
        <Text className="text-[#6C7C59] text-center text-[24px] font-bold mb-4">
          Terms and Conditions
        </Text>

        <Text className="text-gray-700 text-base leading-loose text-center mb-6">
          Welcome to our application. By using this app, you agree to comply
          with and be bound by the following terms and conditions of use. Please
          read them carefully.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          1. Acceptance of Terms
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          By accessing or using this app, you agree to be legally bound by these
          Terms and Conditions. If you do not agree, please do not use the app.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          2. Use of the App
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          You agree to use the app only for lawful purposes. You must not
          attempt to gain unauthorized access to the system or interfere with
          the app’s functionality.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          3. Account Responsibility
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          4. Limitation of Liability
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          We are not liable for any damages that may result from the use or
          inability to use this app, including any technical errors or service
          interruptions.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          5. Changes to Terms
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          We may update these Terms and Conditions at any time. Continued use of
          the app after changes means you accept the updated terms.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          6. Contact Us
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          If you have any questions or concerns about these Terms and
          Conditions, please contact us through email.
        </Text>
      </View>
    </ScrollView>
  );
};

export default termsAndConditions;
