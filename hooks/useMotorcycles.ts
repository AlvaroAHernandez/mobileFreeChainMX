import api from "@/services/api";
import { getUser } from "@/utils/storage"; // asegúrate de tener esta función disponible
import { useEffect, useState } from "react";

export function useMotorcycles() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      const { data } = await api.get("/motorcycle-brands");
      setBrands(data.data.brands);
    } catch (error) {
      console.log("❌ Error al cargar marcas", error);
    }
  };

  const addMotorcycle = async (moto: any) => {
    setLoading(true);
    try {
      const user = await getUser();
      const formData = new FormData();

      // Mapear campos al formato que espera el backend
      formData.append("user_id", user.id);
      formData.append("motorcycle_brand_id", moto.marca);
      formData.append("model", moto.modelo);
      formData.append("year", moto.anio);
      formData.append("plate_number", moto.matricula);
      formData.append("color", moto.color);

      if (moto.photo) {
        formData.append("image_file", moto.photo as any);
      }

      await api.post("/motorcycles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    } catch (error: any) {
      console.log("❌ Error al guardar moto:", error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMotorcycle = async (id: number, moto: any) => {
    setLoading(true);
    try {
      const user = await getUser();
      const formData = new FormData();

      formData.append("user_id", user.id);
      formData.append("motorcycle_brand_id", moto.marca);
      formData.append("model", moto.modelo);
      formData.append("year", moto.anio);
      formData.append("plate_number", moto.matricula);
      formData.append("color", moto.color);

      if (moto.photo) {
        formData.append("image_file", moto.photo as any);
      }

      await api.post(`/motorcycles/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
    } catch (error: any) {
      console.log("❌ Error al actualizar moto:", error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMotorcycleById = async (id: number) => {
    try {
      const { data } = await api.get(`/motorcycles/${id}`);
      return data.data.motorcycle;
    } catch (error) {
      console.log("❌ Error al obtener moto", error);
      return null;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    addMotorcycle,
    updateMotorcycle,
    getMotorcycleById,
    loading,
  };
}
