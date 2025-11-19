import { GoogleSignInButton } from "@/components/auth/google-button";
import { InputField } from "@/components/auth/input-field";
import { ConsentModal } from "@/components/auth/modal/consent-modal";
import { Button } from "@/components/shared/button";
import { Checkbox } from "@/components/shared/checkbox";
import { Divider } from "@/components/shared/divider";
import { useCreateAccount } from "@/hooks/useCreateAccount";
import { Text, View } from "react-native";
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
    isNextButtonEnabled,
    isGoogleButtonEnabled,
    handleEmailChange,
    handleCheckboxToggleTS,
    handleCheckboxTogglePP,
    handleNextPress,
    handleGooglePress,
    handleConsentAccept,
    handleConsentClose,
    setShowConsentModal,
    setCurrentConsentType,
  } = useCreateAccount();

  return (
    <View className="flex-1 bg-white px-[16px] pb-[34px] w-screen justify-between h-screen">
      <View className="mt-[34px] flex-1 items-start">
        <Text className="text-black font-bold text-[24px] mb-[20px] pl-2">
          Create your account
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          isInvalid={!!emailError}
        />

        <Divider text="or" />

        <GoogleSignInButton
          onPress={handleGooglePress}
          disabled={!isGoogleButtonEnabled || loading}
          style={{
            backgroundColor: isGoogleButtonEnabled ? "#fafafa" : "#ececec",
            opacity: isGoogleButtonEnabled ? 1 : 0.6,
          }}
        />
      </View>

      <View className="w-full mb-3">
        <Checkbox
          label="I have read and agreed to all terms and conditions set with Nurtura's Terms of Service"
          checked={isCheckedTS}
          onToggle={handleCheckboxToggleTS}
          onTextPress={() => {
            setCurrentConsentType("TS");
            setShowConsentModal(true);
          }}
          highlightText="Terms of Service"
        />

        <Checkbox
          label="I acknowledge and agree to Nurtura's Privacy Policy regarding the collection and use of my personal data."
          checked={isCheckedPP}
          onToggle={handleCheckboxTogglePP}
          onTextPress={() => {
            setCurrentConsentType("PP");
            setShowConsentModal(true);
          }}
          highlightText="Privacy Policy"
        />
      </View>
      <Button
        title="Next"
        onPress={handleNextPress}
        loading={loading}
        disabled={!isNextButtonEnabled || loading}
      />

      <ConsentModal
        visible={showConsentModal}
        type={currentConsentType}
        onClose={handleConsentClose}
        onAccept={handleConsentAccept}
      />
    </View>
  );
};

export default CreateAccount;
