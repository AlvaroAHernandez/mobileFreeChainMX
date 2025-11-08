// app/screens/events/index.tsx (REDISEÑADO)
import EventCard from "@/components/events/EventCard";
import ScreenLayout from "@/components/ScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/EmptyState";
import SearchBar from "@/components/ui/SearchBar";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useEvents } from "@/hooks/useEvents";
import { useRefresh } from "@/hooks/useRefresh";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function EventsScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");
  const [searchQuery, setSearchQuery] = useState("");

  const { participating, myClubs, general, loading, error, refetch, searchEvents } = useEvents();
  const { refreshing, onRefresh } = useRefresh(refetch);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    searchEvents(q);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    searchEvents("");
  };

  const totalEvents = participating.length + myClubs.length + general.length;

  return (
    <ScreenLayout title="EVENTOS" onRefresh={onRefresh} refreshing={refreshing}>
      {/* Header mejorado */}
      <View style={styles.headerSection}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText style={styles.mainTitle}>Eventos</ThemedText>
            <ThemedText style={styles.subtitle}>
              Encuentra y únete a experiencias únicas
            </ThemedText>
          </View>
          
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: Colors.tint }]}
            onPress={() => router.push("/screens/events/create")}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar eventos por nombre, ubicación..."
            onClear={handleClearSearch}
          />
        </View>

        {/* Contador de eventos */}
        {!loading && totalEvents > 0 && (
          <View style={styles.counter}>
            <ThemedText style={styles.counterText}>
              {totalEvents} evento{totalEvents !== 1 ? 's' : ''} encontrado{totalEvents !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Estados de carga y error */}
      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>Cargando eventos...</ThemedText>
        </View>
      )}

      {error && !loading && (
        <EmptyState message={error} icon="alert-circle-outline" onRetry={refetch} />
      )}

      {/* Lista de eventos */}
      {!loading && totalEvents > 0 && (
        <ScrollView 
          style={styles.eventsContainer}
          showsVerticalScrollIndicator={false}
        >
          {participating.length > 0 && (
            <Section
              title="Tus Próximos Eventos"
              icon="calendar"
              data={participating}
              color={Colors.success}
              badge={`${participating.length}`}
              onPress={(event) => router.push(`/screens/events/detail?id=${event.id}`)}
            />
          )}

          {myClubs.length > 0 && (
            <Section
              title="Eventos de tus Clubs"
              icon="people"
              data={myClubs}
              color={Colors.primary}
              badge={`${myClubs.length}`}
              onPress={(event) => router.push(`/screens/events/detail?id=${event.id}`)}
            />
          )}

          {general.length > 0 && (
            <Section
              title="Eventos Públicos"
              icon="globe-outline"
              data={general}
              color={Colors.tint}
              badge={`${general.length}`}
              onPress={(event) => router.push(`/screens/events/detail?id=${event.id}`)}
            />
          )}
        </ScrollView>
      )}

      {/* Empty State */}
      {!loading && totalEvents === 0 && (
        <EmptyState
          message={
            searchQuery 
              ? "No se encontraron eventos con ese criterio" 
              : "No hay eventos disponibles en este momento"
          }
          subtitle={
            searchQuery 
              ? "Intenta con otros términos de búsqueda" 
              : "Sé el primero en crear un evento"
          }
          icon="calendar-outline"
          onRetry={refetch}
          actionButton={
            !searchQuery ? {
              text: "Crear Evento",
              onPress: () => router.push("/screens/events/create")
            } : undefined
          }
        />
      )}
    </ScreenLayout>
  );
}

function Section({ title, icon, color, badge, data, onPress }: any) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name={icon} size={20} color={color} />
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        </View>
        {badge && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
          </View>
        )}
      </View>
      
      <View style={styles.eventsList}>
        {data.map((event: any) => (
          <EventCard key={event.id} event={event} onPress={() => onPress(event)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    marginBottom: 12,
  },
  counter: {
    alignItems: "center",
  },
  counterText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  eventsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  eventsList: {
    gap: 8,
  },
});