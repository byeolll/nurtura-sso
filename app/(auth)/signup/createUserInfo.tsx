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
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 34 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-black font-bold text-3xl mb-3 pl-2">
          Let us know you!
        </Text>

        <Text className="text-base text-gray-700 mb-6 pl-2 leading-normal">
          {fromGoogle === "true"
            ? "We've pre-filled your info from Google. Please complete the missing fields."
            : "Fill in your information to complete your registration."}
        </Text>
 
        <View className="mb-2">
          <Text className="text-gray-700 text-base font-semibold tracking-wide mb-3 pl-2">
            Personal Information
          </Text>

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

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextInputField
                label="Last Name"
                value={lastName}
                onChangeText={handleLastNameChange}
              />
            </View>
            <View className="w-[100px]">
              <TextInputField
                label="Suffix"
                value={suffix}
                onChangeText={handleSuffixChange}
              />
            </View>
          </View>
        </View>
 
        <View className="mb-6">
          <Text className="text-gray-500 text-base font-semibold uppercase tracking-wide mb-3 pl-2">
            Address
          </Text>

          <View className="flex-row gap-3 mb-1">
            <View className="w-[100px]">
              <TextInputField
                label="Block/No."
                value={block}
                onChangeText={handleBlockChange}
              />
            </View>
            <View className="flex-1">
              <TextInputField
                label="Street"
                value={street}
                onChangeText={handleStreetChange}
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextInputField
                label="Barangay"
                value={barangay}
                onChangeText={handleBarangayChange}
              />
            </View>
            <View className="flex-1">
              <TextInputField
                label="City"
                value={city}
                onChangeText={handleCityChange}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 pb-8 pt-4 bg-white border-t border-gray-100">
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
