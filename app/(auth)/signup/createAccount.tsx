import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../globals.css";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signInWithGoogleCredential } from "../../../firebase";

const CreateAccount = () => {
  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const isNextButtonEnabled = email.length > 0 && isEmailValid && isChecked;
  const isGoogleButtonEnabled = isChecked;

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleNextPress = async () => {
    if (!isNextButtonEnabled) return;

    setLoading(true);

    try {
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

      console.log("🔹 Fetching from:", `http://${LOCAL_IP}:${PORT}/send-otp`);
  

      const response = await fetch(`http://${LOCAL_IP}:${PORT}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          passcode: otp,
          time: formattedTime,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "OTP has been sent to your email.");
        console.log("Email sent successfully:", result);
        router.push({
          pathname: "/(auth)/signup/emailOTP",
          params: { email },
        });
      } else {
        Alert.alert("Error", result.message || "Failed to send OTP.");
        console.error(result.error);
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

  try {
    await GoogleSignin.signOut();

    const result = await GoogleSignin.signIn();

    console.log("GOOGLE SIGNIN RESULT:", result);

    const idToken = result.data?.idToken;
    if (!idToken) {
      throw new Error("No ID token returned from Google");
    }

    const firebaseResult = await signInWithGoogleCredential(idToken);

    console.log("Firebase login success", firebaseResult.user);

    router.replace("../(tabs)"); 

  } catch (error: any) {
    console.log("Google Sign-In Error:", error);
    Alert.alert("Google Sign-In Failed", error.message);
  }
  };

  const CHECKBOX_BG = isChecked ? "bg-primary" : "border-gray-300 border-[2px]";

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

        {/* 🔹 Error message */}
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
              backgroundColor: isChecked ? "#fafafa" : "#ececec",
              opacity: isChecked ? 1 : 0.6,
              ...(isChecked
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
        <View className="flex-row items-center justify-center px-4 my-4">
          <TouchableOpacity onPress={handleCheckboxToggle}>
            <View
              className={`mx-2 w-6 h-6 rounded-md items-center justify-center ${CHECKBOX_BG}`}
            >
              {isChecked && (
                <Text className="text-sm font-bold text-white">✓</Text>
              )}
            </View>
          </TouchableOpacity>

          <Text className="ml-3 text-[13px] text-black leading-normal">
            By continuing, I agree with Nurtura's{" "}
            <Text className="text-[13px] font-semibold text-primary">
              Terms of Service
            </Text>{" "}
            and acknowledge Nurtura's{" "}
            <Text className="text-[13px] font-semibold text-primary">
              Privacy Policy
            </Text>
            .
          </Text>
        </View>

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

export default CreateAccount;
