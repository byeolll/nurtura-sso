import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react';
import { router } from 'expo-router';
import '../../globals.css'

const emailOTP = () => {


  return (
    <View className='flex justify-center items-center bg-white h-screen '>
      <Text>emailOTP</Text>
      <TouchableOpacity className='bg-blue-500 p-4 rounded-lg mt-4' onPress={ () => router.push('/(auth)/signup/createPassword')}>
        <Text>Password</Text>
      </TouchableOpacity>
    </View>
  )
}

export default emailOTP