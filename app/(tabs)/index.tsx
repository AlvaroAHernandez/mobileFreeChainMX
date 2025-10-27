import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  // 🔧 Motos de ejemplo (pueden venir luego de una BD)
  const motos = [
    {
      marca: 'Harley-Davidson',
      modelo: 'Street 750',
      anio: '2022',
      matricula: 'ABCS1234',
      color: 'Negro',
      cilindrada: '750cc',
    },
    {
      marca: 'Ducati',
      modelo: 'Monster',
      anio: '2020',
      matricula: 'XYZ123',
      color: 'Rojo',
      cilindrada: '900cc',
    },
  ];

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={gs.scrollContent}>
        {/* Header */}
        <View style={gs.header}>
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

        {/* Sección: Mi Garaje */}
        <View
          style={[
            gs.sectionHeader,
            { paddingHorizontal: 20, marginTop: 20, justifyContent: 'space-between' },
          ]}>
          <ThemedText style={gs.sectionTitle}>Mi Garaje</ThemedText>
          <TouchableOpacity onPress={() => router.push('/garage')}>
            <ThemedText style={{ color: Colors.tint, fontSize: 13 }}>
              Ver todas &gt;
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de motos */}
        <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
          {motos.map((moto, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/motoDetails',
                  params: { ...moto },
                })
              }
              style={[gs.card, { marginBottom: 16 }]}>
              <ThemedText
                style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
                {moto.marca} {moto.modelo}
              </ThemedText>
              <ThemedText style={[gs.textSecondary, { marginTop: 6 }]}>
                Año {moto.anio} • {moto.matricula}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Accesos rápidos */}
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
            <ThemedText
              style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
              Seguridad
            </ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
              Alertas y Ubicación
            </ThemedText>
          </View>

          <View
            style={[
              gs.card,
              {
                flex: 1,
                marginLeft: 10,
                alignItems: 'flex-start',
                backgroundColor: Colors.surface,
              },
            ]}>
            <ThemedText
              style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>
              Salud
            </ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
              Info Médica
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
