import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CreatePassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // enable next button kapag may more than 8 char na yung dalawang input box
  const isNextButtonEnabled =
    password.length >= 8 && confirmPassword.length >= 8;


  // next button 
  const handleNextPress = () => {
    if (password === confirmPassword) {
      console.log(`Passwords match: ${password}`);
    } else {
      Alert.alert("Password doesn't match", "Please check your inputs again.");
      console.log(
        `Passwords don't match: first input = ${password}, second = ${confirmPassword}`
      );
    }
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] pr-[110px] mb-[13px] pl-2">
          Set new password
        </Text>

        <Text className="mb-[20px] text-[13px] text-gray-700 leading-normal pl-2">
          Enter a secure password to protect your account.
        </Text>

        <View className="relative w-full mb-[5px]">
          <View className="w-[100%] pt-2 px-3 border-[#919191] border-[2px] rounded-[12px] bg-white mb-[10px]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Set password
            </Text>

            <TextInput
              className="text-black text-[16px] pr-10"
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>
 
          <TouchableWithoutFeedback
            onPressIn={() => setIsPasswordVisible(true)}
            onPressOut={() => setIsPasswordVisible(false)}
          >
            <View className="absolute right-5 top-[50%] -translate-y-1/2 pr-2">
              <Image
                source={
                  isPasswordVisible
                    ? require("@/assets/images/eyeopen.png")
                    : require("@/assets/images/eyeclosed.png")
                }
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
 
        <View className="relative w-full mb-[20px]">
          <View className="w-[100%] pt-2 px-3 border-[#919191] border-[2px] rounded-[12px] bg-white mb-[10px]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Confirm password
            </Text>

            <TextInput
              className="text-black text-[16px] pr-10"
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
 
          <TouchableWithoutFeedback
            onPressIn={() => setIsPasswordVisible(true)}
            onPressOut={() => setIsPasswordVisible(false)}
          >
            <View className="absolute right-5 top-[50%] -translate-y-1/2 pr-2">
              <Image
                source={
                  isPasswordVisible
                    ? require("@/assets/images/eyeopen.png")
                    : require("@/assets/images/eyeclosed.png")
                }
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View className="w-full">
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

export default CreatePassword;
