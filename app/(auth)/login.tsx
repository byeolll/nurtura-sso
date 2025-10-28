import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import '../globals.css'
import { useNavigation } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex bg-white px-6 justify-evenly items-center h-screen">
      <Image
        source={require('@/assets/images/nurtura_logo.png')}
        className="w-[250px] h-[250px] mb-10"
        resizeMode="contain"
      />

      <View className="w-full mb-4 relative -top-[25%]">
        <View className="mb-4 rounded-lg border-black p-4 pb-1 border">
          <Text className="text-sm font-medium text-primary">Email</Text>
          <TextInput
            className=" min-w-full text-md"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="mb-4 rounded-lg border-black p-4 pb-1 border flex flex-row flex-wrap">
          <View className="w-[80%]">
            <Text className="text-sm font-medium text-primary">Password</Text>
            <TextInput
              className=" min-w-full text-md"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
          </View>

          <View className='w-[20%] justify-center items-center'>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={30}
                color="#999"
              />
            </TouchableOpacity>
          </View>

        </View>

        <Text>
          Forgot password?{' '}
          <Text className="text-primary underline font-bold">
            Reset Here.
          </Text>
        </Text>
      </View>

      <View className='absolute bottom-10 w-full'>
        <TouchableOpacity
          onPress={() => router.push('/notSignup')}
          className="mt-4 mb-5"
          disabled={loading}
        >
          <Text className="text-center text-gray-600">
            Dont have an account?{' '}
            <Text className="text-primary font-semibold underline-offset-auto underline">Create one here.</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        className="bg-primary rounded-lg py-5 mb-4 active:bg-blue-600 w-full self-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Login
          </Text>
        )}
        </TouchableOpacity>
      </View>

    </View>
  );
}