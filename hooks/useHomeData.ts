import api from "@/services/api";
import { getUser } from "@/utils/storage";
import { useEffect, useState } from "react";

export const useHomeData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const storedUser = await getUser();
      if (!storedUser?.id) throw new Error("Usuario no encontrado en storage");

      const res = await api.get(`/users/${storedUser.id}`);
      setUserData(res.data.data.user);
    } catch (error) {
      console.error("❌ Error al cargar datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const motos = userData?.motorcycles || [];
  const motoClubs = userData?.organizations || [];

  return { userData, motos, motoClubs, loading, refresh: fetchUserData };
};
