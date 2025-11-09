// app/screens/events/create.tsx
import ScreenLayout from "@/components/ScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useUser } from "@/context/UserContext";
import { useEventCreation } from "@/hooks/useEventCreation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateEventScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");
  const { user } = useUser();

  const {
    canCreateEvents,
    getEligibleOrganizations,
    createEvent,
    loading,
    error,
  } = useEventCreation();

  const [formData, setFormData] = useState({
    organization_id: "",
    name: "",
    date: new Date(),
    location: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const eligibleOrganizations = getEligibleOrganizations();

  console.log("🔍 CreateEventScreen - user:", user);
  console.log("🔍 CreateEventScreen - eligibleOrganizations:", eligibleOrganizations);

  // ✅ QUITADA LA VALIDACIÓN DE PERMISOS - Todos pueden acceder

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.organization_id) {
      errors.organization_id = "Selecciona una organización";
    }
    if (!formData.name.trim()) {
      errors.name = "El nombre del evento es requerido";
    }
    if (!formData.date) {
      errors.date = "La fecha del evento es requerida";
    }
    if (!formData.location.trim()) {
      errors.location = "La ubicación es requerida";
    }
    if (!formData.description.trim()) {
      errors.description = "La descripción es requerida";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const eventData = {
        ...formData,
        date: formData.date.toISOString().split(".")[0], // Formato ISO sin milisegundos
      };

      console.log("🎯 Submitting event:", eventData);
      await createEvent(eventData);
    } catch (err) {
      // El error ya está manejado en el hook
      console.log("❌ Error en handleSubmit:", err);
    }
  };

  const getRoleText = (role: string) => {
    const roles: { [key: string]: string } = {
      admin: "Administrador",
      owner: "Dueño",
      moderator: "Moderador",
      lider: "Líder",
      miembro: "Miembro",
      member: "Miembro",
    };
    return roles[role.toLowerCase()] || "Miembro";
  };

  return (
    <ScreenLayout title="CREAR EVENTO">
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Crear Nuevo Evento</ThemedText>
        </View>

        {/* Formulario */}
        <ThemedView style={styles.form}>
          {/* Organización */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Organización *</ThemedText>
            <View style={styles.selectContainer}>
              {eligibleOrganizations.length > 0 ? (
                eligibleOrganizations.map((org) => (
                  <TouchableOpacity
                    key={org.id}
                    style={[
                      styles.orgOption,
                      formData.organization_id === org.id.toString() && {
                        backgroundColor: Colors.tint + "20",
                        borderColor: Colors.tint,
                      },
                    ]}
                    onPress={() => {
                      console.log("🎯 Selected organization:", org.id, org.name);
                      setFormData((prev) => ({
                        ...prev,
                        organization_id: org.id.toString(),
                      }));
                    }}
                  >
                    <View style={styles.orgInfo}>
                      <ThemedText style={styles.orgName}>{org.name}</ThemedText>
                      <ThemedText style={styles.orgRole}>
                        {getRoleText(org.pivot?.role)}
                      </ThemedText>
                    </View>
                    {formData.organization_id === org.id.toString() && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.tint}
                      />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <ThemedText style={styles.noOrganizationsText}>
                  No tienes organizaciones. Primero únete a una organización.
                </ThemedText>
              )}
            </View>
            {formErrors.organization_id && (
              <ThemedText style={styles.errorText}>
                {formErrors.organization_id}
              </ThemedText>
            )}
          </View>

          {/* Nombre del Evento */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombre del Evento *</ThemedText>
            <TextInput
              placeholder="Ingresa el nombre del evento"
              placeholderTextColor={Colors.textSecondary}
              value={formData.name}
              onChangeText={(value) => {
                setFormData((prev) => ({ ...prev, name: value }));
                setFormErrors((prev) => ({ ...prev, name: "" }));
              }}
              style={[
                styles.textInput,
                {
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: formErrors.name ? Colors.danger : Colors.border,
                },
              ]}
            />
            {formErrors.name && (
              <ThemedText style={styles.errorText}>
                {formErrors.name}
              </ThemedText>
            )}
          </View>

          {/* Fecha y Hora */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Fecha y Hora *</ThemedText>
            <TextInput
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor={Colors.textSecondary}
              value={formData.date.toISOString().slice(0, 16)}
              onChangeText={(value) => {
                if (value) {
                  const newDate = new Date(value);
                  if (!isNaN(newDate.getTime())) {
                    setFormData((prev) => ({ ...prev, date: newDate }));
                  }
                }
              }}
              style={[
                styles.textInput,
                {
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: formErrors.date ? Colors.danger : Colors.border,
                },
              ]}
            />
            {formErrors.date && (
              <ThemedText style={styles.errorText}>
                {formErrors.date}
              </ThemedText>
            )}
          </View>

          {/* Ubicación */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Ubicación *</ThemedText>
            <TextInput
              placeholder="Ingresa la ubicación del evento"
              placeholderTextColor={Colors.textSecondary}
              value={formData.location}
              onChangeText={(value) => {
                setFormData((prev) => ({ ...prev, location: value }));
                setFormErrors((prev) => ({ ...prev, location: "" }));
              }}
              style={[
                styles.textInput,
                {
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: formErrors.location
                    ? Colors.danger
                    : Colors.border,
                },
              ]}
            />
            {formErrors.location && (
              <ThemedText style={styles.errorText}>
                {formErrors.location}
              </ThemedText>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Descripción *</ThemedText>
            <TextInput
              placeholder="Describe tu evento..."
              placeholderTextColor={Colors.textSecondary}
              value={formData.description}
              onChangeText={(value) => {
                setFormData((prev) => ({ ...prev, description: value }));
                setFormErrors((prev) => ({ ...prev, description: "" }));
              }}
              style={[
                styles.textArea,
                {
                  color: Colors.text,
                  backgroundColor: Colors.inputBackground,
                  borderColor: formErrors.description
                    ? Colors.danger
                    : Colors.border,
                },
              ]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {formErrors.description && (
              <ThemedText style={styles.errorText}>
                {formErrors.description}
              </ThemedText>
            )}
          </View>

          {/* Botones de acción */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
              disabled={loading}
            >
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                { 
                  backgroundColor: Colors.tint,
                  opacity: eligibleOrganizations.length === 0 ? 0.5 : 1
                },
              ]}
              onPress={handleSubmit}
              disabled={loading || eligibleOrganizations.length === 0}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <ThemedText style={styles.submitButtonText}>
                    Crear Evento
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  form: {
    padding: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  textInput: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 100,
    fontSize: 16,
  },
  selectContainer: {
    gap: 8,
  },
  orgOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  orgRole: {
    fontSize: 14,
    opacity: 0.7,
  },
  noOrganizationsText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    padding: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});