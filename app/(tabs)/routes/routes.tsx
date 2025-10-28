import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import React from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';

export default function RoutesScreen() {
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  // Datos de ejemplo de rutas
  const rutas = [
    {
      id: 1,
      titulo: 'La Paz - Los Cabos',
      descripcion: 'Ruta de La Paz a Los Cabos y puntos de interés en el camino',
      distancia: '156 - 161 kilómetros',
    },
    {
      id: 2,
      titulo: 'La Paz - Loreto',
      descripcion: 'Ruta de La Paz a Loreto y puntos de interés en el camino',
      distancia: '357 kilómetros',
    },
    {
      id: 3,
      titulo: 'La Paz - Todos Santos',
      descripcion: 'Ruta de La Paz a Todos Santos y puntos de interés en el camino',
      distancia: '80 - 81 kilómetros',
    },
  ];

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={[gs.scrollContent, { padding: 20 }]}>
        {/* Header */}
        <View style={gs.header}>
          <ThemedText style={gs.headerTitle}>MotoClub</ThemedText>
        </View>

        {/* Título principal */}
        <View style={{ marginTop: 16, marginBottom: 10 }}>
          <ThemedText style={[gs.title, { fontSize: 20 }]}>Mis Rutas</ThemedText>
          <ThemedText style={gs.textSecondary}>
            Rutas que has creado y compartido
          </ThemedText>
        </View>

        {/* Lista de rutas */}
        {rutas.map((ruta) => (
          <View
            key={ruta.id}
            style={[
              gs.card,
              {
                backgroundColor: Colors.surface,
                marginBottom: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
              },
            ]}>
            <ThemedText
              style={[
                gs.textPrimary,
                { fontSize: 16, fontWeight: '600', marginBottom: 4 },
              ]}>
              {ruta.titulo}
            </ThemedText>
            <ThemedText
              style={[
                gs.textSecondary,
                { fontSize: 14, marginBottom: 6 },
              ]}>
              {ruta.descripcion}
            </ThemedText>
            <ThemedText
              style={[
                gs.textMuted,
                { fontSize: 13 },
              ]}>
              {ruta.distancia}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
