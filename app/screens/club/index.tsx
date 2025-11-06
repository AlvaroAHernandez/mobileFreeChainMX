// app/screens/club/index.tsx
import ScreenLayout from '@/components/ScreenLayout';
import { ThemedText } from '@/components/themed-text';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

const MOCK_CLUBS = [
  { id: '1', name: 'Riders del Valle', description: 'Club de motociclistas apasionados por las rutas de montaña y la aventura.', location: 'Ciudad de México', members: 15 },
  { id: '2', name: 'Águilas del Asfalto', description: 'Comunidad de riders urbanos y touring.', location: 'Guadalajara', members: 22 },
  { id: '3', name: 'Lobos de Carretera', description: 'Para los amantes de las largas distancias y el touring.', location: 'Monterrey', members: 8 },
];

export default function ClubExploreScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const Colors = getThemeColors('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(MOCK_CLUBS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredClubs(
      MOCK_CLUBS.filter((club) =>
        club.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <ScreenLayout title="MOTOCLUBS">
      {/* Subtítulo y botón crear club */}
      <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <ThemedText style={[gs.title, { fontSize: 20 }]}>MotoClubs</ThemedText>
          <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>Explora y únete.</ThemedText>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.tint,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => router.push('/screens/club/create')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Buscar MotoClubs */}
      <View style={{ marginTop: 15 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderRadius: Radius.medium,
            paddingHorizontal: Spacing.md,
            height: 44,
          }}
        >
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={[gs.input, { flex: 1, marginLeft: 10, color: Colors.text }]}
            placeholder="Busca motoclubs..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Lista de MotoClubs */}
      <View style={{ marginTop: 20 }}>
        {filteredClubs.length === 0 && (
          <ThemedText style={gs.textSecondary}>No se encontraron motoclubs.</ThemedText>
        )}

        {filteredClubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={[gs.card, { marginTop: 15 }]}
            onPress={() => router.push(`/screens/club/clubDetail?id=${club.id}`)}
          >
            <ThemedText style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}>{club.name}</ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4 }]} numberOfLines={2}>
              {club.description}
            </ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4, fontSize: 12 }]}>
              {club.location} • {club.members} Miembros
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScreenLayout>
  );
}
