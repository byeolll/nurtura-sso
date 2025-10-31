import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  const handleSubmitUserInfo = () => {
    const userDetails = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      birthday: `${monthsList[selectedMonthIndex]} ${daysList[selectedDayIndex]}, ${yearsList[selectedYearIndex]}`,
    };

    console.log("User Details:", userDetails);
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
          <Text className="text-white text-[16px] font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default createUserInfo;
