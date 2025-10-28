import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router';
import '../../globals.css'

const CreateAccount = () => {
  const [email, setEmail] = useState('');

  return (
    <View className='flex bg-white px-6 justify-evenly items-center h-screen'>
      <Text className=''>
        Create your Account
      </Text>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup/emailOTP')}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CreateAccount