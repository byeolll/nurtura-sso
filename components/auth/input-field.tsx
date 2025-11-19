import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isInvalid?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  isInvalid,
  ...textInputProps
}) => {
  const hasError = error && error.length > 0;
  const borderColor = hasError || isInvalid ? "#E65656" : "#919191";

  return (
    <View className="w-full mb-[6px]">
      <View
        className="w-full pt-2 px-3 border-[2px] rounded-[12px] bg-white"
        style={{ borderColor }}
      >
        <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
          {label}
        </Text>
        <TextInput
          className="text-black text-[16px]"
          value={value}
          onChangeText={onChangeText}
          {...textInputProps}
        />
      </View>
      {hasError && (
        <Text className="text-[#E65656] text-[13px] mt-1 pl-2 mb-[10px]">
          {error}
        </Text>
      )}
    </View>
  );
};