import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../globals.css";

import { USER_INFO_STORAGE_KEY } from "@/app/(auth)/signup/createUserInfo"; // info ni user galing sa createUserInfo passward passward passward
import { useFocusEffect } from "@react-navigation/native";
import { Modal } from "react-native";

export const SSO_INFO_STORAGE_KEY = "sso_temp_user_info";

const CreateAccount = () => {
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
        await SecureStore.deleteItemAsync("fromGoogle");
        setIsFirstMount(false);
      }
    };

    clearStorageOnFirstEntry();
  }, []);

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

  const removeEmojis = (text: string) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
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

  const handleEmailChange = (value: string) => {
    const cleanText = removeEmojis(value.replace(/\s/g, ""));
    setEmail(cleanText);
    validateEmail(cleanText);
  };

  const isNextButtonEnabled =
    email.length > 0 && isEmailValid && isCheckedTS && isCheckedPP;
  const isGoogleButtonEnabled = isCheckedTS && isCheckedPP;

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
        router.push("/(auth)/signup/createUserInfo");
      }
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      Alert.alert("Google Sign-Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const CHECKBOX_BG_TS = isCheckedTS
    ? "bg-primary"
    : "border-gray-300 border-[2px]";
  const CHECKBOX_BG_PP = isCheckedPP
    ? "bg-primary"
    : "border-gray-300 border-[2px]";

  const scrollViewRef = useRef<{ layoutHeight?: number }>({});

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] mb-[20px] pl-2">
          Create your account
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

        {emailError.length > 0 && (
          <Text className="text-[#E65656] text-[13px] mt-1 pl-2">
            {emailError}
          </Text>
        )}

        <View className="flex-row items-center my-6 mb-[25px] w-full">
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
          <Text className="text-black text-[13px]">or</Text>
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
        </View>

        <TouchableOpacity
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              borderRadius: 12,
              width: "100%",
              backgroundColor:
                isCheckedPP && isCheckedTS ? "#fafafa" : "#ececec",
              opacity: isCheckedPP && isCheckedTS ? 1 : 0.6,
              ...(isCheckedPP && isCheckedTS
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }
                : {}),
            },
          ]}
          onPress={handleGooglePress}
          disabled={!isGoogleButtonEnabled || loading}
        >
          <Image
            source={require("@/assets/images/google.png")}
            className="w-5 h-5 mr-3"
            resizeMode="contain"
          />
          <Text className={"text-[16px] font-semibold text-black"}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full">
        <View className="flex-row items-center justify-start pr-4">
          <TouchableOpacity onPress={handleCheckboxToggleTS}>
            <View
              className={`ml-1 mr-4 w-6 h-6 rounded-md flex items-center justify-center ${CHECKBOX_BG_TS}`}
            >
              {isCheckedTS && (
                <Text className="text-sm font-bold text-white">✓</Text>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-1 flex-row flex-wrap ml-1">
            <Text className="text-[13px] text-black leading-[20px]">
              I have read and agreed to all terms and conditions set with
              Nurtura's{" "}
              <TouchableOpacity
                onPress={() => {
                  setCurrentConsentType("TS");
                  setShowConsentModal(true);
                }}
              >
                <Text className="text-[13px] font-semibold text-primary">
                  Terms of Service
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-start pr-4 mb-4 mt-3">
          <TouchableOpacity onPress={handleCheckboxTogglePP}>
            <View
              className={`ml-1 mr-4 w-6 h-6 rounded-md flex items-center justify-center ${CHECKBOX_BG_PP}`}
            >
              {isCheckedPP && (
                <Text className="text-sm font-bold text-white">✓</Text>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-1 flex-row flex-wrap ml-1">
            <Text className="text-[13px] text-black leading-normal">
              I acknowledge and agree to Nurtura's{" "}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setCurrentConsentType("PP");
                setShowConsentModal(true);
              }}
            >
              <Text className="text-[13px] font-semibold text-primary">
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <Text className="text-[13px] text-black leading-normal">
              regarding the collection and use of my personal data.
            </Text>
          </View>
        </View>

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

      {/* sobrang haba promise */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConsentModal}
        onRequestClose={() => setShowConsentModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-5 w-full max-w-[380px] max-h-[85%]">
            <Text className="text-[18px] font-bold text-center mb-3 text-black">
              {currentConsentType === "TS"
                ? "Terms and Conditions"
                : "Privacy Policy"}
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
              {currentConsentType === "TS" ? (
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

            {/* BUTTONS */}
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-xl mr-2"
                onPress={() => {
                  setHasScrolledToEnd(false);
                  setShowConsentModal(false);
                }}
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
                onPress={() => {
                  if (currentConsentType === "TS") setIsCheckedTS(true);
                  if (currentConsentType === "PP") setIsCheckedPP(true);
                  setHasScrolledToEnd(false);
                  setShowConsentModal(false);
                }}
              >
                <Text className="text-center text-white font-semibold">
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateAccount;
