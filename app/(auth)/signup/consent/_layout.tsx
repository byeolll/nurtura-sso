import { Stack } from "expo-router";

export default function ConsentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="consent/privacyPolicy" />
            <Stack.Screen name="consent/termsAndConditions" />
        </Stack>
    )
}