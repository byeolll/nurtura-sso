import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
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
      console.log(`Email entered: ${email}`);
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
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] mb-[20px] pl-2">
          Create your account
        </Text>

        <View className="w-[100%] pt-2 px-3 border-[#919191] border-[2px] rounded-[12px] bg-white mb-[10px]">
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">Email</Text>

          <TextInput
            className="text-black text-[16px]"
            defaultValue=""
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>
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
          disabled={!isNextButtonEnabled}
        >
          <Text className="text-white text-[16px] font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateAccount;
