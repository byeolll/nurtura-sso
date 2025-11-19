import React from "react";
import { Text, TextInput, View } from "react-native";

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  optional?: boolean;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  className = "",
  width = "w-full",
  optional = false,
}) => {
  return (
    <View className={`${width} ${className}`}>
      <View className="w-full pt-2 px-3 border-[2px] rounded-[12px] bg-white border-[#919191]">
        <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
          {label}
          {optional && " (optional)"}
        </Text>
        <TextInput
          className="text-black text-[16px]"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#919191"
        />
      </View>
    </View>
  );
};
