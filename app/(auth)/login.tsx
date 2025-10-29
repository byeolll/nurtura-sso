import { useAuth } from "@/contexts/AuthContext";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import "../globals.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigation = useNavigation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // nilagay q to for hold password visibility toggle
  const [password, setPassword] = useState(""); // nilagay q to for hold password visibility toggle

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = () => {
    console.log("hello david ako si SSO");
    // d2 yung SSO bai
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen items-center">
      <Image
        source={require("@/assets/images/nurtura_logo.png")}
        className="w-[250px] h-[250px] mt-20"
        resizeMode="contain"
      />

      <View className="w-full mb-4 relative -top-[25%]">
        <View className="w-[100%] pt-2 px-3 border-[#919191] border-[2px] rounded-[12px] bg-white mb-[10px]">
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
            Email
          </Text>
          <TextInput
            className=" text-black text-[16px]"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="relative w-full mb-[5px]">
          <View className="w-[100%] pt-2 px-3 border-[#919191] border-[2px] rounded-[12px] bg-white mb-[10px]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Set password
            </Text>

            <TextInput
              className="text-black text-[16px] pr-10"
              secureTextEntry={!isPasswordVisible}
              keyboardType="default"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableWithoutFeedback
            onPressIn={() => setIsPasswordVisible(true)}
            onPressOut={() => setIsPasswordVisible(false)}
          >
            <View className="absolute right-5 top-[50%] -translate-y-1/2 pr-2">
              <Image
                source={
                  isPasswordVisible
                    ? require("@/assets/images/eyeopen.png")
                    : require("@/assets/images/eyeclosed.png")
                }
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View className="flex-row items-center my-6 mb-[25px] w-full">
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
          <Text className="text-black text-[13px]">or</Text>
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
        </View>

        <TouchableOpacity
          className={"flex-row items-center justify-center p-6 rounded-[12px] shadow-sm-subtle w-[100%] bg-white"} 
          onPress={handleGooglePress}
        >
          <Image
            source={require("@/assets/images/google.png")}
            className="w-5 h-5 mr-3"
            resizeMode="contain"
          />
          <Text
            className={"text-[16px] font-semibold text-black"}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* <Text>
          Forgot password?{' '}
          <Text className="text-primary underline font-bold">
            Reset Here.
          </Text>
        </Text> */}
      </View>

      <View className="absolute bottom-10 w-full">
        <TouchableOpacity
          onPress={() => navigation.navigate("signup" as never)}
          className="mt-4 mb-5"
          disabled={loading}
        >
          <Text className="text-center text-gray-600">
            Dont have an account?{" "}
            <Text className="text-primary font-semibold underline-offset-auto underline">
              Create one here.
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full p-6 rounded-[12px] mt-2 flex items-center bg-primary"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-[16px] font-bold">Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
