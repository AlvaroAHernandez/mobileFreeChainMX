// components/events/EventCard.tsx (REDISEÑADO)
import { ThemedText } from "@/components/themed-text";
import { getThemeColors, Radius } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function EventCard({ event, onPress }: any) {
  const Colors = getThemeColors("dark");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      weekday: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const dateInfo = event.date ? formatDate(event.date) : null;

  return (
    <Pressable 
      onPress={onPress} 
      style={[styles.card, { backgroundColor: Colors.surface }]}
    >
      {/* Fecha destacada */}
      {dateInfo && (
        <View style={[styles.dateBadge, { backgroundColor: Colors.tint }]}>
          <ThemedText style={styles.dateDay}>{dateInfo.day}</ThemedText>
          <ThemedText style={styles.dateMonth}>{dateInfo.month}</ThemedText>
        </View>
      )}

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {event.name}
          </ThemedText>
          {event.is_participating && (
            <View style={[styles.participatingBadge, { backgroundColor: Colors.success }]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
              <ThemedText style={styles.participatingText}>Inscrito</ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={styles.description} numberOfLines={2}>
          {event.description || "Evento de motociclismo"}
        </ThemedText>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {/* Organizador */}
            <View style={styles.organizer}>
              <Image
                source={{ uri: event.organization?.logo_url || "https://via.placeholder.com/20" }}
                style={styles.orgLogo}
              />
              <ThemedText style={styles.orgName} numberOfLines={1}>
                {event.organization?.name || "Club"}
              </ThemedText>
            </View>

            {/* Ubicación */}
            {event.location && (
              <View style={styles.location}>
                <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                <ThemedText style={styles.locationText} numberOfLines={1}>
                  {event.location}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Info adicional */}
          <View style={styles.footerRight}>
            {dateInfo && (
              <View style={styles.time}>
                <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                <ThemedText style={styles.timeText}>{dateInfo.time}</ThemedText>
              </View>
            )}
            
            {event.participants_count !== undefined && (
              <View style={styles.participants}>
                <Ionicons name="people-outline" size={12} color={Colors.textSecondary} />
                <ThemedText style={styles.participantsText}>
                  {event.participants_count}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: Radius.large,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateBadge: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: Radius.medium,
    padding: 4,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 20,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  participatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  participatingText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    flex: 1,
    gap: 6,
  },
  footerRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  organizer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orgLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  orgName: {
    fontSize: 12,
    opacity: 0.8,
    flex: 1,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    opacity: 0.7,
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    opacity: 0.7,
  },
  participants: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  participantsText: {
    fontSize: 11,
    opacity: 0.7,
  },
});