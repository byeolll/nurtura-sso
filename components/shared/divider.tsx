import { Text, View } from "react-native";

interface DividerProps {
  text?: string;
}

export const Divider = ({ text = "or" }: DividerProps) => {
  return (
    <View className="flex-row items-center my-6 mb-[25px] w-full">
      <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
      <Text className="text-black text-sm">{text}</Text>
      <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
    </View>
  );
};
