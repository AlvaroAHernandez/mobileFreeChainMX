import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';

// Función para escalar tamaño del icono
const scaleIcon = (size: number, width: number) => (width / 375) * size;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B5BFE',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {
          backgroundColor: '#0A0B0F',
          borderTopWidth: 0,
          height: width < 400 ? 60 : 70,
          paddingBottom: width < 400 ? 8 : 12,
          paddingTop: width < 400 ? 4 : 8,
        },
        tabBarLabelStyle: {
          fontSize: width < 400 ? 11 : 13,
          fontWeight: '500',
        },
      }}
    >
      {/*  Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={scaleIcon(22, width)}
            />
          ),
        }}
      />

      {/*  Club */}
      <Tabs.Screen
        name="club"
        options={{
          title: 'Club',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              color={color}
              size={scaleIcon(22, width)}
            />
          ),
        }}
      />

      {/* Eventos */}
      <Tabs.Screen
        name="eventos"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={scaleIcon(22, width)}
            />
          ),
        }}
      />

      {/*  Rutas */}
      <Tabs.Screen
        name="rutas"
        options={{
          title: 'Rutas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              color={color}
              size={scaleIcon(22, width)}
            />
          ),
        }}
      />

      {/*  Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              color={color}
              size={scaleIcon(22, width)}
            />
          ),
        }}
      />
    </Tabs>
  );
}
