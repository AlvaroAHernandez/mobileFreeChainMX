import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import React from 'react';
import { ScrollView } from 'react-native';

export default function RoutesScreen() {
  const gs = useGlobalStyles();

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ThemedText style={[gs.textPrimary, { fontSize: 22, fontWeight: '600' }]}>
          Rutas
        </ThemedText>
        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>
          Aquí podrás registrar y compartir tus rutas favoritas. 🗺️
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
