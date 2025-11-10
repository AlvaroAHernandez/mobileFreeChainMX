// hooks/useRegister.ts
import { useAuth } from "@/context/AuthContext"; // 👈 asegúrate que apunta bien al AuthContext
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

interface RegisterData {
  name: string;
  lastname?: string;
  email: string;
  phone_number?: string;
  password: string;
  password_confirmation: string;
  profile_photo_file?: any;
}

export const useRegister = () => {
  const { register: registerUser } = useAuth(); // 👈 usa el register global del contexto
  const [loading, setLoading] = useState(false);

  const pickImage = async (): Promise<any> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos necesarios", "Se necesitan permisos para acceder a la galería");
        return null;
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
          name: `profile_${Date.now()}.jpg`,
        };
      }
      return null;
    } catch (error) {
      console.error("❌ Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    }
  };

  const takePhoto = async (): Promise<any> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos necesarios", "Se necesitan permisos para acceder a la cámara");
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const image = result.assets[0];
        return {
          uri: image.uri,
          type: "image/jpeg",
          name: `profile_${Date.now()}.jpg`,
        };
      }
      return null;
    } catch (error) {
      console.error("❌ Error al tomar foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
      return null;
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name.trim());
      if (data.lastname) formData.append("lastname", data.lastname.trim());
      formData.append("email", data.email.trim());
      if (data.phone_number) formData.append("phone_number", data.phone_number.trim());
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      if (data.profile_photo_file) {
        formData.append("profile_photo_file", data.profile_photo_file);
      }

      // 👇 Llama al register del contexto (AuthContext)
      await registerUser(formData);

      return { success: true };
    } catch (error: any) {
      console.log("❌ Error registro:", error.response?.data || error.message);

      let errorMessage = "Error al crear la cuenta";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const firstError = Object.values(backendErrors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, register, pickImage, takePhoto };
};
