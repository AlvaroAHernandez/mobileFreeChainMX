import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import React from 'react';
import { ScrollView } from 'react-native';

export default function ChatScreen() {
  const gs = useGlobalStyles();

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ThemedText style={[gs.textPrimary, { fontSize: 22, fontWeight: '600' }]}>
          Chat
        </ThemedText>
        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>
          Aquí podrás chatear con tus amigos o miembros del motoclub. 💬
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
