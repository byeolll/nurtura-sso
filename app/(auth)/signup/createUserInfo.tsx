import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const CreateUserInfo = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
 
  const handleUsernameChange = (text: string) => {
    if (text.length <= 30) {
      setUsername(text);
    }
  };
 
  const handleNameChange = (text: string, setter: (val: string) => void) => {
    const lettersOnly = text.replace(/[^A-Za-z]/g, "");
    setter(lettersOnly);
  };

  const allFieldsFilled =
    username.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0;

  const handleNextPress = () => {
    console.log("User Info:");
    console.log("Username:", username);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
  };

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] mb-[20px] pl-2">
          Let us know you!
        </Text>
 
        <View className="w-[100%] mb-[6px]">
          <View className="pt-2 px-3 border-[2px] border-[#919191] rounded-[12px] bg-white">
            <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
              Username
            </Text>
            <TextInput
              className="text-black text-[16px]"
              keyboardType="default"
              autoCapitalize="none"
              value={username}
              onChangeText={handleUsernameChange}
            />
          </View>
          <Text className="text-grayText text-[12px] pl-[4px] pt-[5px] mb-[6px] ml-1">
            {username.length}/30
          </Text>
        </View>
 
        <View className="w-[100%] pt-2 px-3 border-[2px] border-[#919191] rounded-[12px] bg-white mb-[6px]">
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
            First Name
          </Text>
          <TextInput
            className="text-black text-[16px]"
            keyboardType="default"
            autoCapitalize="words"
            value={firstName}
            onChangeText={(text) => handleNameChange(text, setFirstName)}
          />
        </View>
 
        <View className="w-[100%] pt-2 px-3 border-[2px] border-[#919191] rounded-[12px] bg-white mb-[6px]">
          <Text className="text-primary text-[13px] pt-[4px] pl-[4px]">
            Last Name
          </Text>
          <TextInput
            className="text-black text-[16px]"
            keyboardType="default"
            autoCapitalize="words"
            value={lastName}
            onChangeText={(text) => handleNameChange(text, setLastName)}
          />
        </View>
      </View>
 
      <TouchableOpacity
        onPress={handleNextPress}
        disabled={!allFieldsFilled}
        className={`w-full p-6 rounded-[12px] mt-2 flex items-center ${
          allFieldsFilled ? "bg-primary" : "bg-[#919191]"
        }`}
      >
        <Text className="text-white text-[16px] font-bold">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateUserInfo;
