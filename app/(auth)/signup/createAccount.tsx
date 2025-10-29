import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import "../../globals.css";

const CreateAccount = () => {
  const [email, setEmail] = useState(""); // email
  const [isChecked, setIsChecked] = useState(false); // taga check if naka-tick si checkbox
  const isNextButtonEnabled = email.length > 0 && isChecked; // taga-check if may laman email and if naka tick checkbox
  const isGoogleButtonEnabled = isChecked; // taga check if pwede n buksan si google button

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleNextPress = () => {
    if (isNextButtonEnabled) {
      router.push("/(auth)/signup/emailOTP");
    }
  };

  const handleGooglePress = () => {
    if (isGoogleButtonEnabled) {
      console.log("hello david ako si SSO");

      // d2 yung SSO bai
    }
  };

  const CHECKBOX_BG = isChecked ? "bg-primary" : "border-gray-300 border-[2px]"; // colors lang for checkbox

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between">
      <View className="mt-[34px] flex-1 items-center">
        <Text className="text-black font-bold text-[24px] ml-[12px] mr-[119px] mb-[20px]">
          Create your account
        </Text>

        <View className="w-[95%] p-4 border-[#919191] border-[2px] rounded-[12px] bg-white mb-[10px]">
          <Text className="text-primary text-[13px] mb-[4px]">Email</Text>

          <TextInput
            className="text-black text-[16px]"
            defaultValue=""
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>

        <View className="flex-row items-center my-6 mb-[20px]">
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
          <Text className="text-black text-[13px]">or</Text>
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
        </View>

        <TouchableOpacity
          className={`flex-row items-center justify-center p-7 rounded-[12px] shadow-sm w-[95%]
                    ${isGoogleButtonEnabled ? "bg-white" : "bg-gray-100 opacity-60"}`}
          onPress={handleGooglePress}
          disabled={!isGoogleButtonEnabled}
        >
          <Image
            source={require("@/assets/images/google.png")}
            className="w-5 h-5 mr-3"
            resizeMode="contain"
          />
          <Text
            className={`text-[16px] font-semibold ${isGoogleButtonEnabled ? "text-black" : "text-gray-500"}`}
          >
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

          <Text className="ml-3 text-[13px] text-gray-700 leading-tight">
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
          className={`w-full p-7 rounded-[12px] mt-2 flex items-center ${
            isNextButtonEnabled ? "bg-primary" : "bg-[#919191]"
          }`}
          disabled={!isNextButtonEnabled}
        >
          <Text className="text-white text-[16px] font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateAccount;
