// components/Header.tsx
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title?: string;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
}

export default function Header({
  title = '',
  onProfilePress,
  onNotificationsPress,
  onMenuPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const Colors = getThemeColors('dark');

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: Colors.surface,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{
          width: 30,
          height: 30,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Image 
            source={require("@/assets/images/logo_free_chain.png")} 
            style={{
              width: 24,
              height: 24,
            }}
            resizeMode="contain"
          />
        </View>
        
        <Text style={{ color: Colors.text, fontWeight: '700', fontSize: 16 }}>
          {title}
        </Text>
      </View>

      {/* Iconos (derecha) */}
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <TouchableOpacity onPress={onProfilePress}>
          <Ionicons name="person-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons name="menu-outline" size={26} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}