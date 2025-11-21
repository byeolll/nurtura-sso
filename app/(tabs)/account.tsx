import { View, Text } from "react-native";
import { auth } from '@/firebase';

export default function AccountScreen() {
    return (
        <View className='flex justify-center items-center h-screen'>
            <Text>Account Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
        </View>
    )
}