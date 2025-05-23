import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router'; // 🆕 Import useRouter

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // 🆕 Inisialisasi router
  const [isReady, setIsReady] = React.useState(false);

  // Menambahkan logic untuk redirect ke LoginScreen
  React.useEffect(() => {
    if (isReady) {
      // Langsung redirect ke LoginScreen setelah tab layout siap
      router.replace('/LoginScreen');
    }
  }, [isReady, router]);

  // Simulasi menunggu layout/tab siap
  React.useEffect(() => {
    setIsReady(true); // Menandakan bahwa layout sudah siap
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >

      <Tabs.Screen
        name="RegisScreen"
        options={{
          title: 'Registrasi',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="LoginScreen"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="LaporBencana"
        options={{
          title: 'Lapor Bencana',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="folder.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
