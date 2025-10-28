import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import React from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';

export default function EventsScreen() {
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  // Datos de ejemplo (eventos confirmados)
  const eventos = [
    {
      id: 1,
      titulo: 'Desfile de Mazatlán',
      descripcion: 'Desfile de motocicletas en el malecón de Mazatlán',
      fecha: '15 de febrero de 2026',
    },
    {
      id: 2,
      titulo: 'Convención en Tijuana',
      descripcion: 'Convención de motos en Tijuana',
      fecha: '21 de abril de 2026',
    },
    {
      id: 3,
      titulo: 'Campamento en Cabo San Lucas',
      descripcion: 'Tour y campamento en Cabo San Lucas',
      fecha: '11 de octubre de 2026',
    },
  ];

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={[gs.scrollContent, { padding: 20 }]}>
        {/* Header superior */}
        <View style={gs.header}>
          <ThemedText style={gs.headerTitle}>MotoClub</ThemedText>
        </View>

        {/* Título principal */}
        <View style={{ marginTop: 16, marginBottom: 10 }}>
          <ThemedText style={[gs.title, { fontSize: 20 }]}>Mis Eventos</ThemedText>
          <ThemedText style={gs.textSecondary}>Eventos confirmados</ThemedText>
        </View>

        {/* Lista de eventos */}
        {eventos.map((evento) => (
          <View
            key={evento.id}
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
              {evento.titulo}
            </ThemedText>
            <ThemedText
              style={[
                gs.textSecondary,
                { fontSize: 14, marginBottom: 6 },
              ]}>
              {evento.descripcion}
            </ThemedText>
            <ThemedText
              style={[
                gs.textMuted,
                { fontSize: 13 },
              ]}>
              {evento.fecha}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
