import { Text, TouchableOpacity, View } from "react-native";

interface ResendCodeProps {
  onResend: () => void;
  timer: number;
}

export const ResendCode = ({ onResend, timer }: ResendCodeProps) => {
  return (
    <View className="self-start pl-2 mb-[26px] flex-row items-center">
      <Text className="text-base text-gray-700 leading-normal">
        Didn't receive the code?{" "}
      </Text>
      <TouchableOpacity onPress={onResend} disabled={timer > 0}>
        <Text
          className={`text-base font-semibold underline ${
            timer > 0 ? "text-gray-400" : "text-primary"
          }`}
        >
          Resend code
        </Text>
      </TouchableOpacity>

      {timer > 0 && (
        <Text className="ml-2 text-base text-gray-500">({timer}s)</Text>
      )}
    </View>
  );
};
