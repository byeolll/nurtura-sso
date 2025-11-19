import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  onTextPress?: () => void;
  highlightText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onToggle,
  onTextPress,
  highlightText,
}) => {
  const bgColor = checked ? "bg-primary" : "border-gray-300 border-[2px]";

  // Safe text splitting function
  const getTextParts = () => {
    if (!highlightText) {
      return { before: label, after: "" };
    }
    
    const parts = label.split(highlightText);
    return {
      before: parts[0] || "",
      after: parts.slice(1).join(highlightText) || ""
    };
  };

  const { before, after } = getTextParts();

  return (
    <View className="flex-row items-center justify-start pr-4 mb-3">
      <TouchableOpacity onPress={onToggle}>
        <View
          className={`ml-1 mr-4 w-6 h-6 rounded-md flex items-center justify-center ${bgColor}`}
        >
          {checked && (
            <Text className="text-sm font-bold text-white">✓</Text>
          )}
        </View>
      </TouchableOpacity>

      <View className="flex-1 flex-row flex-wrap ml-1">
        <Text className="text-[13px] text-black leading-[20px]">
          {before}
          {highlightText && (
            <TouchableOpacity onPress={onTextPress}>
              <Text className="text-[13px] font-semibold text-primary">
                {highlightText}
              </Text>
            </TouchableOpacity>
          )}
          {after}
        </Text>
      </View>
    </View>
  );
};