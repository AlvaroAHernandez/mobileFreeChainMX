// app/screens/auth/register.tsx
import AuthScreenLayout from "@/components/AuthScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors, Radius } from "@/constants/theme";
import { useRegister } from "@/hooks/useRegister";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");
  const { loading, register, pickImage, takePhoto } = useRegister();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const [profileImage, setProfileImage] = useState<any>(null);
  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      lastname: "",
      email: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
    };

    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "El email no es válido";
      isValid = false;
    }

    if (form.phone_number && !/^[0-9]{10,15}$/.test(form.phone_number)) {
      newErrors.phone_number = "El teléfono debe tener entre 10 y 15 dígitos";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (!form.password_confirmation) {
      newErrors.password_confirmation = "Confirma tu contraseña";
      isValid = false;
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageSelect = async (type: "gallery" | "camera") => {
    const image = type === "gallery" ? await pickImage() : await takePhoto();
    if (image) {
      setProfileImage(image);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await register({
      ...form,
      profile_photo_file: profileImage,
    });

    if (result.success) {
      Alert.alert("¡Éxito!", "Cuenta creada correctamente");
      // La redirección se maneja automáticamente en el hook
    } else {
      Alert.alert("Error", result.error || "Error al crear la cuenta");
    }
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <AuthScreenLayout
      title="Crear Cuenta"
      subtitle="Únete a la comunidad motera"
      showBackButton={true}
    >
      {/* Foto de Perfil - Dropzone Style */}
      <View style={[gs.card, styles.photoSection]}>
        <ThemedText style={styles.sectionTitle}>Foto de Perfil</ThemedText>
        
        <TouchableOpacity
          style={[
            styles.dropzone,
            { 
              borderColor: profileImage ? Colors.success : Colors.border,
              backgroundColor: Colors.inputBackground 
            }
          ]}
          onPress={() => Alert.alert(
            "Seleccionar foto",
            "Elige una opción",
            [
              { 
                text: "Galería", 
                onPress: () => handleImageSelect("gallery") 
              },
              { 
                text: "Cámara", 
                onPress: () => handleImageSelect("camera") 
              },
              { 
                text: "Cancelar", 
                style: "cancel" 
              }
            ]
          )}
        >
          {profileImage ? (
            <Image 
              source={{ uri: profileImage.uri }} 
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.dropzoneContent}>
              <Ionicons 
                name="cloud-upload-outline" 
                size={32} 
                color={Colors.textSecondary} 
              />
              <ThemedText style={styles.dropzoneText}>
                Toca para seleccionar foto
              </ThemedText>
              <ThemedText style={styles.dropzoneSubtext}>
                Galería o Cámara
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {profileImage && (
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={() => setProfileImage(null)}
          >
            <Ionicons name="close-circle" size={16} color={Colors.error} />
            <ThemedText style={styles.changePhotoText}>
              Quitar foto
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Formulario */}
      <View style={[gs.card, styles.formSection]}>
        <ThemedText style={styles.sectionTitle}>Información Personal</ThemedText>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Nombre *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
                borderColor: errors.name ? Colors.error : Colors.border
              }
            ]}
            placeholder="Ingresa tu nombre"
            placeholderTextColor={Colors.textSecondary}
            value={form.name}
            onChangeText={(text) => {
              setForm({ ...form, name: text });
              clearError("name");
            }}
          />
          {errors.name ? (
            <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
          ) : null}
        </View>

        {/* Apellido */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Apellido</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
                borderColor: errors.lastname ? Colors.error : Colors.border
              }
            ]}
            placeholder="Ingresa tu apellido"
            placeholderTextColor={Colors.textSecondary}
            value={form.lastname}
            onChangeText={(text) => {
              setForm({ ...form, lastname: text });
              clearError("lastname");
            }}
          />
          {errors.lastname ? (
            <ThemedText style={styles.errorText}>{errors.lastname}</ThemedText>
          ) : null}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
                borderColor: errors.email ? Colors.error : Colors.border
              }
            ]}
            placeholder="tu@email.com"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => {
              setForm({ ...form, email: text });
              clearError("email");
            }}
          />
          {errors.email ? (
            <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
          ) : null}
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Teléfono</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
                borderColor: errors.phone_number ? Colors.error : Colors.border
              }
            ]}
            placeholder="Ingresa tu teléfono"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="phone-pad"
            value={form.phone_number}
            onChangeText={(text) => {
              setForm({ ...form, phone_number: text });
              clearError("phone_number");
            }}
          />
          {errors.phone_number ? (
            <ThemedText style={styles.errorText}>{errors.phone_number}</ThemedText>
          ) : null}
        </View>

        {/* Contraseña */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Contraseña *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
                borderColor: errors.password ? Colors.error : Colors.border
              }
            ]}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Colors.textSecondary}
            secureTextEntry
            value={form.password}
            onChangeText={(text) => {
              setForm({ ...form, password: text });
              clearError("password");
            }}
          />
          {errors.password ? (
            <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
          ) : null}
        </View>

        {/* Confirmar Contraseña */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Confirmar Contraseña *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
                borderColor: errors.password_confirmation ? Colors.error : Colors.border
              }
            ]}
            placeholder="Repite tu contraseña"
            placeholderTextColor={Colors.textSecondary}
            secureTextEntry
            value={form.password_confirmation}
            onChangeText={(text) => {
              setForm({ ...form, password_confirmation: text });
              clearError("password_confirmation");
            }}
          />
          {errors.password_confirmation ? (
            <ThemedText style={styles.errorText}>
              {errors.password_confirmation}
            </ThemedText>
          ) : null}
        </View>

        {/* Botón de Registro */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            { 
              backgroundColor: Colors.tint,
              opacity: loading ? 0.7 : 1
            }
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <ThemedText style={styles.registerButtonText}>
                Crear Cuenta
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {/* Enlace para iniciar sesión */}
        <View style={styles.loginLink}>
          <ThemedText style={styles.loginText}>
            ¿Ya tienes cuenta?{" "}
          </ThemedText>
          <TouchableOpacity onPress={() => router.push("/screens/auth/login")}>
            <ThemedText style={styles.loginLinkText}>
              Inicia sesión
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  photoSection: {
    marginBottom: 20,
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dropzone: {
    height: 140,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: Radius.medium,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  dropzoneContent: {
    alignItems: "center",
    padding: 20,
  },
  dropzoneText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  dropzoneSubtext: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: "#ff3b30",
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: Radius.medium,
    gap: 8,
    marginTop: 8,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B5BFE",
  },
});