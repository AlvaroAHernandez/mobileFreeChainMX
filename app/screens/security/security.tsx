import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function SecurityScreen() {
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);
  const router = useRouter();

  const [showNewAlert, setShowNewAlert] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [message, setMessage] = useState('');
  const [myAlerts, setMyAlerts] = useState([
    {
      id: 1,
      type: 'Accident',
      message: 'Choque carretera nacional rumbo a los cabos km 73',
      date: '15/9/2025 11:52pm',
    },
  ]);
  const [communityAlerts, setCommunityAlerts] = useState([
    {
      id: 2,
      user: 'Jose Juan',
      type: 'Accident',
      message: 'Choque carretera nacional rumbo a los cabos km 73',
      date: '15/9/2025 11:52pm',
    },
  ]);

  const handleSendAlert = () => {
    if (!emergencyType || !message) return;
    const newAlert = {
      id: Date.now(),
      type: emergencyType,
      message,
      date: new Date().toLocaleString(),
    };
    setMyAlerts([newAlert, ...myAlerts]);
    setShowNewAlert(false);
    setEmergencyType('');
    setMessage('');
  };

  const handleResolve = (id: number) => {
    setMyAlerts(myAlerts.filter(alert => alert.id !== id));
  };

  return (
    <ThemedView style={gs.screen}>
      <ScrollView contentContainerStyle={gs.scrollContent}>
        {/* Header */}
        <View style={gs.header}>
          <ThemedText style={gs.headerTitle}>FREE CHAIN MX</ThemedText>
        </View>

        {/* Subheader */}
        <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
          <ThemedText style={[gs.title, { fontSize: 20 }]}>Centro de Seguridad</ThemedText>
          <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
            Gestiona alertas de emergencia y comparte tu ubicación
          </ThemedText>
        </View>

        {/* === Alerta de Emergencia === */}
        <View style={[gs.card, { marginTop: 20, marginHorizontal: 20, backgroundColor: '#300' }]}>
          <ThemedText style={[gs.textPrimary, { color: '#fff', fontWeight: '600' }]}>
            Alerta de Emergencia
          </ThemedText>
          <ThemedText style={[gs.textSecondary, { color: '#fff', marginTop: 6 }]}>
            Envía una alerta de emergencia a tus contactos y miembros del motoclub
          </ThemedText>

          <TouchableOpacity
            style={[gs.primaryButton, { backgroundColor: '#D32F2F', marginTop: 14 }]}
            onPress={() => setShowNewAlert(true)}>
            <Text style={gs.primaryButtonText}>Enviar Alerta</Text>
          </TouchableOpacity>
        </View>

        {/* === Compartir ubicación === */}
        <View style={[gs.card, { marginTop: 20, marginHorizontal: 20 }]}>
          <ThemedText style={[gs.textPrimary, { fontWeight: '600' }]}>
            Compartir Ubicación
          </ThemedText>
          <ThemedText style={[gs.textSecondary, { marginTop: 6 }]}>
            Comparte tu ubicación con tu motoclub durante el viaje
          </ThemedText>

          <TouchableOpacity
            style={[gs.primaryButton, { marginTop: 14, backgroundColor: Colors.tint }]}
            onPress={() => alert('Función en desarrollo')}>
            <Text style={gs.primaryButtonText}>Comenzar a Compartir</Text>
          </TouchableOpacity>
        </View>

        {/* === Nueva alerta de emergencia === */}
        {showNewAlert && (
          <View style={[gs.card, { marginTop: 20, marginHorizontal: 20 }]}>
            <ThemedText style={[gs.textPrimary, { fontWeight: '600', marginBottom: 8 }]}>
              Nueva Alerta de Emergencia
            </ThemedText>

            <TextInput
              placeholder="Tipo de emergencia"
              placeholderTextColor={Colors.textMuted}
              style={gs.input}
              value={emergencyType}
              onChangeText={setEmergencyType}
            />

            <TextInput
              placeholder="Describe la situación..."
              placeholderTextColor={Colors.textMuted}
              multiline
              style={[gs.input, { height: 80, marginTop: 10 }]}
              value={message}
              onChangeText={setMessage}
            />

            <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[gs.primaryButton, { backgroundColor: '#D32F2F', flex: 1, marginRight: 6 }]}
                onPress={handleSendAlert}>
                <Text style={gs.primaryButtonText}>Enviar Alerta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[gs.primaryButton, { backgroundColor: Colors.surface, flex: 1, marginLeft: 6 }]}
                onPress={() => setShowNewAlert(false)}>
                <Text style={[gs.primaryButtonText, { color: Colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* === alertas activas === */}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <ThemedText style={gs.sectionTitle}>Mis alertas Activas</ThemedText>

          {myAlerts.map(alert => (
            <View
              key={alert.id}
              style={[
                gs.card,
                {
                  backgroundColor: '#400',
                  borderColor: '#D32F2F',
                  borderWidth: 1,
                  marginTop: 10,
                },
              ]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText
                  style={[gs.textPrimary, { color: '#fff', backgroundColor: '#D32F2F', paddingHorizontal: 8, borderRadius: 4 }]}>
                  {alert.type}
                </ThemedText>
                <TouchableOpacity onPress={() => handleResolve(alert.id)}>
                  <ThemedText style={{ color: Colors.tint, fontWeight: '600' }}>Resolver</ThemedText>
                </TouchableOpacity>
              </View>
              <ThemedText style={[gs.textSecondary, { color: '#fff', marginTop: 6 }]}>
                {alert.message}
              </ThemedText>
              <ThemedText style={[gs.textMuted, { color: '#ccc', marginTop: 4 }]}>
                {alert.date}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* === Alertas de la comunidad === */}
        <View style={{ marginTop: 20, paddingHorizontal: 20, marginBottom: 40 }}>
          <ThemedText style={gs.sectionTitle}>Alertas de la comunidad</ThemedText>

          {communityAlerts.map(alert => (
            <View
              key={alert.id}
              style={[
                gs.card,
                { backgroundColor: Colors.surface, marginTop: 10 },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={[gs.textPrimary, { fontWeight: '600' }]}>
                  {alert.user}
                </ThemedText>
                <ThemedText
                  style={{
                    color: '#fff',
                    backgroundColor: '#D32F2F',
                    paddingHorizontal: 8,
                    marginLeft: 10,
                    borderRadius: 4,
                  }}>
                  {alert.type}
                </ThemedText>
              </View>
              <ThemedText style={[gs.textSecondary, { marginTop: 6 }]}>
                {alert.message}
              </ThemedText>
              <ThemedText style={[gs.textMuted, { marginTop: 4 }]}>
                {alert.date}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
