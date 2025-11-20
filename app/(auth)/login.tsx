import { EmailInput } from "@/components/auth/emailInput";
import { GoogleSignInButton } from "@/components/auth/googleSignInButton";
import { PasswordInput } from "@/components/auth/passwordInput";
import { Divider } from "@/components/shared/divider";
import { PrimaryButton } from "@/components/shared/primaryButton";
import { useLogin } from "@/hooks/auth/useLogin";
import { router, useNavigation } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import "../globals.css";

export default function LoginScreen() {
  const {
    email,
    password,
    loading,
    isPasswordVisible,
    isLoginInvalid,
    emailError,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleLogin,
    handleGoogleSignIn,
  } = useLogin();

  const navigation = useNavigation();

  const handleForgotPassword = () => {
    router.push("/(auth)/forgetpassword/forgotPassword1");
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen items-center">
      <Image
        source={require("@/assets/images/nurtura_logo.png")}
        className="w-[250px] h-[250px] mt-20"
        resizeMode="contain"
      />

      <View className="w-full mb-4 flex-1 justify-start">
        <EmailInput
          value={email}
          onChangeText={handleEmailChange}
          error={emailError}
          hasError={isLoginInvalid}
        />

        <PasswordInput
          value={password}
          onChangeText={handlePasswordChange}
          isVisible={isPasswordVisible}
          onToggleVisibility={togglePasswordVisibility}
          hasError={isLoginInvalid}
        />

        {isLoginInvalid && (
          <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
            Invalid login. Please try again.
          </Text>
        )}

        <Text className="ml-2">
          Forgot password?{" "}
          <Text
            className="text-primary underline font-bold"
            onPress={handleForgotPassword}
          >
            Reset here.
          </Text>
        </Text>

        <Divider />

        <GoogleSignInButton onPress={handleGoogleSignIn} disabled={loading} />
      </View>

      <View className="absolute bottom-10 w-full">
        <TouchableOpacity
          onPress={() => navigation.navigate("signup" as never)}
          className="mt-4 mb-5"
          disabled={loading}
        >
          <Text className="text-center text-gray-600">
            Don't have an account?{" "}
            <Text className="text-primary font-semibold underline">
              Create one here.
            </Text>
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          title="Login"
        />
      </View>
    </View>
  );
}
