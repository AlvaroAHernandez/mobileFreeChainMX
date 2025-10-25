import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={gs.scrollContent}>
        {/* Header */}
        <View style={[gs.header]}>
          <ThemedText style={gs.headerTitle}>FREE CHAIN MX</ThemedText>
        </View>

        {/* Bienvenida */}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <ThemedText style={[gs.title, { fontSize: 22 }]}>
            Hola, Juan Carlos
          </ThemedText>
          <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
            Bienvenido de vuelta
          </ThemedText>
        </View>

        {/* === Sección: Mis Motoclubs === */}
        <View style={[gs.sectionHeader, { paddingHorizontal: 20 }]}>
          <ThemedText style={gs.sectionTitle}>Mis Motoclubs</ThemedText>
          <TouchableOpacity
            style={[gs.primaryButton, { paddingVertical: 6, paddingHorizontal: 14 }]}>
            <Text style={gs.primaryButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>

        <View style={[gs.card, { marginHorizontal: 20 }]}>
          <ThemedText style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
            Riders del Valle
          </ThemedText>
          <ThemedText style={[gs.textSecondary, { marginTop: 6 }]}>
            Club de motociclistas apasionados por las rutas de montaña y la aventura.
          </ThemedText>
          <ThemedText style={[gs.textMuted, { marginTop: 6 }]}>
            El Valle BCS • 19 miembros
          </ThemedText>
        </View>

        {/* === Sección: Mi Garaje === */}
        <View style={[gs.sectionHeader, { paddingHorizontal: 20 }]}>
          <ThemedText style={gs.sectionTitle}>Mi Garaje</ThemedText>
          <TouchableOpacity onPress={() => router.push('/screens/motorcycle/garage')}>
            <ThemedText style={{ color: Colors.tint, fontSize: 13 }}>
              Ver todas &gt;
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[gs.card, { marginHorizontal: 20 }]}>
          <ThemedText style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
            Ducati Monster
          </ThemedText>
          <ThemedText style={[gs.textMuted, { marginTop: 4 }]}>
            Año 2020 • 1234ABC
          </ThemedText>
        </View>

        <View style={[gs.card, { marginHorizontal: 20 }]}>
          <ThemedText style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
            Harley-Davidson Low Rider S
          </ThemedText>
          <ThemedText style={[gs.textMuted, { marginTop: 4 }]}>
            Año 2020 • 5678XYZ
          </ThemedText>
        </View>

        {/* === Sección: Accesos rápidos === */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
            paddingHorizontal: 20,
          }}>
          <View
            style={[
              gs.card,
              {
                flex: 1,
                marginRight: 10,
                alignItems: 'flex-start',
                backgroundColor: Colors.surface,
              },
            ]}>
            <ThemedText style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
              Seguridad
            </ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
              Alertas y Ubicación
            </ThemedText>
          </View>

         <TouchableOpacity
            onPress={() => router.push('/screens/health/health')}
            style={[
              gs.card,
              {
                flex: 1,
                marginLeft: 10,
                alignItems: 'flex-start',
                backgroundColor: Colors.surface,
              },
            ]}>
            <ThemedText style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
              Salud
            </ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
              Info Médica
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
