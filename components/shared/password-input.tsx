import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isInvalid?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = "Password",
  value,
  onChangeText,
  error,
  isInvalid,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const hasError = error && error.length > 0;
  const borderColor = hasError || isInvalid ? "#E65656" : "#919191";

  return (
    <View className="w-full mb-[5px]">
      <View className="relative w-full">
        <View
          className="w-full pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px]"
          style={{ borderColor }}
        >
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
            {label}
          </Text>
          <TextInput
            className="text-black text-[16px] pr-10"
            secureTextEntry={!isVisible}
            keyboardType="default"
            autoCapitalize="none"
            value={value}
            onChangeText={onChangeText}
          />
        </View>

        <TouchableOpacity
          onPress={() => setIsVisible(!isVisible)}
          activeOpacity={1}
          className="absolute right-5 pr-2 top-1/2 -translate-y-1/2"
        >
          <Image
            source={
              isVisible
                ? require("@/assets/images/eyeopen.png")
                : require("@/assets/images/eyeclosed.png")
            }
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {hasError && (
        <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
          {error}
        </Text>
      )}
    </View>
  );
};