// hooks/useCreateOrganization.ts
import { useAuth } from "@/context/AuthContext"; // ✅ contexto actual
import api from "@/services/api";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform } from "react-native";

interface CreateOrganizationData {
  name: string;
  description?: string;
  address?: string;
  logo_file?: any;
}

export const useCreateOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  // 📷 Seleccionar imagen
  const pickImage = async (): Promise<any> => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permisos necesarios", "Se necesitan permisos para acceder a la galería");
          return null;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const image = result.assets[0];
        return {
          uri: image.uri,
          type: "image/jpeg",
          name: `logo_${Date.now()}.jpg`,
        };
      }
      return null;
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  // 🏍️ Crear club
  const createOrganization = async (data: CreateOrganizationData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("address", data.address || "");
      if (data.logo_file) formData.append("logo_file", data.logo_file);

      // 👇 si tu backend necesita saber quién crea el club (opcional)
      if (user?.id) formData.append("user_id", String(user.id));

      const response = await api.post("/organizations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🔄 refrescar el usuario para que aparezca su nuevo club en la app
      await refreshUser();

      Alert.alert("¡Éxito!", "Club creado correctamente", [
        { text: "Aceptar", onPress: () => router.back() },
      ]);

      return { success: true, data: response.data };
    } catch (err: any) {
      console.error("❌ Error creating organization:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.name?.[0] ||
        "Error al crear el club";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createOrganization,
    pickImage,
  };
};
