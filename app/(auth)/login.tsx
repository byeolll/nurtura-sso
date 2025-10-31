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
  View,
} from "react-native";
import "../globals.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigation = useNavigation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // nilagay q to for hold password visibility toggle
  const [password, setPassword] = useState(""); // nilagay q to for hold password visibility toggle

  const [isLoginInvalid, setIsLoginInvalid] = useState(false); // for invalid login handling lang
  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    setIsLoginInvalid(false);

    try {
      await signIn(email, password);
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      setIsLoginInvalid(true);
      Alert.alert("Invalid Login", "No account found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const handleGooglePress = async () => {
      setLoading(true);
        try {
          await signInWithGoogle();
          router.replace("/(tabs)/profile");
        } catch (error: any) {
          console.log("Google Sign-In Error:", error);
          Alert.alert("Google Sign-In Failed", error.message);
        } finally {
          setLoading(false);
      }
    };


  const handleForgotPassword = () => {
    router.push("/(auth)/forgotPassword1")
  }

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen items-center">
      <Image
        source={require("@/assets/images/nurtura_logo.png")}
        className="w-[250px] h-[250px] mt-20"
        resizeMode="contain"
      />

      <View className="w-full mb-4 relative -top-[25%]">
        <View
          className={`w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] ${
            isLoginInvalid ? "border-[#E65656]" : "border-[#919191]"
          }`}
        >
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
            Email
          </Text>
          <TextInput
            className="text-black text-[16px]"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="relative w-full mb-[5px]">
          <View
            className={`w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] ${
              isLoginInvalid ? "border-[#E65656]" : "border-[#919191]"
            }`}
          >
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Password
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
          {isLoginInvalid && (
            <Text className="text-[#E65656] text-[13px] mb-[10px] pl-2">
              Invalid login. Please try again.
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={1} // disables touch animation
            className="absolute right-5 pr-2 top-1/2 -translate-y-1/2"
          >
            <Image
              source={
                isPasswordVisible
                  ? require("@/assets/images/eyeopen.png")
                  : require("@/assets/images/eyeclosed.png")
              }
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text className="ml-2">
          Forgot password?{' '}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="text-primary underline font-bold">Reset here.</Text>
          </TouchableOpacity>
        </Text>
        </View>

        <View className="flex-row items-center my-6 mb-[25px] w-full">
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
          <Text className="text-black text-[13px]">or</Text>
          <View className="flex-1 h-px bg-[#B7B7B7] mx-4" />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center p-6 rounded-[12px] w-[100%] bg-white shadow-sm-subtle"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={handleGooglePress}
        >
          <Image
            source={require("@/assets/images/google.png")}
            className="w-5 h-5 mr-3"
            resizeMode="contain"
          />
          <Text className={"text-[16px] font-semibold text-black"}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        
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
