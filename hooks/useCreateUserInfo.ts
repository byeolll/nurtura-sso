import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/firebase";
import { cleanInput, validateUserInfoFields } from "@/utils/validation";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SSO_INFO_STORAGE_KEY } from "./useSignUpBackHandler";

export const USER_INFO_STORAGE_KEY = "temp_user_info";

export const useCreateUserInfo = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [fromGoogle, setFromGoogle] = useState("");
  const [firebaseToken, setFirebaseToken] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, signUp } = useAuth();
  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  // Load saved user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const savedData = await SecureStore.getItemAsync(USER_INFO_STORAGE_KEY);
        const fromGoogle = await SecureStore.getItemAsync("fromGoogle");
        setFromGoogle(fromGoogle ? fromGoogle : "false");

        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (fromGoogle === "true") {
            setFirstName(parsed.firstName || "");
            setLastName(parsed.lastName || "");
            setFirebaseToken(parsed.token || "");
          } else {
            setFirstName(parsed.firstName || "");
            setMiddleName(parsed.middleName || "");
            setLastName(parsed.lastName || "");
            setSuffix(parsed.suffix || "");
            setBlock(parsed.block || "");
            setStreet(parsed.street || "");
            setBarangay(parsed.barangay || "");
            setCity(parsed.city || "");
          }
        }
      } catch (err) {
        console.error("Error loading saved user info:", err);
      }
    };
    loadUserInfo();
  }, []);

  // Save user info when fields change
  useEffect(() => {
    const saveUserInfo = async () => {
      try {
        const dataToSave = {
          firstName,
          middleName,
          lastName,
          suffix,
          block,
          street,
          barangay,
          city,
        };
        await SecureStore.setItemAsync(
          USER_INFO_STORAGE_KEY,
          JSON.stringify(dataToSave)
        );
      } catch (err) {
        console.error("Error saving user info:", err);
      }
    };
    saveUserInfo();
  }, [firstName, middleName, lastName, suffix, block, street, barangay, city]);

  // Input handlers using cleanInput
  const handleFirstNameChange = (text: string) =>
    setFirstName(cleanInput(text));
  const handleMiddleNameChange = (text: string) =>
    setMiddleName(cleanInput(text));
  const handleLastNameChange = (text: string) => setLastName(cleanInput(text));
  const handleSuffixChange = (text: string) => setSuffix(cleanInput(text));
  const handleBlockChange = (text: string) => setBlock(cleanInput(text));
  const handleStreetChange = (text: string) => setStreet(cleanInput(text));
  const handleBarangayChange = (text: string) => setBarangay(cleanInput(text));
  const handleCityChange = (text: string) => setCity(cleanInput(text));

  // Form submission
  const handleSubmitUserInfo = async () => {
    setLoading(true);
    try {
      let tokenToUse = firebaseToken;

      if (fromGoogle === "false") {
        const verifiedEmail = await SecureStore.getItemAsync("verified_email");
        const verifiedPassword = await SecureStore.getItemAsync(
          "signup_confirm_password"
        );

        if (!verifiedEmail || !verifiedPassword) {
          Alert.alert("Error", "Missing credentials");
          setLoading(false);
          return;
        }

        const { token } = await signUp(verifiedEmail, verifiedPassword);
        tokenToUse = token;
      } else {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert("Error", "Not signed in with Google.");
          setLoading(false);
          return;
        }
        tokenToUse = await currentUser.getIdToken(true);
      }

      setFirebaseToken(tokenToUse);

      const userDetails = {
        firstName,
        middleName,
        lastName,
        suffix,
        block,
        street,
        barangay,
        city,
      };

      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenToUse}`,
          },
          body: JSON.stringify(userDetails),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        Alert.alert("Error", result.message);
        setLoading(false);
        return;
      }

      if (response.ok) {
        console.log("User created successfully:", result);

        // Clean up storage
        await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync("signup_email");
        await SecureStore.deleteItemAsync("verified_email");
        await SecureStore.deleteItemAsync("signup_password");
        await SecureStore.deleteItemAsync("signup_confirm_password");
        await SecureStore.deleteItemAsync("firebaseToken");
        await SecureStore.deleteItemAsync("fromGoogle");

        Alert.alert("Success", "User profile saved!");

        router.replace({
          pathname: "/(tabs)/profile",
          params: { email: result.email },
        });
      } else {
        console.error("Error:", result.message);
        Alert.alert("Error", "Registration failed");
      }
    } catch (error) {
      console.error("Error submitting user info:", error);
      Alert.alert("Error", "Failed to submit user info.");
    } finally {
      setLoading(false);
    }
  };

  const areAllFieldsFilled = validateUserInfoFields(
    firstName,
    lastName,
    block,
    street,
    barangay,
    city
  );

  return {
    firstName,
    middleName,
    lastName,
    suffix,
    block,
    street,
    barangay,
    city,
    fromGoogle,
    loading,
    areAllFieldsFilled,
    handleFirstNameChange,
    handleMiddleNameChange,
    handleLastNameChange,
    handleSuffixChange,
    handleBlockChange,
    handleStreetChange,
    handleBarangayChange,
    handleCityChange,
    handleSubmitUserInfo,
  };
};
