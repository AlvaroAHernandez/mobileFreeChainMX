import MainLayout from '@/components/MainLayout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors, Radius } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, useColorScheme, View } from 'react-native';

const MOCK_CLUBS = [
  { id: '1', name: 'Riders del Vallessss', description: 'Club de motociclistas apasionados por las rutas de montaña y la aventura.', location: 'Ciudad de México', members: 15 },
  { id: '2', name: 'Águilas del Asfalto', description: 'Comunidad de riders urbanos y touring.', location: 'Guadalajara', members: 22 },
  { id: '3', name: 'Lobos de Carretera', description: 'Para los amantes de las largas distancias y el touring.', location: 'Monterrey', members: 8 },
];

export default function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  const [joined, setJoined] = useState(false);
  const [club, setClub] = useState<any>(null);

  useEffect(() => {
    const foundClub = MOCK_CLUBS.find((c) => c.id === id);
    setClub(foundClub || null);
  }, [id]);

  if (!club) {
    return (
      <MainLayout>
        <ThemedView style={[gs.screen, { justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText style={gs.textSecondary}>MotoClub no encontrado.</ThemedText>
        </ThemedView>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ThemedView style={gs.screen}>
        <ScrollView contentContainerStyle={gs.scrollContent}>
          {/* === Info del Club === */}
          <View
            style={{
              marginTop: 20,
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText style={[gs.textPrimary, { fontSize: 18, fontWeight: '600' }]}>
                {club.name}
              </ThemedText>
              <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
                {club.location} • {club.members} Miembros
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={() => setJoined(!joined)}
              style={{
                backgroundColor: joined ? Colors.danger : Colors.tint,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: Radius.medium,
              }}
            >
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                {joined ? 'Salir del MotoClub' : 'Unirse al MotoClub'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* === Sobre este MotoClub === */}
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <View
              style={[
                gs.card,
                { backgroundColor: Colors.surface, padding: 16, borderRadius: Radius.large },
              ]}
            >
              <ThemedText style={[gs.textPrimary, { fontWeight: '600', marginBottom: 6 }]}>
                Sobre este MotoClub
              </ThemedText>
              <ThemedText style={gs.textSecondary}>{club.description}</ThemedText>
            </View>
          </View>

          {/* === Eventos === */}
          <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
            <View
              style={[
                gs.card,
                { backgroundColor: Colors.surface, padding: 16, borderRadius: Radius.large },
              ]}
            >
              <ThemedText style={[gs.textPrimary, { fontWeight: '600', marginBottom: 6 }]}>
                Eventos
              </ThemedText>
              <ThemedText style={gs.textSecondary}>
                Los eventos del MotoClub aparecerán aquí
              </ThemedText>
              <TouchableOpacity
                disabled
                style={{
                  backgroundColor: Colors.tint,
                  alignSelf: 'flex-start',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: Radius.medium,
                  marginTop: 10,
                }}
              >
                <ThemedText style={{ color: '#fff', fontSize: 13 }}>Próximamente</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* === Rutas === */}
          <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
            <View
              style={[
                gs.card,
                { backgroundColor: Colors.surface, padding: 16, borderRadius: Radius.large },
              ]}
            >
              <ThemedText style={[gs.textPrimary, { fontWeight: '600', marginBottom: 6 }]}>
                Rutas
              </ThemedText>
              <ThemedText style={gs.textSecondary}>
                Las rutas del MotoClub aparecerán aquí
              </ThemedText>
              <TouchableOpacity
                disabled
                style={{
                  backgroundColor: Colors.tint,
                  alignSelf: 'flex-start',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: Radius.medium,
                  marginTop: 10,
                }}
              >
                <ThemedText style={{ color: '#fff', fontSize: 13 }}>Próximamente</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </ThemedView>
    </MainLayout>
  );
}
