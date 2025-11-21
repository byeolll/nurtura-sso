import { Image, Text, TouchableOpacity } from "react-native";

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const GoogleSignInButton = ({
  onPress,
  disabled,
}: GoogleSignInButtonProps) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center p-6 rounded-[12px] w-[100%]   ${
        disabled ? "opacity-50 bg-gray-200" : "opacity-100 shadow bg-white"
      }`} 
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={require("@/assets/images/google.png")}
        className="w-5 h-5 mr-3"
        resizeMode="contain"
      />
      <Text className="text-[16px] font-semibold text-black">
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
};
