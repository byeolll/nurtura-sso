import { NotificationItem } from '@/components/notifications/notificationItem';
import { auth } from '@/firebase';
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function NotificationScreen() {
    return (
        <View className='flex justify-center items-center h-screen'>
            <Text>Notification Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
            <NotificationItem type="water" />
            <NotificationItem type="light" />
            <NotificationItem type="harvest" />
            <NotificationItem type="sensor" />
            <NotificationItem type="environment" />
            <Text onPress={() => router.back()} className='underline text-red-800'> Go Back </Text>
        </View>
    )
}