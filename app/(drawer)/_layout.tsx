import CustomDrawerContent from '@/components/CustomDrawerContent';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';

export default function DrawerLayout() {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);


  return (
    <Drawer
      drawerPosition="right"
      drawerContent={(props) => {
        return <CustomDrawerContent {...props} />;
      }}
      screenOptions={{
        drawerStyle: { backgroundColor: Colors.surface, width: 260 },
        headerShown: false,
        drawerActiveTintColor: Colors.tint,
        drawerInactiveTintColor: Colors.textMuted,
        sceneContainerStyle: { backgroundColor: Colors.background },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Inicio',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="garage"
        options={{
          title: 'Garaje',
          drawerIcon: ({ color, size }) => <Ionicons name="bicycle-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="health"
        options={{
          title: 'Salud',
          drawerIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="security"
        options={{
          title: 'Seguridad',
          drawerIcon: ({ color, size }) => <Ionicons name="shield-outline" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}
