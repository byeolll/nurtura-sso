import { PasswordInput } from "@/components/auth/passwordInput";
import { PrimaryButton } from "@/components/shared/primaryButton";
import { useCreatePassword } from "@/hooks/auth/useCreatePassword";
import { Text, View } from "react-native";

const CreatePassword = () => {
  const {
    isPasswordVisible,
    password,
    confirmPassword,
    isPasswordValid,
    isConfirmPasswordValid,
    passwordsMatch,
    loading,
    isNextButtonEnabled,
    togglePasswordVisibility,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNextPress,
  } = useCreatePassword();

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-3xl pr-[110px] mb-[13px] pl-2">
          Set your password
        </Text>

        <Text className="mb-[20px] text-base text-gray-700 leading-normal pl-2">
          Enter a secure password to protect your account.
        </Text>

        <View className="w-full mb-[5px]">
          <PasswordInput
            value={password}
            onChangeText={handlePasswordChange}
            isVisible={isPasswordVisible}
            onToggleVisibility={togglePasswordVisibility}
            hasError={password.length > 0 && !isPasswordValid}
            label="Set password"
          />

          {!isPasswordValid && password.length > 0 && (
            <Text className="text-[#E65656] text-base mb-[10px] pl-2">
              Password must have 8+ chars, uppercase, number & symbol.
            </Text>
          )}
        </View>

        <View className="w-full mb-[20px]">
          <PasswordInput
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            isVisible={isPasswordVisible}
            onToggleVisibility={togglePasswordVisibility}
            hasError={
              confirmPassword.length > 0 &&
              (!passwordsMatch || !isConfirmPasswordValid)
            }
            label="Confirm password"
          />

          {!passwordsMatch && confirmPassword.length > 0 && (
            <Text className="text-[#E65656] text-base mb-[10px] pl-2">
              Passwords do not match.
            </Text>
          )}

          {!isConfirmPasswordValid &&
            confirmPassword.length > 0 &&
            passwordsMatch && (
              <Text className="text-[#E65656] text-base mb-[10px] pl-2">
                Password must have 8+ chars, uppercase, number & symbol.
              </Text>
            )}
        </View>
      </View>

      <View className="w-full">
        <PrimaryButton
          onPress={handleNextPress}
          loading={loading}
          disabled={!isNextButtonEnabled}
          title="Next"
        />
      </View>
    </View>
  );
};

export default CreatePassword;
