import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  const userName = 'UserExample';
  const motoClubs: any[] = [];
  const motos: any[] = [];

  return (
    <ThemedView style={gs.screen}>
      {/* 🔹 Header superior con botones */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.surface,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}>
        {/* Título */}
        <ThemedText style={[gs.textPrimary, { fontWeight: '700', fontSize: 14 }]}>
          FREE CHAIN MX
        </ThemedText>

        {/* Iconos de perfil, notificaciones y menú */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {/* Perfil */}
          <TouchableOpacity onPress={() => router.push('/screens/profile/profile')}>
            <Ionicons name="person-outline" size={24} color={Colors.text} />
          </TouchableOpacity>

          {/* Notificaciones */}
          <TouchableOpacity onPress={() => console.log('Campana presionada')}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          </TouchableOpacity>

          {/* Menú lateral */}
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu-outline" size={26} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {/* Saludo */}
        <View style={{ marginTop: 10 }}>
          <ThemedText style={[gs.textPrimary, { fontSize: 20, fontWeight: '600' }]}>
            Hola, {userName}
          </ThemedText>
          <ThemedText style={gs.textSecondary}>Bienvenido de vuelta</ThemedText>
        </View>

        {/* Mis MotoClubs */}
        <View style={{ marginTop: 24 }}>
          <ThemedText style={[gs.sectionTitle, { fontSize: 18 }]}>Mis MotoClubs</ThemedText>

          {motoClubs.length === 0 ? (
            <View
              style={[
                gs.card,
                {
                  backgroundColor: Colors.surface,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                },
              ]}>
              <ThemedText style={gs.textSecondary}>
                No eres miembro de ningún motoclub
              </ThemedText>
              <TouchableOpacity
                style={[gs.primaryButton, { marginTop: 10 }]}
                onPress={() => router.push('/club/explore')}>
                <Text style={gs.primaryButtonText}>Explorar MotoClubs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ThemedText style={gs.textSecondary}>[Mostrar lista de clubes aquí]</ThemedText>
          )}
        </View>

        {/* Mi Garaje */}
        <View style={{ marginTop: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText style={[gs.sectionTitle, { fontSize: 18 }]}>Mi Garaje</ThemedText>
            <TouchableOpacity onPress={() => router.push('/screens/motorcycle/garage')}>
              <ThemedText style={[gs.textSecondary, { fontSize: 14 }]}>
                Ver todas {'>'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {motos.length === 0 ? (
            <View
              style={[
                gs.card,
                {
                  backgroundColor: Colors.surface,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                },
              ]}>
              <ThemedText style={gs.textSecondary}>
                No has registrado ninguna moto
              </ThemedText>
              <TouchableOpacity
                style={[gs.primaryButton, { marginTop: 10 }]}
                onPress={() => router.push('/screens/motorcycle/addMoto')}>
                <Text style={gs.primaryButtonText}>Agregar Moto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ThemedText style={gs.textSecondary}>[Mostrar lista de motos aquí]</ThemedText>
          )}
        </View>

        {/* Atajos: Seguridad y Salud */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
          }}>
          {/* Seguridad */}
          <TouchableOpacity
            style={[
              gs.card,
              {
                flex: 1,
                backgroundColor: Colors.surface,
                alignItems: 'center',
                padding: 20,
                marginRight: 8,
              },
            ]}
            onPress={() => router.push('/screens/security/security')}>
            <ThemedText style={gs.textPrimary}>Seguridad</ThemedText>
            <ThemedText style={gs.textSecondary}>Alertas y Ubicación</ThemedText>
          </TouchableOpacity>

          {/* Salud */}
          <TouchableOpacity
            style={[
              gs.card,
              {
                flex: 1,
                backgroundColor: Colors.surface,
                alignItems: 'center',
                padding: 20,
                marginLeft: 8,
              },
            ]}
            onPress={() => router.push('/screens/health/health')}>
            <ThemedText style={gs.textPrimary}>Salud</ThemedText>
            <ThemedText style={gs.textSecondary}>Info Médica</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
