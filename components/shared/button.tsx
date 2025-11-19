import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = "primary",
  disabled,
  ...touchableProps
}) => {
  const isPrimary = variant === "primary";
  const bgColor = isPrimary ? "bg-primary" : "bg-white";
  const textColor = isPrimary ? "text-white" : "text-black";

  return (
    <TouchableOpacity
      className={`w-full p-6 rounded-[12px] flex items-center ${bgColor}`}
      disabled={disabled || loading}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "white" : "#000"} />
      ) : (
        <Text className={`${textColor} text-[16px] font-bold`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};