import React from "react";
import { Image, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface GoogleSignInButtonProps extends TouchableOpacityProps {
  title?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  title = "Continue with Google",
  ...touchableProps
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center p-6 rounded-[12px] w-full bg-white shadow-sm-subtle"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      {...touchableProps}
    >
      <Image
        source={require("@/assets/images/google.png")}
        className="w-5 h-5 mr-3"
        resizeMode="contain"
      />
      <Text className="text-[16px] font-semibold text-black">{title}</Text>
    </TouchableOpacity>
  );
};