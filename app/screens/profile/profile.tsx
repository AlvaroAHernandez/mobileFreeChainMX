import MainLayout from '@/components/MainLayout';
import { ThemedText } from '@/components/themed-text';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ProfileScreen() {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);
  const gs = useGlobalStyles();
  const router = useRouter();

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <ThemedText style={[gs.sectionTitle, { fontSize: 22 }]}>Mi Perfil</ThemedText>
        <ThemedText style={[gs.textSecondary, { marginBottom: 20 }]}>
          Gestiona tu información
        </ThemedText>

        
        <View
          style={[
            gs.card,
            {
              backgroundColor: Colors.surface,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            },
          ]}
        >
          <ThemedText style={[gs.textPrimary, { marginBottom: 6 }]}>Email</ThemedText>
          <TextInput
            style={[
              gs.input,
              { backgroundColor: Colors.inputBackground || '#0E1630', marginBottom: 10 },
            ]}
            value="wegt@gmail.com"
            editable={false}
            placeholderTextColor={Colors.textMuted}
          />
          <ThemedText style={[gs.textMuted, { fontSize: 12, marginBottom: 10 }]}>
            El email no se puede cambiar
          </ThemedText>

          <ThemedText style={[gs.textPrimary, { marginBottom: 6 }]}>Nombre Completo</ThemedText>
          <TextInput
            style={[
              gs.input,
              { backgroundColor: Colors.inputBackground || '#0E1630', marginBottom: 10 },
            ]}
            value="Wegt"
            placeholder="Nombre"
            placeholderTextColor={Colors.textMuted}
          />

          <ThemedText style={[gs.textPrimary, { marginBottom: 6 }]}>Teléfono</ThemedText>
          <TextInput
            style={[
              gs.input,
              { backgroundColor: Colors.inputBackground || '#0E1630', marginBottom: 16 },
            ]}
            value="+34 600 000 000"
            placeholder="Teléfono"
            placeholderTextColor={Colors.textMuted}
          />

          <TouchableOpacity style={[gs.primaryButton]}>
            <Text style={gs.primaryButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>

        
        <View
          style={[
            gs.card,
            {
              backgroundColor: Colors.surface,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="heart-outline" size={20} color={Colors.tint} />
              <ThemedText style={gs.textPrimary}>Información Clínica</ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/screens/health/health')}
              style={{
                backgroundColor: Colors.tint,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 8,
              }}
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

        
        <View
          style={[
            gs.card,
            {
              backgroundColor: Colors.surface,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="call-outline" size={20} color={Colors.tint} />
              <ThemedText style={gs.textPrimary}>Contactos de Emergencia</ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/screens/health/health')}
              style={{
                backgroundColor: Colors.tint,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 13 }}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginVertical: 15 }}>
            <Ionicons name="alert-circle-outline" size={36} color={Colors.textMuted} />
            <ThemedText style={[gs.textSecondary, { marginTop: 8 }]}>
              No hay contactos de emergencia
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/screens/health/health')}
            style={[gs.primaryButton, { alignSelf: 'center', marginTop: 6 }]}
          >
            <Text style={gs.primaryButtonText}>Agregar contacto</Text>
          </TouchableOpacity>
        </View>

        
        <View
          style={{
            backgroundColor: Colors.surface,
            borderColor: '#E63946',
            borderWidth: 1,
            borderRadius: 12,
            padding: 16,
            marginBottom: 50,
          }}
        >
          <ThemedText style={{ color: '#E63946', fontWeight: '600', marginBottom: 6 }}>
            Zona de peligro
          </ThemedText>
          <ThemedText style={[gs.textSecondary, { marginBottom: 12 }]}>
            Una vez que elimines tu cuenta, no hay vuelta atrás.
          </ThemedText>
          <TouchableOpacity
            style={{
              backgroundColor: '#E63946',
              borderRadius: 10,
              alignSelf: 'center',
              paddingHorizontal: 20,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Eliminar Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
