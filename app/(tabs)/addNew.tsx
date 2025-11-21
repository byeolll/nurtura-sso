import { View, Text } from "react-native";
import { auth } from '@/firebase';

export default function AddModalScreen() {
    return (
        <View className='flex justify-center items-center h-screen'>
            <Text>Add Modal Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
        </View>
    )
}