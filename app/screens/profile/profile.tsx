import ScreenLayout from '@/components/ScreenLayout';
import { ThemedText } from '@/components/themed-text';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const gs = useGlobalStyles();
  const Colors = getThemeColors('dark');
  const router = useRouter();

  return (
    <ScreenLayout title="Mi Perfil">
      <View style={{ flex: 1, padding: 20 }}>
        {/* Título y subtítulo */}
        <ThemedText style={[gs.sectionTitle, { fontSize: 22 }]}>Mi Perfil</ThemedText>
        <ThemedText style={[gs.textSecondary, { marginBottom: 20 }]}>
          Gestiona tu información
        </ThemedText>

        {/* Información del usuario */}
        <View style={[gs.card, { backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 20 }]}>
          <ThemedText style={[gs.textPrimary, { marginBottom: 6 }]}>Email</ThemedText>
          <TextInput
            style={[gs.input, { backgroundColor: Colors.inputBackground || '#0E1630', marginBottom: 10 }]}
            value="wegt@gmail.com"
            editable={false}
            placeholderTextColor={Colors.textMuted}
          />
          <ThemedText style={[gs.textMuted, { fontSize: 12, marginBottom: 10 }]}>
            El email no se puede cambiar
          </ThemedText>

          <ThemedText style={[gs.textPrimary, { marginBottom: 6 }]}>Nombre Completo</ThemedText>
          <TextInput
            style={[gs.input, { backgroundColor: Colors.inputBackground || '#0E1630', marginBottom: 10 }]}
            value="Wegt"
            placeholder="Nombre"
            placeholderTextColor={Colors.textMuted}
          />

          <ThemedText style={[gs.textPrimary, { marginBottom: 6 }]}>Teléfono</ThemedText>
          <TextInput
            style={[gs.input, { backgroundColor: Colors.inputBackground || '#0E1630', marginBottom: 16 }]}
            value="+34 600 000 000"
            placeholder="Teléfono"
            placeholderTextColor={Colors.textMuted}
          />

          <TouchableOpacity style={gs.primaryButton}>
            <Text style={gs.primaryButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>

        {/* Información clínica */}
        <View style={[gs.card, { backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="heart-outline" size={20} color={Colors.tint} />
              <ThemedText style={gs.textPrimary}>Información Clínica</ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/screens/health/health')}
              style={{ backgroundColor: Colors.tint, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', fontSize: 13 }}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginVertical: 15 }}>
            <Ionicons name="alert-circle-outline" size={36} color={Colors.textMuted} />
            <ThemedText style={[gs.textSecondary, { marginTop: 8 }]}>
              No hay información clínica registrada
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/screens/health/health')}
            style={[gs.primaryButton, { alignSelf: 'center', marginTop: 6 }]}
          >
            <Text style={gs.primaryButtonText}>Agregar información</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
}
