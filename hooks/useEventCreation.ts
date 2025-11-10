// hooks/useEventCreation.ts
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useEventCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userWithOrgs, setUserWithOrgs] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadUserWithOrganizations = async () => {
      if (!user?.id) return;

      try {
        const response = await api.get(`/users/${user.id}`);
        if (response.data.code === 200 && response.data.data?.user) {
          setUserWithOrgs(response.data.data.user);
        } else {
          console.warn("⚠️ Estructura inesperada:", response.data);
        }
      } catch (error) {
        console.error("Error loading user organizations:", error);
      }
    };

    loadUserWithOrganizations();
  }, [user?.id]);

  const canCreateEvents = () => true;

  const getEligibleOrganizations = () => {
    const currentUser = userWithOrgs || user;

    if (!currentUser) {
      console.log("❌ No hay usuario cargado aún");
      return [];
    }

    if (!Array.isArray(currentUser.organizations)) {
      console.log("❌ El usuario no tiene organizaciones válidas");
      return [];
    }

    return currentUser.organizations;
  };

  const createEvent = async (eventData: {
    organization_id: string;
    name: string;
    date: string;
    location: string;
    description: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/events", eventData);

      if (response.data.code === 201 || response.data.success) {
        const event = response.data.data.event;

        Alert.alert("Éxito", "Evento creado correctamente");

        // Espera un segundo para mostrar el mensaje y luego redirige
        setTimeout(() => {
          router.replace(`/(tabs)/events/detail?id=${event.id}`);
        }, 800);

        return event;
      } else {
        throw new Error(response.data.message || "Error al crear el evento");
      }
    } catch (err: any) {
      console.log("❌ Full error:", err);
      console.log("❌ Error response:", err.response?.data);

      let errorMessage = "Error al crear el evento";
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        errorMessage = Object.values(validationErrors).flat().join(", ");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    canCreateEvents,
    getEligibleOrganizations,
    createEvent,
    loading,
    error,
    clearError: () => setError(null),
  };
}
