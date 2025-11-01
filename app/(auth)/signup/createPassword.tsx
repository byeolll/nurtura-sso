import { useAuth } from '@/contexts/AuthContext';
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
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
  const { signUp } = useAuth();

  // para sa show/hide password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // para sa password inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // password validation
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const { email } = useLocalSearchParams();
  const normalizedEmail = Array.isArray(email) ? email[0] : email || "";

  // pang-enable lang sa Next button
  const isNextButtonEnabled =
    isPasswordValid && isConfirmPasswordValid && passwordsMatch;

  console.log("Next button enabled:", isNextButtonEnabled);

  useEffect(() => {
    console.log("isNextButtonEnabled:", isNextButtonEnabled);
  }, [isNextButtonEnabled]);

  useEffect(() => {
    console.log("CreatePassword component mounted");
  }, []);

  // regex para sa password
  const isStrongPassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasSymbol && hasDigit && isLongEnough;
  };

  // real-time validation
  useEffect(() => {
    if (password.length > 0) {
      const valid = isStrongPassword(password);
      setIsPasswordValid(valid);
      console.log(
        valid ? "Set password is valid." : "Set password is not valid."
      );
    }

    if (confirmPassword.length > 0) {
      const valid = isStrongPassword(confirmPassword);
      setIsConfirmPasswordValid(valid);
      console.log(
        valid ? "Confirm password is valid." : "Confirm password is not valid."
      );
    }

    if (password && confirmPassword) {
      const match = password === confirmPassword;
      setPasswordsMatch(match);
      console.log(match ? "Passwords match." : "Passwords do not match.");
    }
  }, [password, confirmPassword]);

  // sa next press lang
  const handleNextPress = async () => {
    console.log("Next button pressed!");
    
      if (passwordsMatch && isPasswordValid && isConfirmPasswordValid) {
        
        try {
          const { user, token } = await signUp(normalizedEmail, password);
          await SecureStore.setItemAsync("firebaseToken", token);

          router.push({
            pathname: "/(auth)/signup/createUserInfo",
            params: { email },
          });
        } catch (error: any) {
          Alert.alert('Signup Failed', error.message);
        }
      }else {
        Alert.alert("Invalid Password", "Please check your inputs again.");
      }
  };

  // togge lang
  const togglePasswordVisibility = () => {
    if (isPasswordVisible) {
      setIsPasswordVisible(false);
    } else {
      setIsPasswordVisible(true);
    }
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] pr-[110px] mb-[13px] pl-2">
          Set your password
        </Text>

        <Text className="mb-[20px] text-[13px] text-gray-700 leading-normal pl-2">
          Enter a secure password to protect your account.
        </Text>

        <View className="relative w-full mb-[5px]">
          <View
            className={`w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[6px] ${
              password.length === 0
                ? "border-[#919191]"
                : isPasswordValid
                  ? "border-[#4CAF50]"
                  : "border-[#E65656]"
            }`}
          >
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Set password
            </Text>

            <TextInput
              className="text-black text-[16px] pr-10"
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          {!isPasswordValid && password.length > 0 && (
            <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
              Password must have 8+ chars, uppercase, number & symbol.
            </Text>
          )}

          <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
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
          <View
            className={`w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[6px] ${
              confirmPassword.length === 0
                ? "border-[#919191]"
                : !passwordsMatch
                  ? "border-[#E65656]"
                  : isConfirmPasswordValid
                    ? "border-[#4CAF50]"
                    : "border-[#E65656]"
            }`}
          >
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Confirm password
            </Text>

            <TextInput
              className="text-black text-[16px] pr-10"
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>

          {/* ⚠️ Confirm password error messages */}
          {!passwordsMatch && confirmPassword.length > 0 && (
            <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
              Passwords do not match.
            </Text>
          )}

          {!isConfirmPasswordValid &&
            confirmPassword.length > 0 &&
            passwordsMatch && (
              <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
                Password must have 8+ chars, uppercase, number & symbol.
              </Text>
            )}

          <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
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
