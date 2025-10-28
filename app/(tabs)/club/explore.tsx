import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native'; // ✅ import corregido

export default function ExploreClubScreen() {
  const gs = useGlobalStyles();

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ThemedText style={[gs.textPrimary, { fontSize: 22, fontWeight: '600' }]}>
          Explorar MotoClubs
        </ThemedText>
        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>
          Aquí podrás buscar y unirte a motoclubs de tu ciudad o región. 🏍️
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
