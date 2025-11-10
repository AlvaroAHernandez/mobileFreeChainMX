import api from "@/services/api";
import { getUser } from "@/utils/storage";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export interface Rider {
  user_id: number;
  latitude: number;
  longitude: number;
  user: {
    id: number;
    name: string;
    lastname?: string;
    profile_photo_path: string;
  };
}

// Calcula distancia entre dos coordenadas en metros
const distanceBetween = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371000; // metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getAvatarUrl = (user: any): string => {
  // Si existe la URL completa de la foto, úsala
  if (user.full_profile_photo_url) {
    return user.full_profile_photo_url;
  }
  
  // Fallback: genera un avatar con las iniciales
  const fullName = `${user.name || ''} ${user.lastname || ''}`.trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FF6B35&color=fff&bold=true&size=128`;
};

export const useRiders = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user) setCurrentUserId(user.id);
    })();
  }, []);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso de ubicación denegado");
      return;
    }

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000, // cada 2s
        distanceInterval: 2, // solo si te mueves >2 metros
      },
      async (loc) => {
        const { latitude, longitude } = loc.coords;

        // Filtro para evitar rebotes pequeños (<3m)
        const prevLocation = location;
        if (!prevLocation || distanceBetween(prevLocation.latitude, prevLocation.longitude, latitude, longitude) > 3) {
          setLocation({ latitude, longitude });

          try {
            // Actualizar backend solo si hay movimiento real
            await api.post("/location/update", { latitude, longitude });

            // Traer otros riders
            const res = await api.get("/location/all");
            
            const ridersWithImages: Rider[] = res.data
              .filter((r: any) => r.user && r.user.id !== currentUserId)
              .map((r: any) => ({
                user_id: r.user.id,
                latitude: Number(r.latitude),
                longitude: Number(r.longitude),
                user: {
                  id: r.user.id,
                  name: r.user.name,
                  lastname: r.user.lastname,
                  profile_photo_path: getAvatarUrl(r.user), // 🔥 Usa la URL real o genera avatar
                },
              }));

            setRiders(ridersWithImages);
          } catch (err) {
            console.log("Error actualizando/fetching riders:", err);
          }
        }
      }
    );
  };

  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;
    setRiders([]);
  };

  useEffect(() => () => stopTracking(), []);

  return { riders, location, currentUserId, startTracking, stopTracking };
};