import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import '../globals.css'

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold mb-2 text-center text-gray-800">
        Create Account
      </Text>
      <Text className="text-base text-gray-500 mb-8 text-center">
        Sign up to get started with Nurtura
      </Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password-new"
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="password-new"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-4 mb-4 active:bg-blue-600"
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(auth)/login')}
        className="mt-4"
        disabled={loading}
      >
        <Text className="text-center text-gray-600">
          Already have an account?{' '}
          <Text className="text-blue-500 font-semibold">Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}