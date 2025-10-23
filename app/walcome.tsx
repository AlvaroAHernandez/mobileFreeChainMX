import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';

// función para escalar tamaños de fuente
const scaleFont = (size: number, width: number) => (width / 375) * size;

export default function WalcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions(); // detecta ancho y alto del dispositivo

  const dynamicStyles = StyleSheet.create({
    title: {
      fontSize: scaleFont(32, width),
      fontWeight: '600',
      color: '#fff',
      textAlign: 'center',
      marginBottom: height * 0.015,
    },
    subtitle: {
      color: '#ccc',
      fontSize: scaleFont(15, width),
      textAlign: 'center',
      marginBottom: height * 0.08,
      lineHeight: scaleFont(22, width),
      width: width * 0.8,
      alignSelf: 'center',
    },
    primaryButton: {
      backgroundColor: '#3B5BFE',
      paddingVertical: height * 0.018,
      width: width * 0.7,
      borderRadius: 8,
      marginBottom: height * 0.02,
    },
    secondaryButton: {
      borderWidth: 1,
      borderColor: '#3B5BFE',
      backgroundColor: '#0A0B0F',
      paddingVertical: height * 0.018,
      width: width * 0.7,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: scaleFont(16, width),
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={dynamicStyles.title}>
        Free Chain MX
      </ThemedText>

      <ThemedText style={dynamicStyles.subtitle}>
        Conecta con otros riders, organiza rutas, y mantén tu seguridad en cada viaje
      </ThemedText>

      <TouchableOpacity
        style={dynamicStyles.primaryButton}
        onPress={() => router.push('/register')}
        activeOpacity={0.8}>
        <Text style={dynamicStyles.buttonText}>Comenzar ahora</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.secondaryButton}
        onPress={() => router.push('/login')}
        activeOpacity={0.8}>
        <Text style={dynamicStyles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
});
