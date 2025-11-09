// hooks/useEventCreation.ts
import { useUser } from '@/context/UserContext';
import api from '@/services/api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useEventCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userWithOrgs, setUserWithOrgs] = useState<any>(null);
  const { user } = useUser();
  const router = useRouter();

  // Cargar datos completos del usuario al montar el hook
  useEffect(() => {
    const loadUserWithOrganizations = async () => {
      if (!user?.id) return;
      
      try {
        const response = await api.get(`/users/${user.id}`);
        if (response.data.success) {
          setUserWithOrgs(response.data.data.user);
        }
      } catch (error) {
        console.error('Error loading user organizations:', error);
      }
    };

    loadUserWithOrganizations();
  }, [user?.id]);

  // ✅ QUITADA LA VALIDACIÓN DE ROLES - Ahora siempre retorna true
  const canCreateEvents = () => {
    console.log('✅ Todos los usuarios pueden crear eventos');
    return true;
  };

  // ✅ QUITADO EL FILTRO POR ROLES - Ahora retorna todas las organizaciones
  const getEligibleOrganizations = () => {
    const currentUser = userWithOrgs || user;
    
    if (!currentUser || !currentUser.organizations) {
      console.log('❌ No user or organizations found');
      return [];
    }
    
    console.log('✅ All organizations:', currentUser.organizations.map((org: any) => org.name));
    return currentUser.organizations;
  };

  // Crear nuevo evento
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
      console.log('📤 Sending event data:', eventData);
      
      const response = await api.post('/events', eventData);
      
      console.log('📥 API Response:', response.data);
      
      if (response.data.success) {
        Alert.alert(
          'Éxito',
          'Evento creado correctamente',
          [
            {
              text: 'Ver Evento',
              onPress: () => router.push(`/screens/events/detail?id=${response.data.data.event.id}`)
            },
            {
              text: 'Crear Otro',
              style: 'cancel',
            }
          ]
        );
        return response.data.data.event;
      } else {
        throw new Error(response.data.message || 'Error al crear el evento');
      }
    } catch (err: any) {
      console.log('❌ Full error:', err);
      console.log('❌ Error response:', err.response?.data);
      
      let errorMessage = 'Error al crear el evento';
      
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        errorMessage = Object.values(validationErrors).flat().join(', ');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
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
    clearError: () => setError(null)
  };
}