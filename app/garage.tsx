import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function GarageScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={gs.scrollContent}>
        {/* Header */}
        <View style={gs.header}>
          <ThemedText style={gs.headerTitle}>FREE CHAIN MX</ThemedText>
        </View>

        {/* Título y botón superior */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <View style={{ flexDirection: 'column', gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="chevron-back"
                size={20}
                color={Colors.text}
                onPress={() => router.back()}
              />
              <ThemedText
                style={[gs.sectionTitle, { marginLeft: 4, fontSize: 20 }]}>
                Mi Garaje
              </ThemedText>
            </View>
            <ThemedText style={gs.textSecondary}>
              Gestiona tus Motocicletas
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              gs.primaryButton,
              { paddingHorizontal: 16, paddingVertical: 8 },
            ]}
            onPress={() => console.log('Agregar Moto')}>
            <Text style={gs.primaryButtonText}>Agregar Moto</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de motos */}
        <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
          {[1, 2].map((i) => (
            <View key={i} style={[gs.card, { marginBottom: 16 }]}>
              <ThemedText
                style={[gs.textPrimary, { fontSize: 16, fontWeight: '600' }]}>
                Harley-Davidson Street 750
              </ThemedText>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}>
                <Text style={gs.textSecondary}>Año:</Text>
                <Text style={gs.textPrimary}>2022</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}>
                <Text style={gs.textSecondary}>Matrícula:</Text>
                <Text style={gs.textPrimary}>TRGH123</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}>
                <Text style={gs.textSecondary}>Color:</Text>
                <Text style={gs.textPrimary}>Negro</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}>
                <Text style={gs.textSecondary}>Motor:</Text>
                <Text style={gs.textPrimary}>750cc</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
