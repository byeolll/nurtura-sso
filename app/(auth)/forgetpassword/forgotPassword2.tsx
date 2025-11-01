import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View
} from 'react-native';

const ForgotPassword2 = () => {

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { email } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const [isOtpInvalid, setIsOtpInvalid] = useState(false); // for styling if otp is invalid hihiz

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
  const handleNextPress = async () => {
    const code = otp.join("");
    setLoading(true);

    try {
      const response = await fetch(`http://${LOCAL_IP}:${PORT}/email-service/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, purpose: "forgot-password" }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("OTP Verified", result);
        router.push({
          pathname: "/(auth)/forgetpassword/forgotPassword3",
          params: { email },
        });
      } else {
        setIsOtpInvalid(true);
        console.error(result.error);
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      Alert.alert("Error", "Network error. Try again.");
      setLoading(false);
    }
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
  const handleResendPress = async () => {
    if (timer === 0) {
      console.log("Resend clicked");
      setTimer(30); // start 30s cooldown

      try {
        const otp = Math.floor(10000 + Math.random() * 90000);
        const currentTime = new Date();
        const expireTime = new Date(currentTime.getTime() + 15 * 60000);
        const formattedTime = expireTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const response = await fetch(`http://${LOCAL_IP}:${PORT}/email-service/forgot-password-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code: otp,
            time: formattedTime,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Success", "OTP has been resent to your email.");
          console.log("OTP resent", result);
        } else {
          Alert.alert("Error", result.message || "Failed to resend OTP.");
          console.error(result.error);
        }

      } catch (error) {
        console.error("Error sending OTP:", error);
        Alert.alert("Error", "Unable to send OTP. Please try again later.");
      }
    }
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
          <View className="mt-[34px] flex-1 items-start">
            <Text className="text-black font-bold text-[24px] pl-2 mb-[13px]">
              Enter one-time code
            </Text>
    
            <Text className="pl-2 mb-[20px] text-[13px] text-gray-700 leading-normal">
              Enter the 5 digit code that was sent to your email address: {""}
              <Text className="text-primary font-bold">{email}</Text>
            </Text>
    
            <View className="flex-row justify-between w-[100%] self-center mb-[10px]">
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
                  className={`h-[60px] w-[60px] border-[2px] rounded-[12px] text-black text-center text-[18px] font-bold ${
                    isOtpInvalid ? "border-[#E65656]" : "border-grayText"
                  }`}
                  returnKeyType="next"
                />
              ))}
            </View>
            {isOtpInvalid && (
              <Text className="text-[#E65656] text-[13px] mb-[26px] pl-2">
                Invalid OTP. Please try again.
              </Text>
            )}
    
            <View className="self-start pl-2 mb-[26px] flex-row items-center">
              <Text className="text-[13px] text-gray-700 leading-normal">
                Didn't receive the code?{" "}
              </Text>
              <TouchableOpacity onPress={handleResendPress} disabled={timer > 0}>
                <Text
                  className={`text-[13px] font-semibold underline ${
                    timer > 0 ? "text-gray-400" : "text-primary"
                  }`}
                >
                  Resend code
                </Text>
              </TouchableOpacity>
    
              {timer > 0 && (
                <Text className="ml-2 text-[13px] text-gray-500">({timer}s)</Text>
              )}
            </View>
          </View>
    
          <View className="w-full">
            <TouchableOpacity
              onPress={handleNextPress}
              className={`w-full p-6 rounded-[12px] mt-2 flex items-center ${
                allFilled ? "bg-primary" : "bg-[#919191]"
              }`}
              disabled={!allFilled}
            >
              <Text className="text-white text-[16px] font-bold">{loading ? "Loading..." : "Next"}</Text>
            </TouchableOpacity>
          </View>
        </View>
  )
}

export default ForgotPassword2