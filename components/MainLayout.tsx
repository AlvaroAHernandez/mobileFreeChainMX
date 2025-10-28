import { ThemedText } from '@/components/themed-text';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);
  const navigation = useNavigation();
  const route = useRoute();

  
  const isTabScreen =
    route.name === 'index' ||
    route.name === 'club' ||
    route.name === 'events' ||
    route.name === 'routes' ||
    route.name === 'chat';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.surface,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderColor: Colors.textMuted + '40',
        }}
      >
        <ThemedText style={{ color: Colors.text, fontWeight: '700', fontSize: 16 }}>
          FREE CHAIN MX
        </ThemedText>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity onPress={() => console.log('Buscar')}>
            <Ionicons name="search-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Notificaciones')}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu-outline" size={26} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={{ flex: 1 }}>{children}</View>

      
      {!isTabScreen && (
        <View style={{ borderTopWidth: 1, borderColor: Colors.textMuted + '40' }}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors.tint,
              tabBarInactiveTintColor: Colors.textMuted,
              tabBarStyle: {
                backgroundColor: Colors.surface,
                borderTopWidth: 0,
                height: 60,
              },
            }}
          />
        </View>
      )}
    </View>
  );
}
