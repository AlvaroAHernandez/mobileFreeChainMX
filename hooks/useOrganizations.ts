// hooks/useOrganizations.ts (ACTUALIZADO CON BÚSQUEDA REAL)
import api from '@/services/api';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface Organization {
  id: number;
  name: string;
  description: string;
  address: string;
  logo_url: string;
  users?: any[];
  // Campos calculados
  is_member?: boolean;
  user_role?: string;
  users_count?: number;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { user } = useAuth();

  const fetchOrganizations = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/organizations';
      if (searchQuery && searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await api.get(url);
      const organizationsData: Organization[] = response.data.data.organizations || [];
      
      // Calcular campos adicionales
      const organizationsWithCalculatedFields = organizationsData.map(org => {
        const users = org.users || [];
        const userMembership = user ? users.find((orgUser: any) => orgUser.id === user.id) : null;

        return {
          ...org,
          is_member: !!userMembership,
          user_role: userMembership?.pivot?.role || null,
          users_count: users.length
        };
      });

      setOrganizations(organizationsWithCalculatedFields);
    } catch (err: any) {
      console.error('❌ Error fetching organizations:', err);
      setError(err.response?.data?.message || 'Error al cargar los clubs');
    } finally {
      setLoading(false);
    }
  };

  const searchOrganizations = async (query: string) => {
    await fetchOrganizations(query);
  };

  // Función para unirse a un club
  const joinOrganization = async (organizationId: number) => {
    try {
      setActionLoading(organizationId);
      
      const response = await api.post(`/organizations/${organizationId}/join`);
      
      // Actualizar el estado local
      setOrganizations(prev => prev.map(org => {
        if (org.id === organizationId) {
          return {
            ...org,
            is_member: true,
            user_role: 'miembro',
            users_count: (org.users_count || 0) + 1
          };
        }
        return org;
      }));

      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('❌ Error joining organization:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al unirse al club' 
      };
    } finally {
      setActionLoading(null);
    }
  };

  // Función para salir de un club
  const leaveOrganization = async (organizationId: number) => {
    try {
      setActionLoading(organizationId);
      
      const response = await api.post(`/organizations/${organizationId}/leave`);
      
      // Actualizar el estado local
      setOrganizations(prev => prev.map(org => {
        if (org.id === organizationId) {
          return {
            ...org,
            is_member: false,
            user_role: undefined,
            users_count: Math.max(0, (org.users_count || 1) - 1)
          };
        }
        return org;
      }));

      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('❌ Error leaving organization:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al salir del club' 
      };
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  return {
    organizations,
    loading,
    error,
    actionLoading,
    refetch: () => fetchOrganizations(),
    searchOrganizations,
    joinOrganization,
    leaveOrganization
  };
};