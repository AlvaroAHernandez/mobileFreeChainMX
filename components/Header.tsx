// components/Header.tsx
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
  const Colors = getThemeColors('dark'); // o recibir prop scheme

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
      <Text style={{ color: Colors.text, fontWeight: '700', fontSize: 16 }}>
        {title}
      </Text>

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
