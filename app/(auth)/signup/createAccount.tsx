import { EmailInput } from "@/components/auth/emailInput";
import { GoogleSignInButton } from "@/components/auth/googleSignInButton";
import { ConsentModal } from "@/components/auth/modal/consentModal";
import { Checkbox } from "@/components/shared/checkbox";
import { Divider } from "@/components/shared/divider";
import { PrimaryButton } from "@/components/shared/primaryButton";
import { useCreateAccount } from "@/hooks/auth/useCreateAccount";
import { Text, TouchableOpacity, View } from "react-native";
import "../../globals.css";

const CreateAccount = () => {
  const {
    email,
    isCheckedTS,
    isCheckedPP,
    loading,
    emailError,
    showConsentModal,
    currentConsentType,
    hasScrolledToEnd,
    isNextButtonEnabled,
    isGoogleButtonEnabled,
    handleEmailChange,
    handleCheckboxToggleTS,
    handleCheckboxTogglePP,
    handleConsentAccept,
    handleConsentDecline,
    setHasScrolledToEnd,
    handleNextPress,
    handleGooglePress,
    setShowConsentModal,
    setCurrentConsentType,
  } = useCreateAccount();

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-3xl mb-[20px] pl-2">
          Create your account
        </Text>

        <EmailInput
          value={email}
          onChangeText={handleEmailChange}
          error={emailError}
        />

        <Divider />

        <GoogleSignInButton
          onPress={handleGooglePress}
          disabled={!isGoogleButtonEnabled || loading}
        />
      </View>

      <View className="w-full">
        <Checkbox
          checked={isCheckedTS}
          onPress={handleCheckboxToggleTS}
          label={
            <Text className="text-base text-black leading-[20px]">
              I have read and agreed to all terms and conditions set with
              Nurtura's{" "}
              <TouchableOpacity
                onPress={() => {
                  setCurrentConsentType("TS");
                  setShowConsentModal(true);
                }}
              >
                <Text className="text-base font-semibold text-primary">
                  Terms of Service
                </Text>
              </TouchableOpacity>
            </Text>
          }
        />

        <View className="mb-4 mt-3">
          <Checkbox
            checked={isCheckedPP}
            onPress={handleCheckboxTogglePP}
            label={
              <>
                <Text className="text-base text-black leading-normal">
                  I acknowledge and agree to Nurtura's{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentConsentType("PP");
                    setShowConsentModal(true);
                  }}
                >
                  <Text className="text-base font-semibold text-primary">
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
                <Text className="text-base text-black leading-normal">
                  {" "}
                  regarding the collection and use of my personal data.
                </Text>
              </>
            }
          />
        </View>

        <PrimaryButton
          onPress={handleNextPress}
          loading={loading}
          disabled={!isNextButtonEnabled || loading}
          title="Next"
        />
      </View>

      <ConsentModal
        visible={showConsentModal}
        onClose={handleConsentDecline}
        onAccept={handleConsentAccept}
        type={currentConsentType}
        hasScrolledToEnd={hasScrolledToEnd}
        onScrollEnd={() => setHasScrolledToEnd(true)}
      />
    </View>
  );
};

export default CreateAccount;
