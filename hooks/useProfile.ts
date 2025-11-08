// hooks/useProfile.ts
import api from "@/services/api";
import { getUser } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface ProfileData {
  name: string;
  lastname?: string;
  phone_number?: string;
  email: string;
  profile_photo_file?: any;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (): Promise<any> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Se necesitan permisos para acceder a la galería"
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        return {
          uri: image.uri,
          type: 'image/jpeg',
          name: `profile_${Date.now()}.jpg`
        };
      }
      return null;
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedUser = await getUser();
      if (!storedUser?.id) throw new Error("Usuario no encontrado");

      const response = await api.get(`/users/${storedUser.id}`);
      setProfile(response.data.data.user);
    } catch (err: any) {
      console.error("❌ Error fetching profile:", err);
      setError(err.response?.data?.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileData) => {
    try {
      setUpdating(true);
      setError(null);

      const storedUser = await getUser();
      if (!storedUser?.id) throw new Error("Usuario no encontrado");

      const formData = new FormData();

      // Agregar campos básicos
      formData.append("name", data.name);
      if (data.lastname) formData.append("lastname", data.lastname);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);

      // Agregar archivo de foto si existe
      if (data.profile_photo_file) {
        formData.append("profile_photo_file", data.profile_photo_file);
      }

      const response = await api.post(`/users/${storedUser.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data.data);

      Alert.alert("¡Éxito!", "Perfil actualizado correctamente");
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error("❌ Error updating profile:", err);
      const errorMessage =
        err.response?.data?.message || "Error al actualizar el perfil";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    error,
    fetchProfile,
    updateProfile,
    pickImage,
  };
};