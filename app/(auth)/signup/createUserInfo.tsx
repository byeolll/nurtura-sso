import { Button } from "@/components/shared/button";
import { InputRow } from "@/components/shared/input-row";
import { TextInputField } from "@/components/shared/text-input-field";
import { useCreateUserInfo } from "@/hooks/useCreateUserInfo";
import { useSignupBackHandler } from "@/hooks/useSignUpBackHandler";
import { ScrollView, Text, View } from "react-native";
import "../../globals.css";

const CreateUserInfo = () => {
  useSignupBackHandler
  const {
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
  } = useCreateUserInfo();

  return (
    <View className="flex-1 bg-white px-4">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-8">
          <Text className="text-black font-bold text-[24px] mb-4">
            Let us know you!
          </Text>

          {fromGoogle === "true" && (
            <Text className="text-center text-primary mb-4">
              Welcome! We've pre-filled your info from Google — please enter the
              missing fields to complete your registration.
            </Text>
          )}

          <TextInputField
            label="First Name"
            value={firstName}
            onChangeText={handleFirstNameChange}
            className="mb-[10px]"
          />

          <TextInputField
            label="Middle Name"
            value={middleName}
            onChangeText={handleMiddleNameChange}
            optional={true}
            className="mb-[10px]"
          />

          <InputRow className="mb-[10px]">
            <TextInputField
              label="Last Name"
              value={lastName}
              onChangeText={handleLastNameChange}
              width="w-[60%]"
            />
            <TextInputField
              label="Suffix"
              value={suffix}
              onChangeText={handleSuffixChange}
              optional={true}
              width="w-[35%]"
            />
          </InputRow>

          <Text className="text-black font-bold text-[18px] mb-3 mt-6">
            Address Information
          </Text>

          <InputRow className="mb-[10px]">
            <TextInputField
              label="Block/House No."
              value={block}
              onChangeText={handleBlockChange}
              width="w-[50%]"
            />
            <TextInputField
              label="Street"
              value={street}
              onChangeText={handleStreetChange}
              width="w-[45%]"
            />
          </InputRow>

          <InputRow className="mb-[10px]">
            <TextInputField
              label="Barangay"
              value={barangay}
              onChangeText={handleBarangayChange}
              width="w-[50%]"
            />
            <TextInputField
              label="City"
              value={city}
              onChangeText={handleCityChange}
              width="w-[45%]"
            />
          </InputRow>
        </View>
      </ScrollView>

      <View className="pb-6">
        <Button
          title="Finish"
          onPress={handleSubmitUserInfo}
          loading={loading}
          disabled={!areAllFieldsFilled || loading}
        />
      </View>
    </View>
  );
};

export default CreateUserInfo;