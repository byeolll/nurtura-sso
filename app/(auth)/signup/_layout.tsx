import { Stack } from "expo-router";
import { Image } from "react-native";
import "../../globals.css";

export default function SignupLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fafafa" },
        headerBlurEffect: "light",
        headerBackTitle: "Back",
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="createAccount"
        options={{
          headerTitle: () => (
            <Image source={require("@/assets/images/signupProgress1.png")} />
          ),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="emailOTP"
        options={{
          headerTitle: () => (
            <Image source={require("@/assets/images/signupProgress2.png")} />
          ),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="createPassword"
        options={{
          headerTitle: () => (
            <Image source={require("@/assets/images/signupProgress3.png")} />
          ),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="createUserInfo"
        options={{
          headerTitle: () => (
            <Image source={require("@/assets/images/signupProgress4.png")} />
          ),
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="termsAndConditions"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#F9FAFB" },
        }}
      />
      <Stack.Screen
        name="privacyPolicy"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#F9FAFB" },
        }}
      />
    </Stack>
  );
}
