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
  return (
    <TouchableOpacity
      className="w-full p-6 rounded-[12px] mt-2 flex items-center bg-primary"
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-[16px] font-bold">{title}</Text>
      )}
    </TouchableOpacity>
  );
};
