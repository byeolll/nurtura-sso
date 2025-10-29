import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import '../../globals.css';

const emailOTP = () => {


  return (
    <View className='flex justify-center items-center bg-white h-screen '>
      <Text>emailOTP</Text>
      <TouchableOpacity className='bg-blue-500 p-4 rounded-lg mt-4' onPress={ () => router.push('/(auth)/signup/createPassword')}>
        <Text>Hellyeah</Text>
      </TouchableOpacity>
    </View>
  )
}

export default emailOTP