import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { useColorScheme, View } from 'react-native';

export default function CustomDrawerContent(props: any) {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: Colors.surface,
        paddingTop: 20,
      }}
    >
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderColor: Colors.textMuted,
          padding: 10,
        }}
      >
        <DrawerItem
          label="Cerrar Sesión"
          labelStyle={{ color: '#E63946', fontWeight: '600' }}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" color="#E63946" size={size} />
          )}
          onPress={() => {
            
            console.log('Sesión cerrada');
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}
