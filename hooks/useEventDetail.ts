// hooks/useEventDetail.ts
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useEventDetail(eventId: string) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [attendingLoading, setAttendingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // 🔹 Ahora usa el contexto global

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/events/${eventId}`);

      if (response.data.code === 200 || response.data.message === "ok") {
        const eventData = response.data.data.event;
        setEvent(eventData);

        // 🔹 Verifica asistencia con el usuario del contexto
        if (user) {
          const isAttending = eventData.attendees?.some(
            (attendee: any) => attendee.id === user.id
          );
          setAttending(isAttending);
        } else {
          setAttending(false);
        }
      } else {
        throw new Error(response.data.message || 'Error al cargar el evento');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al cargar el evento';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para confirmar asistencia');
      return;
    }

    try {
      setAttendingLoading(true);

      if (attending) {
        await api.post(`/events/${eventId}/cancel`);
        setAttending(false);
        setEvent((prev: any) => ({
          ...prev,
          attendees: prev.attendees.filter((a: any) => a.id !== user.id),
        }));
        Alert.alert('Éxito', 'Asistencia cancelada');
      } else {
        await api.post(`/events/${eventId}/attend`);
        setAttending(true);
        setEvent((prev: any) => ({
          ...prev,
          attendees: [...(prev?.attendees || []), user],
        }));
        Alert.alert('Éxito', 'Asistencia confirmada');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al actualizar asistencia';
      Alert.alert('Error', errorMessage);
    } finally {
      setAttendingLoading(false);
    }
  };

  // 🔹 Recargar cuando cambia el usuario o el eventId
  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId, user?.id]);

  return {
    event,
    loading,
    attending,
    attendingLoading,
    error,
    refetch: loadEvent,
    toggleAttendance,
  };
}