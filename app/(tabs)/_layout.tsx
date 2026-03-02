import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { theme } = useAppSettings();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#000000',
        tabBarInactiveTintColor: isDark ? '#9BA1A6' : '#687076',
        tabBarStyle: {
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Mi Ruta',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}