import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="bg-gray-100 rounded-lg p-6 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Logged in as:
        </Text>
        <Text className="text-base text-gray-600">{user?.email}</Text>
      </View>

      <TouchableOpacity
        className="bg-red-500 rounded-lg py-4 active:bg-red-600"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}