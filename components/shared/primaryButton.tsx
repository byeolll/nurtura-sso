import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title: string;
}

export const PrimaryButton = ({
  onPress,
  loading,
  disabled,
  title,
}: PrimaryButtonProps) => {
  const isDisabled = loading || disabled;
  
  return (
    <TouchableOpacity
      className={`w-full p-6 rounded-[12px] mt-2 flex items-center ${
        isDisabled ? "bg-[#919191]" : "bg-primary"
      }`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-xl font-bold">{title}</Text>
      )}
    </TouchableOpacity>
  );
};