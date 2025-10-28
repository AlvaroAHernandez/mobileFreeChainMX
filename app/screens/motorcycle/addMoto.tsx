import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function AddMotoScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  const [moto, setMoto] = useState({
    marca: '',
    modelo: '',
    anio: '',
    matricula: '',
    color: '',
    cilindrada: '',
  });

  const handleAddMoto = () => {
    if (!moto.marca || !moto.modelo || !moto.anio || !moto.matricula) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos obligatorios.');
      return;
    }

    // Enviar moto como parámetro temporal (no persistente)
    router.push({
      pathname: '/screens/motorcycle/garage',
      params: { nuevaMoto: JSON.stringify(moto) },
    });
  };

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {/* Header */}
        <View style={gs.header}>
          <ThemedText style={gs.headerTitle}>FREE CHAIN MX</ThemedText>
        </View>

        {/* Botón regresar */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10, marginLeft: 4 }}>
          <Text style={{ fontSize: 24, color: Colors.text }}>{'<'}</Text>
        </TouchableOpacity>

        {/* Formulario */}
        <View style={[gs.card, { marginTop: 20, backgroundColor: Colors.surface, padding: 20 }]}>
          <ThemedText style={[gs.textPrimary, { fontSize: 18, marginBottom: 10 }]}>
            Agregar Motocicleta
          </ThemedText>

          {(Object.keys(moto) as (keyof typeof moto)[]).map((field) => (
            <View key={field} style={{ marginBottom: 10 }}>
              <Text style={[gs.textSecondary, { marginBottom: 4, textTransform: 'capitalize' }]}>
                {field === 'anio' ? 'Año' : field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <TextInput
                value={moto[field]}
                onChangeText={(text) => setMoto({ ...moto, [field]: text })}
                style={[gs.input, { backgroundColor: Colors.inputBackground }]}
                placeholder={`Ingrese ${field}`}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          ))}

          {/* Botones */}
          <TouchableOpacity style={[gs.primaryButton, { marginTop: 12 }]} onPress={handleAddMoto}>
            <Text style={gs.primaryButtonText}>Agregar Motocicleta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              gs.primaryButton,
              {
                marginTop: 10,
                backgroundColor: 'transparent',
                borderColor: Colors.text,
                borderWidth: 1,
              },
            ]}
            onPress={() => router.back()}>
            <Text style={[gs.primaryButtonText, { color: Colors.text }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
