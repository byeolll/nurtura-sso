import { View, Text } from "react-native";
import { auth } from '@/firebase';
import { router } from "expo-router";

export default function NotificationScreen() {
    return (
        <View className='flex justify-center items-center h-screen'>
            <Text>Notification Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
            <Text onPress={() => router.back()} className='underline text-red-800'> Go Back </Text>
        </View>
    )
}