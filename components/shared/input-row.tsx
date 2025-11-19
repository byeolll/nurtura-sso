import React from "react";
import { View } from "react-native";

interface InputRowProps {
  children: React.ReactNode;
  className?: string;
}

export const InputRow: React.FC<InputRowProps> = ({
  children,
  className = "",
}) => {
  return (
    <View className={`w-full gap-5 flex-row justify-between ${className}`}>
      {children}
    </View>
  );
};
