import React from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

interface OTPInputProps {
  otp: string[];
  onChangeOtp: (text: string, index: number) => void;
  onKeyPress: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => void;
  onFocus: () => void;
  inputRefs: React.MutableRefObject<Array<TextInput | null>>;
  isInvalid?: boolean;
}

export const OTPInput = ({
  otp,
  onChangeOtp,
  onKeyPress,
  onFocus,
  inputRefs,
  isInvalid,
}: OTPInputProps) => {
  return (
    <View className="flex-row justify-between w-[100%] self-center mb-[10px]">
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          value={value}
          onChangeText={(text) => onChangeOtp(text, index)}
          onKeyPress={(e) => onKeyPress(e, index)}
          onFocus={onFocus}
          keyboardType="number-pad"
          maxLength={1}
          className={`h-[60px] w-[60px] border-[2px] rounded-[12px] text-black text-center text-[18px] font-bold ${
            isInvalid ? "border-[#E65656]" : "border-grayText"
          }`}
          returnKeyType="next"
        />
      ))}
    </View>
  );
};
