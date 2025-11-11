import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { useEffect, useState } from "react";

export interface User {
  id: number;
  name: string;
  lastname: string | null;
  full_profile_photo_url: string | null;
  pivot: {
    organization_id: number;
    user_id: number;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Club {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  logo_url: string;
  users: User[];
}

export const useClubDetail = (id?: string) => {
  const { logout } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClub = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get(`/organizations/${id}`);
      setClub(data.data);
    } catch (err: any) {
      console.error("❌ Error al cargar club:", err);

      if (err.code === 401 || err.response?.status === 401) {
        await logout();
      }

      setError("No se pudo cargar la información del club");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  return {
    club,
    loading,
    error,
    refetch: fetchClub,
  };
};