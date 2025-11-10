import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export const useHomeData = () => {
  const { user, refreshUser } = useAuth();
  const [userData, setUserData] = useState<any>(user);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const freshUser = await refreshUser();

      if (freshUser) {
        setUserData(freshUser);
      } else {
        console.warn("⚠️ No se recibió freshUser desde refreshUser()");
      }
    } catch (error) {
      console.error("❌ Error al cargar datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales o actualizar cuando cambie el user del contexto
  useEffect(() => {
    console.log("👀 useEffect detectó cambio en user:", user);
    if (user) {
      setUserData(user);
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, [user]);


  // 🔁 Si no hay datos después del primer render, intentar refrescar
  useEffect(() => {
    if (!userData && !loading) {
      console.log("🔁 No hay userData, intentando refetch...");
      fetchUserData();
    }
  }, [userData, loading]);

  const motos = userData?.motorcycles || [];
  const motoClubs = userData?.organizations || [];
  const eventos = userData?.events || [];

  console.log("📊 Conteo actual:", {
    motos: motos.length,
    clubs: motoClubs.length,
    eventos: eventos.length,
  });

  return {
    userData,
    motos,
    motoClubs,
    eventos,
    loading,
    refetch: fetchUserData,
  };
};
