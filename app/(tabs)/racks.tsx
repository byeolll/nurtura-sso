import { View, Text } from "react-native";
import { auth } from '@/firebase';

export default function RacksScreen() {
    return (
        <View className='flex justify-center items-center h-screen'>
            <Text>Racks Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
        </View>
    )
}