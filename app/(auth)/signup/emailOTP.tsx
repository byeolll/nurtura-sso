
import { OTPInput } from "@/components/auth/OTPInput";
import { ResendCode } from "@/components/auth/resendCode";
import { PrimaryButton } from "@/components/shared/primaryButton";
import { useEmailOTP } from "@/hooks/auth/useEmailOTP";
import { Text, View } from "react-native";
import "../../globals.css";

const EmailOTP = () => {
  const {
    otp,
    inputs,
    savedEmail,
    isOtpInvalid,
    loading,
    timer,
    allFilled,
    handleChange,
    handleKeyPress,
    handleFocus,
    handleNextPress,
    handleResendPress,
  } = useEmailOTP();

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] pl-2 mb-[13px]">
          Enter one-time code
        </Text>

        <Text className="pl-2 mb-[20px] text-[13px] text-gray-700 leading-normal">
          Enter the 5 digit code that was sent to your email address:{" "}
          <Text className="text-primary font-bold">{savedEmail}</Text>
        </Text>

        <OTPInput
          otp={otp}
          onChangeOtp={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          inputRefs={inputs}
          isInvalid={isOtpInvalid}
        />

        {isOtpInvalid && (
          <Text className="text-[#E65656] text-[13px] mb-[26px] pl-2">
            Invalid OTP. Please try again.
          </Text>
        )}

        <ResendCode onResend={handleResendPress} timer={timer} />
      </View>

      <View className="w-full">
        <PrimaryButton
          onPress={handleNextPress}
          loading={loading}
          disabled={!allFilled}
          title="Next"
        />
      </View>
    </View>
  );
};

export default EmailOTP;