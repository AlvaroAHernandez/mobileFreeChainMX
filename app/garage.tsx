import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function GarageScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

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

        {/* Título */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <View>
            <ThemedText style={[gs.sectionTitle, { fontSize: 20 }]}>
              Mi Garaje
            </ThemedText>
            <ThemedText style={gs.textSecondary}>
              Gestiona tus Motocicletas
            </ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              gs.primaryButton,
              { paddingHorizontal: 14, paddingVertical: 6 },
            ]}
            onPress={() => console.log('Agregar moto')}>
            <Text style={gs.primaryButtonText}>Agregar Moto</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas */}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
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
                style={[gs.textPrimary, { fontSize: 16, fontWeight: '600' }]}>
                {moto.marca} {moto.modelo}
              </ThemedText>
              <ThemedText style={gs.textSecondary}>
                Año {moto.anio} • {moto.matricula}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
