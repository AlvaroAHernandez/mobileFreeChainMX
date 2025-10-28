import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function GarageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  const [motos, setMotos] = useState([
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
  ]);

  // Evita que la misma moto se agregue múltiples veces
  const motoAgregada = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (params?.nuevaMoto && !motoAgregada.current) {
        const nuevaMoto = JSON.parse(params.nuevaMoto as string);
        setMotos((prev) => [...prev, nuevaMoto]);
        motoAgregada.current = true; // marcar como agregada
      }
    }, [params])
  );

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={gs.scrollContent}>
        {/* Header */}
        <View style={gs.header}>
          <ThemedText style={gs.headerTitle}>FREE CHAIN MX</ThemedText>
        </View>

        {/* Título y botón agregar */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <View>
            <ThemedText style={[gs.sectionTitle, { fontSize: 20 }]}>Mi Garaje</ThemedText>
            <ThemedText style={gs.textSecondary}>Gestiona tus Motocicletas</ThemedText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[gs.primaryButton, { paddingHorizontal: 14, paddingVertical: 6 }]}
            onPress={() => {
              motoAgregada.current = false; // reset para permitir agregar otra moto
              router.push('/screens/motorcycle/addMoto');
            }}>
            <Text style={gs.primaryButtonText}>Agregar Moto</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de motos */}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          {motos.map((moto, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/screens/motorcycle/motoDetails',
                  params: { ...moto },
                })
              }
              style={[gs.card, { marginBottom: 16 }]}>
              <ThemedText style={[gs.textPrimary, { fontSize: 16, fontWeight: '600' }]}>
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
