// screens/LoginScreen.tsx
import { useAuth } from "@/contexts/AuthContext";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import "../globals.css";

// Components 

// Hooks
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { useLoginForm } from "@/hooks/useLoginForm";

// Utils
import { GoogleSignInButton } from "@/components/auth/google-button";
import { InputField } from "@/components/auth/input-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/shared/button";
import { Divider } from "@/components/shared/divider";
import { validateLoginFields } from "@/utils/validation";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const {
    email,
    password,
    emailError,
    isLoginInvalid,
    handleEmailChange,
    handlePasswordChange,
    setLoginError,
  } = useLoginForm();

  const { loading: googleLoading, handleGoogleSignIn } = useGoogleSignIn();

  const handleLogin = async () => {
    const validation = validateLoginFields(email, password);

    if (!validation.isValid) {
      Alert.alert("Error", validation.message);
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      setLoginError();
      Alert.alert("Invalid Login", "No account found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgetpassword/forgotPassword1");
  };

  const handleSignUp = () => {
    navigation.navigate("signup" as never);
  };

  const isProcessing = loading || googleLoading;

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen items-center">
      <Image
        source={require("@/assets/images/nurtura_logo.png")}
        className="w-[250px] h-[250px] mt-20"
        resizeMode="contain"
      />

      <View className="w-full mb-4 flex-1 justify-start">
        <InputField
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          error={emailError}
          isInvalid={isLoginInvalid}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          contextMenuHidden={true}
          selectTextOnFocus={false}
        />

        <PasswordInput
          value={password}
          onChangeText={handlePasswordChange}
          isInvalid={isLoginInvalid}
          error={isLoginInvalid ? "Invalid login. Please try again." : ""}
        />

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

        <GoogleSignInButton onPress={handleGoogleSignIn} />
      </View>

      <View className="absolute bottom-10 w-full">
        <TouchableOpacity
          onPress={handleSignUp}
          className="mt-4 mb-5"
          disabled={isProcessing}
        >
          <Text className="text-center text-gray-600">
            Don't have an account?{" "}
            <Text className="text-primary font-semibold underline">
              Create one here.
            </Text>
          </Text>
        </TouchableOpacity>

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          disabled={isProcessing}
        />
      </View>
    </View>
  );
}
