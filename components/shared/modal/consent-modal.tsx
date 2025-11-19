import React, { useRef, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ConsentModalProps {
  visible: boolean;
  type: "TS" | "PP" | null;
  onClose: () => void;
  onAccept: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  visible,
  type,
  onClose,
  onAccept,
}) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const scrollViewRef = useRef<{ layoutHeight?: number }>({});

  const isTerms = type === "TS";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-5 w-full max-w-[380px] max-h-[85%]">
          <Text className="text-[18px] font-bold text-center mb-3 text-black">
            {isTerms ? "Terms and Conditions" : "Privacy Policy"}
          </Text>

          <ScrollView
            className="border border-gray-200 rounded-xl p-3 mb-4"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              scrollViewRef.current.layoutHeight = height;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              if (
                scrollViewRef.current.layoutHeight &&
                contentHeight <= scrollViewRef.current.layoutHeight + 10
              ) {
                setHasScrolledToEnd(true);
              }
            }}
            onScroll={(event) => {
              const { contentOffset, layoutMeasurement, contentSize } =
                event.nativeEvent;
              const isEndReached =
                contentOffset.y + layoutMeasurement.height >=
                contentSize.height - 20;
              if (isEndReached) setHasScrolledToEnd(true);
            }}
            scrollEventThrottle={16}
          >
            {isTerms ? (
              <>
                <Text className="text-black font-bold text-[18px] mb-2">
                  Overview
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  Welcome to Nurtura, an IoT-based smart urban farming system
                  that helps users monitor and automate plant care in real
                  time. These Terms and Conditions govern your use of the
                  Nurtura mobile application, related software, and connected
                  services. By creating an account, downloading, or using
                  Nurtura, you agree to these Terms. Please read them
                  carefully, as they outline your rights, responsibilities,
                  and the limits of our liability.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  1. Acceptance of Terms
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  By accessing or using this app, you agree to be legally
                  bound by these Terms. If you do not agree, please do not use
                  the app.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  2. Use of the App
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  You must be at least 13 years old to use Nurtura. You agree
                  to use the app only for lawful purposes. We reserve the
                  right to suspend or terminate your access if you violate
                  these Terms.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  3. Account Responsibility
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  You are responsible for your account credentials and all
                  activity under your account. Provide accurate information
                  and safeguard your password.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  4. Intellectual Property
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  All content, software, and designs are owned by the Nurtura
                  team. You may not copy, modify, or redistribute without
                  permission.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  5. Limitation of Liability
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  Nurtura is not liable for indirect or consequential damages
                  arising from app usage. Users are responsible for monitoring
                  their plants and system performance.
                </Text>

                <Text className="text-gray-500 text-base leading-loose text-center mt-6">
                  By continuing to use Nurtura, you acknowledge that you have
                  read, understood, and agreed to these Terms and Conditions.
                </Text>
              </>
            ) : (
              <>
                <Text className="text-gray-500 text-center text-[12px] mb-6 mt-2">
                  Last updated: October 31, 2025
                </Text>
                <Text className="text-gray-700 text-base leading-loose text-center mb-6">
                  Your privacy is important to us. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our app.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  1. Information We Collect
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  We may collect your name, birthday, email address, and usage
                  data to provide a better experience and improve our
                  services.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  2. How We Use Your Information
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  The data we collect is used to operate and maintain the app,
                  personalize your experience, and improve system performance.
                </Text>

                <Text className="text-black font-bold text-[18px] mb-2">
                  3. Data Security
                </Text>
                <Text className="text-gray-700 text-base leading-loose mb-4">
                  We take steps to protect your data, but no system is
                  completely secure. Please use the app responsibly.
                </Text>
              </>
            )}
          </ScrollView>

          <View className="flex-row justify-between mt-2">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-xl mr-2"
              onPress={onClose}
            >
              <Text className="text-center text-black font-semibold">
                Decline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ml-2 ${
                hasScrolledToEnd ? "bg-primary" : "bg-gray-400"
              }`}
              disabled={!hasScrolledToEnd}
              onPress={onAccept}
            >
              <Text className="text-center text-white font-semibold">
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};