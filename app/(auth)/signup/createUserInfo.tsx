import { useAuth } from "@/contexts/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { SSO_INFO_STORAGE_KEY } from "@/app/(auth)/signup/createAccount";
export const USER_INFO_STORAGE_KEY = "temp_user_info";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
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

WheelScrollPicker.displayName = "WheelScrollPicker";

const CreateUserInfo = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");

  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");

  // const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  // const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  // const [selectedYearIndex, setSelectedYearIndex] = useState(0);

  // const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [firebaseToken, setFirebaseToken] = useState("");

  const { email, signUp } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    fromGoogle,
  } = useLocalSearchParams();

  const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
  const PORT = process.env.EXPO_PUBLIC_PORT;

  useEffect(() => {
    (async () => {
      try {
        if (fromGoogle === "true") {
          const savedData = await SecureStore.getItemAsync(SSO_INFO_STORAGE_KEY);

          if (savedData) {
            const parsed = JSON.parse(savedData);
            setFirstName(parsed.firstName || "");
            setLastName(parsed.lastName || "");
            setFirebaseToken(parsed.token || "");
          }
        }

      } catch (err) {
        console.error("Error loading saved user info:", err);
      }
    })();
  }, [fromGoogle]);

  useEffect(() => {
    (async () => {
      try {
        const savedData = await SecureStore.getItemAsync(USER_INFO_STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setFirstName(parsed.firstName || "");
          setMiddleName(parsed.middleName || "")
          setLastName(parsed.lastName || "");
          setSuffix(parsed.suffix || "");
          setBlock(parsed.block || "");
          setStreet(parsed.street || "");
          setBarangay(parsed.barangay || "");
          setCity(parsed.city || "");
          // setSelectedMonthIndex(parsed.selectedMonthIndex ?? 0);
          // setSelectedDayIndex(parsed.selectedDayIndex ?? 0);
          // setSelectedYearIndex(parsed.selectedYearIndex ?? 0);
        }
      } catch (err) {
        console.error("Error loading saved user info:", err);
      }
    })();
  }, []);

  // useEffect(() => {
  //   const saveUserInfo = async () => {
  //     try {
  //       const dataToSave = {
  //         firstName,
  //         middleName,
  //         lastName,
  //         suffix,
  //         selectedMonthIndex,
  //         selectedDayIndex,
  //         selectedYearIndex,
  //         block,
  //         street,
  //         barangay,
  //         city
  //       };
  //       await SecureStore.setItemAsync(
  //         USER_INFO_STORAGE_KEY,
  //         JSON.stringify(dataToSave)
  //       );
  //     } catch (err) {
  //       console.error("Error saving user info:", err);
  //     }
  //   };
  //   saveUserInfo();
  // }, [
  //     firstName,
  //     middleName,
  //     lastName,
  //     suffix,
  //     selectedMonthIndex,
  //     selectedDayIndex,
  //     selectedYearIndex,
  //     block,
  //     street,
  //     barangay,
  //     city
  // ]);

  // // Memoize static data
  // const monthsList = useMemo(
  //   () => [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ],
  //   []
  // );

  // const daysList = useMemo(
  //   () => Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
  //   []
  // );

  // const yearsList = useMemo(
  //   () =>
  //     Array.from({ length: 100 }, (_, i) =>
  //       (new Date().getFullYear() - i).toString()
  //     ),
  //   []
  // );

  const handleSubmitUserInfo = async () => {
    setLoading(true);
    try {
      const savedData = await SecureStore.getItemAsync(USER_INFO_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFirstName(parsed.firstName || "");
        setMiddleName(parsed.middleName || "")
        setLastName(parsed.lastName || "");
        setSuffix(parsed.suffix || "");
        setBlock(parsed.block || "");
        setStreet(parsed.street || "");
        setBarangay(parsed.barangay || "");
        setCity(parsed.city || "");
        // setSelectedMonthIndex(parsed.selectedMonthIndex ?? 0);
        // setSelectedDayIndex(parsed.selectedDayIndex ?? 0);
        // setSelectedYearIndex(parsed.selectedYearIndex ?? 0);
      }
      
      const verifiedEmail = await SecureStore.getItemAsync("verified_email");
      const verifiedPassword = await SecureStore.getItemAsync("signup_confirm_password");

      if (fromGoogle !== "true") {

        if (!verifiedEmail || !verifiedPassword) {
          Alert.alert("Error", "Missing credentials");
          return;
        }
  
        const { token } = await signUp(verifiedEmail, verifiedPassword);
  
        if (!token) {
          Alert.alert("User not authenticated");
          return;
        }

        setFirebaseToken(token);
      }


      const userDetails = {
        firstName,
        middleName,
        lastName,
        suffix,
       // birthdate: `${yearsList[selectedYearIndex]}-${(selectedMonthIndex + 1).toString().padStart(2, "0")}-${daysList[selectedDayIndex].toString().padStart(2, "0")}`,
        block,
        street,
        barangay,
        city
      };

      const response = await fetch(
        `http://${LOCAL_IP}:${PORT}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify(userDetails),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        Alert.alert("Error", result.message); // Unauthorized Token/Access
        setLoading(false);
        return;
      }

      if (response.ok) {
        console.log("User created successfully:", result);

        await SecureStore.deleteItemAsync(USER_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync(SSO_INFO_STORAGE_KEY);
        await SecureStore.deleteItemAsync("signup_email");
        await SecureStore.deleteItemAsync("verified_email"); 
        await SecureStore.deleteItemAsync("signup_password");
        await SecureStore.deleteItemAsync("signup_confirm_password");
        await SecureStore.deleteItemAsync("firebaseToken");
        await SecureStore.deleteItemAsync("fromGoogle");
        Alert.alert("Success", "User profile saved!");

        console.log("createUserInfo" + email);

        router.replace({
          pathname: "/(tabs)/profile",
          params: { email: result.email }
        });

      } else {
        console.error("Error:", result.message);
        return Alert.alert("Error", "Registration failed");
      }

    } catch (error) {
        console.error("Error submitting user info:", error);
        Alert.alert("Error", "Failed to submit user info.");
    } finally{
        setLoading(false);
    }
  };

  const checkIfFirstNameHasValue = firstName.trim().length > 0;
  const checkIfLastNameHasValue = lastName.trim().length > 0;
  const checkIfAddressHasValue = block.trim().length > 0 && street.trim().length > 0 && barangay.trim().length > 0 && city.trim().length > 0;

  const areAllFieldsFilled =
    checkIfFirstNameHasValue &&
    checkIfLastNameHasValue &&
    checkIfAddressHasValue;

  const removeEmojis = (text: string) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
  };

  const handleFirstNameChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9. ]/g, "");
    setFirstName(cleanText);
  };

  const handleMiddleNameChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9. ]/g, "");
    setMiddleName(cleanText);
  };

  const handleLastNameChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9 ]/g, "");
    setLastName(cleanText);
  };

  const handleSuffixChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z. ]/g, "");
    setSuffix(cleanText);
  }

  const handleBlockChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9. ]/g, "");
    setBlock(cleanText);
  }

  const handleStreetChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9. ]/g, "");
    setStreet(cleanText);
  }

  const handleBarangayChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9. ]/g, "");
    setBarangay(cleanText);
  }

  const handleCityChange = (text: string) => {
    const cleanText = removeEmojis(text).replace(/[^A-Za-z0-9. ]/g, "");
    setCity(cleanText);
  }


  // const openDatePicker = () => {
  //   setIsDatePickerVisible(true);
  // };

  // const closeDatePicker = () => {
  //   setIsDatePickerVisible(false);
  // };

  return (
    <View className="flex-1 bg-white px-4">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-8">
          <Text className="text-black font-bold text-[24px] mb-4">
            Let us know you!
          </Text>

          {fromGoogle === "true" && (
            <Text className="text-center text-primary mb-4">
              Welcome! We’ve pre-filled your info from Google — please enter
              the missing fields to complete your registration.
            </Text>
          )}

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
              Middle Name (optional)
            </Text>
            <TextInput
              className="text-black text-[16px]"
              value={middleName}
              onChangeText={handleMiddleNameChange}
            />
          </View>

          <View className="w-full gap-5 flex-row justify-between">
            <View className='w-[60%] border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191] pt-2 px-3'>
              <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Last Name
              </Text>
              <TextInput
                className="text-black text-[16px]"
                value={lastName}
                onChangeText={handleLastNameChange}
              />
            </View>
            <View className='w-[35%] border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191] pt-2 px-3'>
              <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Suffix (optional)
              </Text>
              <TextInput
                className="text-black text-[16px]"
                value={suffix}
                onChangeText={handleSuffixChange}
              />
            </View>
          </View>

          <View className="w-full gap-5 flex-row justify-between">
            <View className='w-[50%] border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191] pt-2 px-3'>
              <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Block/House No.
              </Text>
              <TextInput
                className="text-black text-[16px]"
                value={block}
                onChangeText={handleBlockChange}
              />
            </View>
            <View className='w-[45%] border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191] pt-2 px-3'>
              <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Street
              </Text>
              <TextInput
                className="text-black text-[16px]"
                value={street}
                onChangeText={handleStreetChange}
              />
            </View>
          </View>

          <View className="w-full gap-5 flex-row justify-between">
            <View className='w-[50%] border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191] pt-2 px-3'>
              <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Barangay
              </Text>
              <TextInput
                className="text-black text-[16px]"
                value={barangay}
                onChangeText={handleBarangayChange}
              />
            </View>
            <View className='w-[45%] border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191] pt-2 px-3'>
              <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              City
              </Text>
              <TextInput
                className="text-black text-[16px]"
                value={city}
                onChangeText={handleCityChange}
              />
            </View>
          </View>  

          {/* <View className="w-[100%] pt-2 px-3 border-[2px] rounded-[12px] bg-white mb-[10px] border-[#919191]">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Birthdate
            </Text>
            <TouchableOpacity onPress={openDatePicker} className="py-3">
              <Text className="text-[16px] text-black">
                {monthsList[selectedMonthIndex]} {daysList[selectedDayIndex]},{" "}
                {yearsList[selectedYearIndex]}
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* {isDatePickerVisible && (
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
          )} */}
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

export default CreateUserInfo;
