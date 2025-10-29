import { Stack } from 'expo-router';
import { Image } from 'react-native';
import '../../globals.css'

export default function SignupLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerStyle: { backgroundColor: '#ffffff' },
        headerBlurEffect: 'light',
        headerBackTitle: 'Back',
        headerShadowVisible: false,
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen 
        name="createAccount" 
        options={{ 
          headerTitle: () => (
            <Image source={require('@/assets/images/progress1.png')} />
          ), 
          headerShown: true, 
        }} 
      />
      <Stack.Screen 
        name="emailOTP" 
        options={{ 
          headerTitle: () => (
            <Image source={require('@/assets/images/progress2.png')} />
          ), 
          headerShown: true, 
        }} 
      />
      <Stack.Screen 
        name="createPassword" 
        options={{ 
          headerTitle: () => (
            <Image source={require('@/assets/images/progress3.png')} />
          ), 
          headerShown: true, 
        }} 
      />
      
      
    </Stack>
  );
}