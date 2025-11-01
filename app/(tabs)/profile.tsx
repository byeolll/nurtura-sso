import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator, Image, ScrollView } from 'react-native';

const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
const PORT = process.env.EXPO_PUBLIC_PORT;

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.email) return;
      try {
        console.log('LOCAL_IP', LOCAL_IP, 'PORT', PORT);

        const response = await fetch(`http://${LOCAL_IP}:${PORT}/users/fetch-userinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message);
          setUserInfo(data.userInfo);
        } else {
          console.log(data.message);
          console.log('No DB user info found, using Firebase/Google data');
          setUserInfo({
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            birthday: user.birthday || null,
            photo: user.photo || null,
          });
        }
      } catch (err: any) {
        console.error('Fetch user info failed:', err);
        Alert.alert('Error', 'Unable to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-3 text-gray-600">Loading profile...</Text>
      </View>
    );
  }


  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="bg-gray-100 rounded-lg p-6 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Logged in as:
        </Text>
        <Text className="text-base text-gray-600">{user?.email}</Text>
      </View>

      {userInfo ? (
          <>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Username: </Text>{userInfo.username || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">First Name: </Text>{userInfo.first_name || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Last Name: </Text>{userInfo.last_name || '—'}
            </Text>
            <Text className="text-base text-gray-700">
              <Text className="font-semibold">Birthday: </Text>{userInfo.formattedBirthday || '—'}
            </Text>

            {userInfo.birthday && (
              <Text className="text-base text-gray-700">
                <Text className="font-semibold">Age: </Text>
                {Math.floor(
                  (new Date().getTime() - new Date(userInfo.birthday).getTime()) /
                    (1000 * 60 * 60 * 24 * 365)
                )}
              </Text>
            )}
          </>
        ) : (
          <Text className="text-gray-500">No additional info found.</Text>
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