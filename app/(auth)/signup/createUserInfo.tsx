import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const USER_INFO_STORAGE_KEY = "temp_user_info";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ITEM_HEIGHT = 40;

const WheelScrollPicker = React.memo(
  ({ data, selectedIndex, onSelect }: any) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const isScrolling = useRef(false);

    const handleScrollComplete = (event: any) => {
      const scrollOffset = event.nativeEvent.contentOffset.y;
      const calculatedIndex = Math.round(scrollOffset / ITEM_HEIGHT);
      onSelect(calculatedIndex);
      isScrolling.current = false;
    };

    const handleUserStartsScrolling = () => {
      isScrolling.current = true;
    };

    const handleUserTapsItem = (itemIndex: number) => {
      if (!isScrolling.current) {
        onSelect(itemIndex);
        scrollViewRef.current?.scrollTo({
          y: itemIndex * ITEM_HEIGHT,
          animated: true,
        });
      }
    };

    return (
      <View style={{ height: ITEM_HEIGHT * 5, justifyContent: "center" }}>
        {/* Top fade overlay */}
        <View
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: ITEM_HEIGHT * 2,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        />

        {/* Selected item highlight */}
        <View
          className="absolute left-0 right-0 border-y-2 border-gray-300 z-0"
          style={{
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
          }}
        />

        {/* Bottom fade overlay */}
        <View
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            height: ITEM_HEIGHT * 2,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        />

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollComplete}
          onScrollBeginDrag={handleUserStartsScrolling}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
          onLayout={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({
                y: selectedIndex * ITEM_HEIGHT,
                animated: false,
              });
            }, 50);
          }}
        >
          {data.map((item: string, index: number) => {
            const isCurrentlySelected = index === selectedIndex;
            return (
              <TouchableOpacity
                key={`${item}-${index}`}
                onPress={() => handleUserTapsItem(index)}
                activeOpacity={0.7}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: isCurrentlySelected ? "bold" : "normal",
                    color: isCurrentlySelected ? "#000" : "#9CA3AF",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

const createUserInfo = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const { signUp } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    email,
    password,
    fromGoogle,
    firstName: googleFirstName,
    lastName: googleLastName,
  } = useLocalSearchParams();

  const normalizedEmail = Array.isArray(email) ? email[0] : email || "";
  const normalizedPassword = Array.isArray(password)
    ? password[0]
    : password || "";

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  useEffect(() => {
    if (fromGoogle === "true") {
      setFirstName(
        Array.isArray(googleFirstName)
          ? googleFirstName[0]
          : googleFirstName || ""
      );
      setLastName(
        Array.isArray(googleLastName) ? googleLastName[0] : googleLastName || ""
      );
    }
  }, [fromGoogle, googleFirstName, googleLastName]);

  useEffect(() => {
    (async () => {
      try {
        const savedData = await SecureStore.getItemAsync(USER_INFO_STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setUsername(parsed.username || "");
          setFirstName(parsed.firstName || "");
          setLastName(parsed.lastName || "");
          setSelectedMonthIndex(parsed.selectedMonthIndex ?? 0);
          setSelectedDayIndex(parsed.selectedDayIndex ?? 0);
          setSelectedYearIndex(parsed.selectedYearIndex ?? 0);
        }
      } catch (err) {
        console.log("Error loading saved user info:", err);
      }
    })();
  }, []);

  useEffect(() => {
    const saveUserInfo = async () => {
      try {
        const dataToSave = {
          username,
          firstName,
          lastName,
          selectedMonthIndex,
          selectedDayIndex,
          selectedYearIndex,
        };
        await SecureStore.setItemAsync(
          USER_INFO_STORAGE_KEY,
          JSON.stringify(dataToSave)
        );
      } catch (err) {
        console.log("Error saving user info:", err);
      }
    };
    saveUserInfo();
  }, [
    username,
    firstName,
    lastName,
    selectedMonthIndex,
    selectedDayIndex,
    selectedYearIndex,
  ]);

  // Memoize static data
  const monthsList = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const daysList = useMemo(
    () => Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    []
  );

  const yearsList = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) =>
        (new Date().getFullYear() - i).toString()
      ),
    []
  );

  const handleSubmitUserInfo = async () => {
    setLoading(true);
    try {
      const { token } = await signUp(normalizedEmail, normalizedPassword);

      if (!token) {
        Alert.alert("User not authenticated");
        return;
      }

      const userDetails = {
        username,
        firstName,
        lastName,
        birthday: `${yearsList[selectedYearIndex]}-${(selectedMonthIndex + 1).toString().padStart(2, "0")}-${daysList[selectedDayIndex].toString().padStart(2, "0")}`,
      };

      console.log("Sending User Details:", userDetails);

      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userDetails),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        Alert.alert("Error", data.message); // Unauthorized Token/Access
        setLoading(false);
        return;
      }

      if (response.status === 409) {
        Alert.alert("Error", data.message); // Username taken
        setLoading(false);
        return;
      }

      if (!response.ok) {
        Alert.alert("Error", "Registration failed");
        setLoading(false);
        return;
      }

      Alert.alert("Success", "User profile saved!");
      await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
      await SecureStore.deleteItemAsync("signup_password");
      await SecureStore.deleteItemAsync("signup_confirm_password");
      await SecureStore.deleteItemAsync("firebaseToken");
      await SecureStore.deleteItemAsync("verified_email"); 
      await SecureStore.deleteItemAsync("email_verified");
      await SecureStore.deleteItemAsync("signup_email");
    } catch (error) {
      console.log("Error submitting user info:", error);
      Alert.alert("Error", "Failed to submit user info");
      setLoading(false);
    }
  };

  const checkIfUsernameHasValue = username.trim().length > 0;
  const checkIfFirstNameHasValue = firstName.trim().length > 0;
  const checkIfLastNameHasValue = lastName.trim().length > 0;

  const areAllFieldsFilled =
    checkIfUsernameHasValue &&
    checkIfFirstNameHasValue &&
    checkIfLastNameHasValue;

  const removeEmojis = (text: string) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
  };

  const handleUsernameChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9._-]/g, "");
    setUsername(cleanText.slice(0, 30));
  };

  const handleFirstNameChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z]/g, "");
    setFirstName(cleanText);
  };

  const handleLastNameChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z]/g, "");
    setLastName(cleanText);
  };

  const openDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  return (
    <View className="flex-1 bg-white px-4">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-8">
          <Text className="text-black font-bold text-[24px] mb-4">
            Let us know you!
          </Text>

          {fromGoogle === "true" && (
            <Text className="text-center text-red-500 mb-4">
              Welcome! We’ve pre-filled your info from Google — please enter
              your birthday to complete your registration.
            </Text>
          )}

          <View className="w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[5px] border-[#919191]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Username
            </Text>
            <TextInput
              className="text-black text-[16px]"
              value={username}
              onChangeText={handleUsernameChange}
            />
          </View>
          <Text className="text-gray-500 text-[12px] pb-5 ml-2">
            {username.length}/30
          </Text>

          <View className="w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              First Name
            </Text>
            <TextInput
              className="text-black text-[16px]"
              value={firstName}
              onChangeText={handleFirstNameChange}
            />
          </View>

          <View className="w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Last Name
            </Text>
            <TextInput
              className="text-black text-[16px]"
              value={lastName}
              onChangeText={handleLastNameChange}
            />
          </View>

          <View className="w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Birthday
            </Text>
            <TouchableOpacity onPress={openDatePicker} className="py-3">
              <Text className="text-[16px] text-black">
                {monthsList[selectedMonthIndex]} {daysList[selectedDayIndex]},{" "}
                {yearsList[selectedYearIndex]}
              </Text>
            </TouchableOpacity>
          </View>

          {isDatePickerVisible && (
            <Modal
              visible={isDatePickerVisible}
              animationType="slide"
              transparent
            >
              <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
                <View
                  className="bg-white rounded-t-2xl p-4"
                  style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
                >
                  <View className="flex-row justify-between mb-4">
                    <TouchableOpacity onPress={closeDatePicker}>
                      <Text className="text-gray-500 text-lg">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold">Select Birthday</Text>
                    <TouchableOpacity onPress={closeDatePicker}>
                      <Text className="text-blue-500 text-lg font-semibold">
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-around items-center">
                    <View style={{ width: 130 }}>
                      <WheelScrollPicker
                        data={monthsList}
                        selectedIndex={selectedMonthIndex}
                        onSelect={setSelectedMonthIndex}
                      />
                    </View>

                    <View style={{ width: 70 }}>
                      <WheelScrollPicker
                        data={daysList}
                        selectedIndex={selectedDayIndex}
                        onSelect={setSelectedDayIndex}
                      />
                    </View>

                    <View style={{ width: 90 }}>
                      <WheelScrollPicker
                        data={yearsList}
                        selectedIndex={selectedYearIndex}
                        onSelect={setSelectedYearIndex}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </ScrollView>

      <View className="pb-6">
        <TouchableOpacity
          disabled={!areAllFieldsFilled}
          onPress={handleSubmitUserInfo}
          className={`w-full p-5 rounded-xl ${
            areAllFieldsFilled ? "bg-primary" : "bg-[#919191]"
          } items-center`}
        >
          <Text className="text-white text-[16px] font-bold">
            {loading ? "Loading..." : "Finish"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default createUserInfo;
