// app/screens/events/detail.tsx
import ScreenLayout from "@/components/ScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useEventDetail } from "@/hooks/useEventDetail";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");
  const { user } = useAuth();
  
  const {
    event,
    loading,
    attending,
    attendingLoading,
    error,
    refetch,
    toggleAttendance,
  } = useEventDetail(id as string);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <ScreenLayout title="DETALLE DEL EVENTO">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.tint} />
          <ThemedText style={styles.loadingText}>Cargando evento...</ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  if (error || !event) {
    return (
      <ScreenLayout title="DETALLE DEL EVENTO">
        <EmptyState
          message={error || "Evento no encontrado"}
          icon="calendar-outline"
          onRetry={refetch}
          actionButton={{
            text: "Volver a Eventos",
            onPress: () => router.back(),
          }}
        />
      </ScreenLayout>
    );
  }

  const { date: formattedDate, time: formattedTime } = formatDate(event.date);
  const attendeesCount = event.attendees?.length || 0;

  return (
    <ScreenLayout title="DETALLE DEL EVENTO">
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con imagen y título */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.eventHeader}>
              <ThemedText style={styles.eventTitle}>{event.name}</ThemedText>
              <View style={styles.organizationBadge}>
                <Ionicons name="business" size={16} color={Colors.tint} />
                <ThemedText style={styles.organizationName}>
                  {event.organization?.name}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Información principal */}
        <ThemedView style={styles.content}>
          {/* Fecha y Hora */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="calendar" size={24} color={Colors.tint} />
              <ThemedText style={styles.infoTitle}>Fecha y Hora</ThemedText>
            </View>
            <ThemedText style={styles.infoText}>{formattedDate}</ThemedText>
            <ThemedText style={styles.infoSubtext}>{formattedTime}</ThemedText>
          </View>

          {/* Ubicación */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="location" size={24} color={Colors.tint} />
              <ThemedText style={styles.infoTitle}>Ubicación</ThemedText>
            </View>
            <ThemedText style={styles.infoText}>{event.location}</ThemedText>
          </View>

          {/* Descripción */}
          {event.description && (
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="document-text" size={24} color={Colors.tint} />
                <ThemedText style={styles.infoTitle}>Descripción</ThemedText>
              </View>
              <ThemedText style={styles.descriptionText}>
                {event.description}
              </ThemedText>
            </View>
          )}

          {/* Botón de asistencia */}
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              { 
                backgroundColor: attending ? Colors.danger : Colors.tint,
                opacity: attendingLoading ? 0.7 : 1
              }
            ]}
            onPress={toggleAttendance}
            disabled={attendingLoading}
          >
            {attendingLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons 
                  name={attending ? "close-circle" : "checkmark-circle"} 
                  size={20} 
                  color="#fff" 
                />
                <ThemedText style={styles.attendanceButtonText}>
                  {attending ? "Cancelar Asistencia" : "Confirmar Asistencia"}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          {/* Lista de asistentes */}
          <View style={styles.attendeesSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Asistentes ({attendeesCount})
              </ThemedText>
              <View style={styles.attendeesCount}>
                <Ionicons name="people" size={16} color={Colors.text} />
                <ThemedText style={styles.attendeesCountText}>
                  {attendeesCount}
                </ThemedText>
              </View>
            </View>

            {attendeesCount > 0 ? (
              <View style={styles.attendeesList}>
                {event.attendees.map((attendee: any, index: number) => (
                  <View key={attendee.id} style={styles.attendeeCard}>
                    <View style={styles.attendeeInfo}>
                      <View style={styles.avatar}>
                        {attendee.profile_photo_path ? (
                          <Image 
                            source={{ uri: attendee.full_profile_photo_url }} 
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Ionicons name="person" size={20} color={Colors.text} />
                        )}
                      </View>
                      <View style={styles.attendeeDetails}>
                        <ThemedText style={styles.attendeeName}>
                          {attendee.name} {attendee.lastname}
                        </ThemedText>
                        <ThemedText style={styles.attendeeEmail}>
                          {attendee.email}
                        </ThemedText>
                      </View>
                    </View>
                    
                    {/* Indicador si es el usuario actual */}
                    {user?.id === attendee.id && (
                      <View style={styles.currentUserBadge}>
                        <ThemedText style={styles.currentUserBadgeText}>
                          Tú
                        </ThemedText>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noAttendees}>
                <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
                <ThemedText style={styles.noAttendeesText}>
                  Aún no hay asistentes
                </ThemedText>
                <ThemedText style={styles.noAttendeesSubtext}>
                  Sé el primero en confirmar asistencia
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedView>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  header: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventHeader: {
    gap: 8,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  organizationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  organizationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    padding: 16,
    gap: 16,
    marginTop: -10,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  attendanceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  attendanceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  attendeesSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  attendeesCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  attendeesCountText: {
    fontSize: 14,
    fontWeight: "600",
  },
  attendeesList: {
    gap: 8,
  },
  attendeeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  attendeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  attendeeDetails: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  attendeeEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  currentUserBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentUserBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: '#8B5CF6',
  },
  noAttendees: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  noAttendeesText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  noAttendeesSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});