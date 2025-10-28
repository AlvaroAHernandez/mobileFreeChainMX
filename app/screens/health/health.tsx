import MainLayout from '@/components/MainLayout';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGlobalStyles } from '@/constants/globalStyles';
import { getThemeColors } from '@/constants/theme';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

export default function HealthScreen() {
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  // === Estados principales ===
  const [editingInfo, setEditingInfo] = useState(false);
  const [clinicalInfo, setClinicalInfo] = useState<any>(null);

  const [contacts, setContacts] = useState<any[]>([]);
  const [addingContact, setAddingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', relation: '', phone: '' });

  const [tempClinicalInfo, setTempClinicalInfo] = useState({
    bloodType: '',
    insurer: '',
    policyNumber: '',
    allergies: '',
    medications: '',
    conditions: '',
  });

  // === Handlers ===
  const handleSaveClinicalInfo = () => {
    setClinicalInfo(tempClinicalInfo);
    setEditingInfo(false);
  };

  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.phone) return;
    setContacts([...contacts, contactForm]);
    setContactForm({ name: '', relation: '', phone: '' });
    setAddingContact(false);
  };

  const handleDeleteContact = (index: number) => {
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
  };

  return (
    <MainLayout>
      <ThemedView style={gs.screen}>
        <ScrollView contentContainerStyle={gs.scrollContent}>
          {/* === Título principal === */}
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <ThemedText style={[gs.title, { fontSize: 20 }]}>Información de salud</ThemedText>
            <ThemedText style={[gs.textSecondary, { marginTop: 4 }]}>
              Gestiona tu información médica y contactos de emergencia.
            </ThemedText>
          </View>

          {/* === Sección de información clínica === */}
          <View style={[gs.card, { marginHorizontal: 20, marginTop: 20 }]}>
            <ThemedText
              style={[
                gs.textPrimary,
                { fontWeight: '600', fontSize: 16, marginBottom: 10 },
              ]}
            >
              Información Clínica
            </ThemedText>

            {/* Sin información */}
            {!clinicalInfo && !editingInfo && (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <ThemedText style={gs.textSecondary}>
                  Aún no has añadido ninguna información
                </ThemedText>
                <TouchableOpacity
                  style={[gs.primaryButton, { marginTop: 15 }]}
                  onPress={() => setEditingInfo(true)}
                >
                  <Text style={gs.primaryButtonText}>Añadir información</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Editar información */}
            {editingInfo && (
              <View>
                <TextInput
                  placeholder="Tipo de sangre (A+, O-, ...)"
                  placeholderTextColor={Colors.textSecondary}
                  value={tempClinicalInfo.bloodType}
                  onChangeText={(t) =>
                    setTempClinicalInfo({ ...tempClinicalInfo, bloodType: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Aseguradora"
                  placeholderTextColor={Colors.textSecondary}
                  value={tempClinicalInfo.insurer}
                  onChangeText={(t) =>
                    setTempClinicalInfo({ ...tempClinicalInfo, insurer: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Número de póliza"
                  placeholderTextColor={Colors.textSecondary}
                  value={tempClinicalInfo.policyNumber}
                  onChangeText={(t) =>
                    setTempClinicalInfo({ ...tempClinicalInfo, policyNumber: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Alergias"
                  placeholderTextColor={Colors.textSecondary}
                  value={tempClinicalInfo.allergies}
                  onChangeText={(t) =>
                    setTempClinicalInfo({ ...tempClinicalInfo, allergies: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Medicamentos"
                  placeholderTextColor={Colors.textSecondary}
                  value={tempClinicalInfo.medications}
                  onChangeText={(t) =>
                    setTempClinicalInfo({ ...tempClinicalInfo, medications: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Condiciones médicas"
                  placeholderTextColor={Colors.textSecondary}
                  value={tempClinicalInfo.conditions}
                  onChangeText={(t) =>
                    setTempClinicalInfo({ ...tempClinicalInfo, conditions: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={[gs.primaryButton, { flex: 1, marginRight: 10 }]}
                    onPress={handleSaveClinicalInfo}
                  >
                    <Text style={gs.primaryButtonText}>Guardar información</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      gs.primaryButton,
                      { flex: 1, marginLeft: 10, backgroundColor: Colors.surface },
                    ]}
                    onPress={() => setEditingInfo(false)}
                  >
                    <Text style={[gs.primaryButtonText]}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Información guardada */}
            {clinicalInfo && !editingInfo && (
              <View>
                <ThemedText style={gs.textPrimary}>
                  Tipo de sangre: {clinicalInfo.bloodType || 'N/A'}
                </ThemedText>
                <ThemedText style={gs.textPrimary}>
                  Aseguradora: {clinicalInfo.insurer || 'N/A'}
                </ThemedText>
                <ThemedText style={gs.textPrimary}>
                  Número de Póliza: {clinicalInfo.policyNumber || 'N/A'}
                </ThemedText>
                <ThemedText style={gs.textPrimary}>
                  Alergias: {clinicalInfo.allergies || 'Ninguna'}
                </ThemedText>
                <ThemedText style={gs.textPrimary}>
                  Medicamentos: {clinicalInfo.medications || 'Ninguno'}
                </ThemedText>
                <ThemedText style={gs.textPrimary}>
                  Condiciones Médicas: {clinicalInfo.conditions || 'Ninguna'}
                </ThemedText>

                <TouchableOpacity
                  style={[gs.primaryButton, { marginTop: 15 }]}
                  onPress={() => setEditingInfo(true)}
                >
                  <Text style={gs.primaryButtonText}>Actualizar información</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* === Sección de contactos de emergencia === */}
          <View
            style={[gs.card, { marginHorizontal: 20, marginTop: 20, marginBottom: 40 }]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ThemedText
                style={[gs.textPrimary, { fontWeight: '600', fontSize: 16 }]}
              >
                Contactos de Emergencia
              </ThemedText>

              {!addingContact && (
                <TouchableOpacity
                  onPress={() => setAddingContact(true)}
                  style={[gs.primaryButton, { paddingVertical: 6 }]}
                >
                  <Text style={gs.primaryButtonText}>Añadir contacto</Text>
                </TouchableOpacity>
              )}
            </View>

            {addingContact && (
              <View style={{ marginTop: 10 }}>
                <TextInput
                  placeholder="Nombre completo"
                  placeholderTextColor={Colors.textSecondary}
                  value={contactForm.name}
                  onChangeText={(t) => setContactForm({ ...contactForm, name: t })}
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Relación (pareja, amigo, familiar...)"
                  placeholderTextColor={Colors.textSecondary}
                  value={contactForm.relation}
                  onChangeText={(t) =>
                    setContactForm({ ...contactForm, relation: t })
                  }
                  style={[gs.input, { color: Colors.text }]}
                />
                <TextInput
                  placeholder="Teléfono"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="phone-pad"
                  value={contactForm.phone}
                  onChangeText={(t) => setContactForm({ ...contactForm, phone: t })}
                  style={[gs.input, { color: Colors.text }]}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={[gs.primaryButton, { flex: 1, marginRight: 10 }]}
                    onPress={handleAddContact}
                  >
                    <Text style={gs.primaryButtonText}>Guardar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      gs.primaryButton,
                      { flex: 1, marginLeft: 10, backgroundColor: Colors.surface },
                    ]}
                    onPress={() => setAddingContact(false)}
                  >
                    <Text style={[gs.primaryButtonText]}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {contacts.length === 0 && !addingContact && (
              <View style={{ alignItems: 'center', marginTop: 15 }}>
                <ThemedText style={gs.textSecondary}>
                  Aún no has añadido contactos de emergencia
                </ThemedText>
              </View>
            )}

            {contacts.map((c, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: Colors.surface,
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <ThemedText
                  style={[gs.textPrimary, { fontWeight: '600' }]}
                >
                  {c.name}
                </ThemedText>
                <ThemedText style={gs.textSecondary}>{c.relation}</ThemedText>
                <ThemedText style={gs.textMuted}>{c.phone}</ThemedText>

                <TouchableOpacity
                  style={[
                    gs.primaryButton,
                    { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#ff3b30' },
                  ]}
                  onPress={() => handleDeleteContact(i)}
                >
                  <Text style={gs.primaryButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </MainLayout>
  );
}
