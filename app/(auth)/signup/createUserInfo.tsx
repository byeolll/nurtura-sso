import { PrimaryButton } from "@/components/shared/primaryButton";
import { TextInputField } from "@/components/shared/textInputField";
import { useCreateUserInfo } from "@/hooks/auth/useCreateUserInfo";
import { ScrollView, Text, View } from "react-native";

const CreateUserInfo = () => {
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
          />

          <TextInputField
            label="Middle Name (optional)"
            value={middleName}
            onChangeText={handleMiddleNameChange}
          />

          <View className="w-full gap-5 flex-row justify-between">
            <TextInputField
              label="Last Name"
              value={lastName}
              onChangeText={handleLastNameChange}
              width="w-[60%]"
            />
            <TextInputField
              label="Suffix (optional)"
              value={suffix}
              onChangeText={handleSuffixChange}
              width="w-[35%]"
            />
          </View>

          <View className="w-full gap-5 flex-row justify-between">
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
          </View>

          <View className="w-full gap-5 flex-row justify-between">
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
          </View>
        </View>
      </ScrollView>

      <View className="pb-6">
        <PrimaryButton
          onPress={handleSubmitUserInfo}
          loading={loading}
          disabled={!areAllFieldsFilled}
          title="Finish"
        />
      </View>
    </View>
  );
};

export default CreateUserInfo;
