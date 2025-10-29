import MainLayout from '@/components/MainLayout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ClubCreateScreen() {
  const gs = useGlobalStyles();
  const router = useRouter();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleCreateClub = () => {
    console.log({ clubName, description, location });
    router.back();
  };

  {/* === Informacion del MotoClub === */}
  return (
    <MainLayout>
      <ThemedView style={gs.screen}>
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <ThemedText style={[gs.title, { fontSize: 20 }]}>Crear Motoclub</ThemedText>
          <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
            Da tu informacion para crear tu moto club.
          </ThemedText>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <TextInput
            placeholder="Nombre del Motoclub"
            placeholderTextColor={Colors.textSecondary}
            value={clubName}
            onChangeText={setClubName}
            style={gs.input}
          />
          <TextInput
            placeholder="Descripción"
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            style={[gs.input, { marginTop: 10 }]}
            multiline
            numberOfLines={3}
          />
          <TextInput
            placeholder="Ubicación"
            placeholderTextColor={Colors.textSecondary}
            value={location}
            onChangeText={setLocation}
            style={[gs.input, { marginTop: 10 }]}
          />

          <TouchableOpacity
            style={[gs.primaryButton, { marginTop: 15 }]}
            onPress={handleCreateClub}
          >
            <Text style={gs.primaryButtonText}>Crear Motoclub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[gs.primaryButton, { marginTop: 10, backgroundColor: Colors.surface }]}
            onPress={() => router.back()}
          >
            <Text style={[gs.primaryButtonText, { color: Colors.text }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </MainLayout>
  );
}
