import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";
import "../../globals.css";

const EmailOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  // input function, para auto next once mag type ng number
  const handleChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 4) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  // checker if all inputs ay filled
  const allFilled = otp.every((v) => v !== "");

  // pag clinick next, andito yung nextpage and pangkuha ng tinype ni user na OTP
  const handleNextPress = () => {
    const code = otp.join("");
    console.log("Entered OTP:", code);
    router.push("/(auth)/signup/createPassword");
  };

  // para mag backspace sa input
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  // para mag focus sa first empty input
  const handleFocus = () => {
    const firstEmpty = otp.findIndex((v) => v === "");
    if (firstEmpty !== -1) {
      inputs.current[firstEmpty]?.focus();
    }
  };

  const [timer, setTimer] = useState(0); // in seconds

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // pwede dito ipasok yung mangyayari once nag click ng resend
  const handleResendPress = () => {
    if (timer === 0) {
      console.log("Resend clicked");
      setTimer(30); // start 30s cooldown
    }
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-center">
        <Text className="text-black font-bold text-[24px] ml-6 pr-[100%] mb-[13px]">
          Enter one-time code
        </Text>

        <Text className="ml-3 mb-[26px] text-[13px] text-gray-700 leading-normal">
          Enter the 5 digit code that was sent to your email address.
        </Text>

        <View className="flex-row justify-between w-[95%] self-center mb-[26px]">
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={handleFocus}
              keyboardType="number-pad"
              maxLength={1}
              className="h-[60px] w-[60px] border-grayText border-[2px] rounded-[12px] text-black text-center text-[18px] font-bold"
              returnKeyType="next"
            />
          ))}
        </View>

        <View className="self-start ml-3 mb-[26px] flex-row items-center">
          <Text className="text-[13px] text-gray-700 leading-normal">
            Didn't receive the code?{" "}
          </Text>
          <TouchableOpacity
            onPress={handleResendPress}
            disabled={timer > 0} // disable button while timer active
          >
            <Text
              className={`text-[13px] font-semibold underline ${
                timer > 0 ? "text-gray-400" : "text-primary"
              }`}
            >
              Resend code
            </Text>
          </TouchableOpacity>

          {/* timer display */}
          {timer > 0 && (
            <Text className="ml-2 text-[13px] text-gray-500">({timer}s)</Text>
          )}
        </View>
      </View>

      <View className="w-full">
        <TouchableOpacity
          onPress={handleNextPress}
          className={`w-full p-7 rounded-[12px] mt-2 flex items-center ${
            allFilled ? "bg-primary" : "bg-[#919191]"
          }`}
          disabled={!allFilled}
        >
          <Text className="text-white text-[16px] font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmailOTP;
