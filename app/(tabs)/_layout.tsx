import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import { useThemeContext } from '../../context/ThemeContext';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { theme: currentTheme } = useThemeContext();
  const theme = Colors[currentTheme];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.message.aiBorder,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.tertiary,
        tabBarLabelStyle: {
            fontFamily: theme.fonts.bold,
            fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Guide',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "school" : "school-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
