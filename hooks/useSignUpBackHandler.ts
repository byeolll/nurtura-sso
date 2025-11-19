import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";
import { Alert, BackHandler } from "react-native";

export const USER_INFO_STORAGE_KEY = "user_info";
export const SSO_INFO_STORAGE_KEY = "sso_temp_user_info";

export const useSignupBackHandler = () => {
  const handleBackPress = useCallback(() => {
    Alert.alert("Go back?", "Your process will be deleted and cleared.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await clearSignupStorage();
          router.back();
        },
      },
    ]);
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => backHandler.remove();
    }, [handleBackPress])
  );
};
 
export const clearSignupStorage = async () => {
  await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
  await SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY);
  await SecureStore.deleteItemAsync("signup_password");
  await SecureStore.deleteItemAsync("signup_confirm_password");
  await SecureStore.deleteItemAsync("verified_email");
  await SecureStore.deleteItemAsync("signup_email");
  await SecureStore.deleteItemAsync("fromGoogle");
  await SecureStore.deleteItemAsync("firebaseToken");
};
