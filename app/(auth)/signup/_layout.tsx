import { Stack } from 'expo-router';

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
        name="createAccount" // Corresponds to getEmail.tsx
        options={{ 
          headerTitle: 'Step 1 of 3: Enter Email', 
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="emailOTP" 
        options={{ 
          headerTitle: 'Step 2 of 3: Enter OTP',
        }} 
      />
      <Stack.Screen 
        name="createPassword" 
        options={{ 
          headerTitle: 'Step e of 3: Create your password',
        }} 
      />
      
      
    </Stack>
  );
}