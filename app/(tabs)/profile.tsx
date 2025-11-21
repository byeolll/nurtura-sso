import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/firebase';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import useFetch from '@/hooks/useFetch';
import { UserInfo } from '@/types/interface';

interface FetchUserResponse {
  userInfo: UserInfo;
}

const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
const PORT = process.env.EXPO_PUBLIC_PORT;

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const currentUser = auth.currentUser;
  const emailToSend = currentUser?.email?.trim().toLowerCase() || "";

  const { data, error, loading, refetch } = useFetch<FetchUserResponse>(
    `http://${LOCAL_IP}:${PORT}/users/fetch-userinfo`,
    {
      method: 'POST',
      body: { email: emailToSend },
      autoFetch: !!emailToSend,
    }
  );

  useEffect(() => {
    if (error) {
      console.error("Fetch user info failed:", error);
      Alert.alert("Error", "Unable to fetch profile data.");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log("User info fetched:", data.userInfo);
    }
  }, [data]);

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


  if (loading && !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#F6D54E" />
        <Text>Loading user info...</Text>
      </View>
    );
  }

  if (!currentUser?.email) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 mb-4">No email found for current user.</Text>
        <TouchableOpacity
          className="bg-red-500 rounded-lg py-3 px-6"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userInfo = data?.userInfo;


  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="bg-gray-100 rounded-lg p-6 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Logged in as:
        </Text>
        <Text className="text-base text-gray-600">{auth.currentUser?.email}</Text>
      </View>

      {userInfo ? (
          <>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">First Name: </Text>{userInfo.first_name || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Midlle Name: </Text>{userInfo.middle_name || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Last Name: </Text>{userInfo.last_name || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Suffix: </Text>{userInfo.suffix || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Address: </Text>{userInfo.address || '—'}
            </Text>
          </>
        ) : (
          <Text className="text-gray-500">No additional info found.</Text>
        )}

      {error && (
        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3 mb-4 active:bg-blue-600"
          onPress={() => refetch()}
        >
          <Text className="text-white text-center font-semibold">
            Retry Fetch
          </Text>
        </TouchableOpacity>
      )}

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