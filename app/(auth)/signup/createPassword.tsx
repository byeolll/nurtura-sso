import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/shared/button";
import { useCreatePassword } from "@/hooks/useCreatePassword";
import { Text, View } from "react-native";
import "../../globals.css";

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
    handlePasswordChange,
    handleConfirmPasswordChange,
    togglePasswordVisibility,
    handleNextPress,
    getPasswordBorderColor,
    getConfirmPasswordBorderColor,
  } = useCreatePassword();

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] pr-[110px] mb-[13px] pl-2">
          Set your password
        </Text>

        <Text className="mb-[20px] text-[13px] text-gray-700 leading-normal pl-2">
          Enter a secure password to protect your account.
        </Text>

        <PasswordInput
          label="Set password"
          value={password}
          onChangeText={handlePasswordChange}
          isVisible={isPasswordVisible}
          onToggleVisibility={togglePasswordVisibility}
          isInvalid={password.length > 0 && !isPasswordValid}
          className="mb-[5px]"
          style={{ borderColor: getPasswordBorderColor() }}
        />

        {!isPasswordValid && password.length > 0 && (
          <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
            Password must have 8+ chars, uppercase, number & symbol.
          </Text>
        )}

        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          isVisible={isPasswordVisible}
          onToggleVisibility={togglePasswordVisibility}
          isInvalid={
            (confirmPassword.length > 0 && !passwordsMatch) ||
            (confirmPassword.length > 0 && !isConfirmPasswordValid)
          }
          className="mb-[20px]"
          style={{ borderColor: getConfirmPasswordBorderColor() }}
        />

        {!passwordsMatch && confirmPassword.length > 0 && (
          <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
            Passwords do not match.
          </Text>
        )}

        {!isConfirmPasswordValid &&
          confirmPassword.length > 0 &&
          passwordsMatch && (
            <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
              Password must have 8+ chars, uppercase, number & symbol.
            </Text>
          )}
      </View>

      <View className="w-full">
        <Button
          title="Next"
          onPress={handleNextPress}
          loading={loading}
          disabled={!isNextButtonEnabled || loading}
        />
      </View>
    </View>
  );
};

export default CreatePassword;
