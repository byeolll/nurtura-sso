import React from "react";
import { Text, View, ScrollView } from "react-native";

const TermsAndConditions = () => {
  return (
    <ScrollView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-1 bg-white p-6 rounded-3xl shadow-md space-y-6">
        <Text className="text-[#6C7C59] text-center text-[24px] font-bold mb-10">
          Terms and Conditions
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">Overview</Text>

        <Text className="text-gray-700 text-base leading-loose mb-4">
          Welcome to Nurtura, an IoT-based smart urban farming system that helps
          users monitor and automate plant care in real time. These Terms and
          Conditions govern your use of the Nurtura mobile application, related
          software, and connected services. By creating an account, downloading,
          or using Nurtura, you agree to these Terms. Please read them
          carefully, as they outline your rights, responsibilities, and the
          limits of our liability. If you do not agree to these Terms, you must
          not use our Service.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          1. Acceptance of Terms
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          By accessing or using this app, you agree to be legally bound by these
          Terms and Conditions. If you do not agree, please do not use the app.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          2. Use of the App
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          You must be at least 13 years old (or the minimum legal age in your
          jurisdiction) to use Nurtura. You agree to use Nurtura only for lawful
          purposes and in accordance with these Terms. You are responsible for
          maintaining the confidentiality of your account and for all activities
          that occur under it. We reserve the right to suspend or terminate your
          access if you violate these Terms or engage in any unauthorized or
          harmful activities.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          3. Account Responsibility
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account.
        </Text>

        <Text className="text-gray-700 text-base leading-loose mb-4">
          When you register, you agree to provide accurate and complete
          information. You must not share your account credentials or allow
          others to access your account. You may deactivate or delete your
          account at any time through the app’s settings or by contacting our
          support team.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          4. Intellectual Property
        </Text>

        <Text className="text-gray-700 text-base leading-loose mb-4">
          All content, software, trademarks, designs, and related materials in
          Nurtura are owned by the Nurtura Development Team or its licensors.
          You are granted a limited, non-exclusive, and revocable license to use
          the app for personal, non-commercial purposes. You may not copy,
          modify, distribute, reverse-engineer, or create derivative works from
          any part of the Service without our written consent.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          5. Software and Updates
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          Nurtura may automatically download and install updates, including
          security patches or feature improvements. You agree to receive such
          updates as part of your continued use of the Service. We reserve the
          right to modify, suspend, or discontinue parts of the Service at any
          time with or without notice.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          6. User Responsibilities
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          You agree not to: Use Nurtura for illegal, harmful, or disruptive
          purposes; Interfere with the app’s normal operation or security;
          Attempt to access restricted areas or data not intended for you; Use
          automated systems (such as bots or scrapers) to interact with the
          Service; Misrepresent data, plant information, or environmental
          readings to manipulate system performance.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          7. Limitation of Liability
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          To the maximum extent permitted by law, Nurtura and its developers
          shall not be liable for any indirect, incidental, or consequential
          damages, including loss of data, plants, or productivity, arising from
          your use of the Service. You acknowledge that Nurtura’s automation
          depends on environmental factors beyond our control (e.g., network
          conditions, sensor performance, water and power supply), and you
          assume full responsibility for monitoring plant health.
        </Text>
        <Text className="text-black font-bold text-[18px] mb-2">
          8. Hardware Use
        </Text>

        <Text className="text-gray-700 text-base leading-loose mb-4">
          To protect proprietary information, details of Nurtura’s hardware
          components and configurations are confidential. Users may not
          disassemble, replicate, or modify the connected devices or attempt to
          reverse-engineer the system’s physical components. Tampering with any
          hardware or electrical parts voids warranty and support coverage.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          9. Warranty
        </Text>

        <Text className="text-gray-700 text-base leading-loose mb-4">
          Nurtura includes a 7-day replacement warranty covering manufacturing
          defects only. This warranty does not apply to damages caused by
          misuse, modification, or improper handling.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          10. Support and Training
        </Text>

        <Text className="text-gray-700 text-base leading-loose mb-4">
          We provide 3 months of free technical support following the first
          implementation. Support includes troubleshooting, software updates,
          and basic maintenance assistance. Additionally, 1–2 hours of personal
          training are included for environment familiarization and actual usage
          guidance.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          11. Changes to Terms
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-4">
          We may modify these Terms from time to time to reflect updates in our
          system, features, or applicable laws. If changes are made, we will
          notify users through the app or via email before the new Terms take
          effect. Your continued use of Nurtura after such changes means you
          accept the updated Terms.
        </Text>

        <Text className="text-black font-bold text-[18px] mb-2">
          6. Contact Us
        </Text>
        <Text className="text-gray-700 text-base leading-loose mb-10">
          If you have any questions or concerns about these Terms and
          Conditions, please contact us through email. We’re happy to assist you
          and ensure your Nurtura experience remains smooth and productive.
        </Text>

        <Text className="text-gray-500 text-base leading-loose text-center mb-6">
          By continuing to use Nurtura, you acknowledge that you have read,
          understood, and agreed to these Terms and Conditions.
        </Text>
      </View>
    </ScrollView>
  );
};

export default TermsAndConditions;
