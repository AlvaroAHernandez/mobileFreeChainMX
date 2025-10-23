import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  return (
    <KeyboardAvoidingView
      style={gs.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled">
        <ThemedView style={{ alignItems: 'center', paddingHorizontal: 24 }}>
          {/* Título */}
          <ThemedText style={[gs.title, { marginBottom: 8 }]}>
            Bienvenido
          </ThemedText>
          <ThemedText style={[gs.subtitle, { marginBottom: 32 }]}>
            Inicia sesión en tu cuenta
          </ThemedText>

          {/* Formulario */}
          <View style={[gs.card, { width: '100%', maxWidth: 400 }]}>
            <TextInput
              style={gs.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />

            <TextInput
              style={gs.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />

            <TouchableOpacity
              style={[gs.primaryButton, { marginTop: 12 }]}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)')}>
              <Text style={gs.primaryButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Link "Olvidé mi contraseña" */}
            <Text
              style={[gs.textSecondary, { textAlign: 'center', marginTop: 16 }]}>
              ¿Olvidaste tu contraseña?
            </Text>

            {/* Link "Registrarse" */}
            <Text
              style={[gs.textSecondary, { textAlign: 'center', marginTop: 12 }]}>
              ¿No tienes cuenta?{' '}
              <Text
                style={{ color: '#3B5BFE', textDecorationLine: 'underline' }}
                onPress={() => router.push('/register')}>
                Regístrate
              </Text>
            </Text>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
