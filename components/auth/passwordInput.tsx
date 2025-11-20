import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  hasError?: boolean;
  label?: string;
}

export const PasswordInput = ({
  value,
  onChangeText,
  isVisible,
  onToggleVisibility,
  hasError,
  label = "Password",
}: PasswordInputProps) => {
  const getBorderColor = () => {
    if (value.length === 0) return "border-[#919191]";
    if (hasError) return "border-[#E65656]";
    return "border-[#4CAF50]";
  };

  return (
    <View className="relative w-full">
      <View
        className={`w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[6px] ${getBorderColor()}`}
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
        onPress={onToggleVisibility}
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
  );
};
