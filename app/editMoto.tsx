import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

// ✅ Tipo para las motos
type Moto = {
  marca: string;
  modelo: string;
  anio: string;
  matricula: string;
  color: string;
  cilindrada: string;
};

export default function EditMotoScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);
  const params = useLocalSearchParams();

  // ✅ Estado con tipo explícito
  const [moto, setMoto] = useState<Moto>({
    marca: (params.marca as string) || '',
    modelo: (params.modelo as string) || '',
    anio: (params.anio as string) || '',
    matricula: (params.matricula as string) || '',
    color: (params.color as string) || '',
    cilindrada: (params.cilindrada as string) || '',
  });

  // ✅ Función de cambio con tipo seguro
  const handleChange = (field: keyof Moto, value: string) => {
    setMoto((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert('Cambios guardados', 'La información fue actualizada.');
    router.replace({
      pathname: '/motoDetails',
      params: { ...moto },
    });
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
            {moto.marca} {moto.modelo}
          </ThemedText>
          <ThemedText style={gs.textSecondary}>
            Editar información
          </ThemedText>
        </View>
      </View>

      {/* Formulario */}
      <View
        style={[
          gs.card,
          {
            marginHorizontal: 20,
            marginTop: 20,
            paddingVertical: 20,
            alignItems: 'flex-start',
          },
        ]}>
        {(
          [
            { label: 'Marca', key: 'marca' },
            { label: 'Modelo', key: 'modelo' },
            { label: 'Año', key: 'anio' },
            { label: 'Matrícula', key: 'matricula' },
            { label: 'Color', key: 'color' },
            { label: 'Cilindrada', key: 'cilindrada' },
          ] as { label: string; key: keyof Moto }[]
        ).map((item, i) => (
          <View key={i} style={{ marginBottom: 12, width: '100%' }}>
            <ThemedText style={gs.textSecondary}>{item.label}</ThemedText>
            <TextInput
              value={moto[item.key]}
              onChangeText={(value) => handleChange(item.key, value)}
              style={{
                borderWidth: 1,
                borderColor: Colors.tint,
                borderRadius: 8,
                padding: 8,
                color: Colors.text,
                marginTop: 4,
              }}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        ))}

        {/* Botones */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            style={[
              gs.primaryButton,
              { paddingHorizontal: 20, paddingVertical: 8 },
            ]}>
            <Text style={gs.primaryButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={{
              borderWidth: 1,
              borderColor: Colors.text,
              borderRadius: 8,
              paddingHorizontal: 20,
              paddingVertical: 8,
              justifyContent: 'center',
            }}>
            <Text style={{ color: Colors.text, fontSize: 15 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}
