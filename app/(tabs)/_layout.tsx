import { Tabs, useLocalSearchParams } from 'expo-router';
import '../globals.css';

const _layout = () => {
  const { email } = useLocalSearchParams(); // ✅ Get the param from the route

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
        initialParams={{ email }} // ✅ Pass email to screen
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
        initialParams={{ email }} // ✅ Pass email to screen
      />
    </Tabs>
  )
}

export default _layout;
