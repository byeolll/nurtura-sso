import React from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  otp: string[];
  inputs: React.MutableRefObject<(TextInput | null)[]>;
  isInvalid: boolean;
  onChange: (text: string, index: number) => void;
  onKeyPress: (e: any, index: number) => void;
  onFocus: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  otp,
  inputs,
  isInvalid,
  onChange,
  onKeyPress,
  onFocus,
}) => {
  return (
    <View className="flex-row justify-between w-[100%] self-center mb-[10px]">
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          value={value}
          onChangeText={(text) => onChange(text, index)}
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
