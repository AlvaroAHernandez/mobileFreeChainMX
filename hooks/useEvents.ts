// hooks/useEvents.ts
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  date: string;
  organization: {
    id: number;
    name: string;
    logo_url?: string;
  };
  attendees?: any[];
  is_attending?: boolean;
}

export const useEvents = () => {
  const [participating, setParticipating] = useState<Event[]>([]);
  const [myClubs, setMyClubs] = useState<Event[]>([]);
  const [general, setGeneral] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = "/events";
      if (search && search.trim())
        url += `?search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      const data = res.data.data;

      const markAsAttending = (events: Event[], attending = false) =>
        (events || []).map((e) => ({ ...e, is_attending: attending }));

      setParticipating(markAsAttending(data.participating, true));
      setMyClubs(markAsAttending(data.my_clubs, false));
      setGeneral(markAsAttending(data.general, false));
    } catch (err: any) {
      console.error("❌ Error fetching events:", err);
      setError(err.response?.data?.message || "Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  const confirmAttendance = async (eventId: number) => {
    try {
      await api.post(`/events/${eventId}/attend`);
      await fetchEvents(); // refresca para reflejar cambios
    } catch (err: any) {
      console.error("❌ Error confirmando asistencia:", err);
    }
  };

  const cancelAttendance = async (eventId: number) => {
    try {
      await api.post(`/events/${eventId}/cancel`);
      await fetchEvents();
    } catch (err: any) {
      console.error("❌ Error cancelando asistencia:", err);
    }
  };

  return {
    participating,
    myClubs,
    general,
    loading,
    error,
    refetch: fetchEvents,
    searchEvents: fetchEvents,
    confirmAttendance,
    cancelAttendance,
  };
};
