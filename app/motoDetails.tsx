import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function MotoDetailsScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);
  const params = useLocalSearchParams();

  const {
    marca = 'Harley-Davidson',
    modelo = 'Street 750',
    anio = '2022',
    matricula = 'ABCS1234',
    color = 'Negro',
    cilindrada = '750cc',
  } = params;

  const handleDelete = () => {
    Alert.alert('Eliminar Moto', '¿Seguro que quieres eliminar esta moto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ThemedView style={gs.screen}>
      {/* Header */}
      <View style={gs.header}>
        <ThemedText style={gs.headerTitle}>FREE CHAIN MX</ThemedText>
      </View>

      {/* Título */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
        <Ionicons
          name="chevron-back"
          size={22}
          color={Colors.text}
          onPress={() => router.back()}
        />
        <View style={{ marginLeft: 6 }}>
          <ThemedText
            style={[gs.sectionTitle, { fontSize: 18, fontWeight: '600' }]}>
            {marca} {modelo}
          </ThemedText>
          <ThemedText style={gs.textSecondary}>
            Detalles de tu Motocicleta
          </ThemedText>
        </View>
      </View>

      {/* Tarjeta */}
      <View
        style={[
          gs.card,
          {
            marginHorizontal: 20,
            marginTop: 20,
            paddingVertical: 16,
            alignItems: 'flex-start',
          },
        ]}>
        <ThemedText style={gs.textSecondary}>Marca</ThemedText>
        <ThemedText style={gs.textPrimary}>{marca}</ThemedText>

        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>Modelo</ThemedText>
        <ThemedText style={gs.textPrimary}>{modelo}</ThemedText>

        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>Año</ThemedText>
        <ThemedText style={gs.textPrimary}>{anio}</ThemedText>

        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>Matrícula</ThemedText>
        <ThemedText style={gs.textPrimary}>{matricula}</ThemedText>

        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>Color</ThemedText>
        <ThemedText style={gs.textPrimary}>{color}</ThemedText>

        <ThemedText style={[gs.textSecondary, { marginTop: 10 }]}>
          Cilindrada
        </ThemedText>
        <ThemedText style={gs.textPrimary}>{cilindrada}</ThemedText>

        {/* Botón Editar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/editMoto',
              params: { marca, modelo, anio, matricula, color, cilindrada },
            })
          }
          style={[
            gs.primaryButton,
            {
              paddingHorizontal: 20,
              paddingVertical: 6,
              borderRadius: 6,
              marginTop: 14,
            },
          ]}>
          <Text style={gs.primaryButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón eliminar */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDelete}
        style={{
          backgroundColor: '#D32F2F',
          marginHorizontal: 20,
          marginTop: 40,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Eliminar Moto
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
