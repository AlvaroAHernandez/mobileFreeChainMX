// app/screens/Home/home.tsx (REDISEÑADO)
import ScreenLayout from "@/components/ScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { CustomButton } from "@/components/ui/CustomButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useHomeData } from "@/hooks/useHomeData";
import { useRefresh } from "@/hooks/useRefresh";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const gs = useGlobalStyles();
  const router = useRouter();
  const Colors = getThemeColors("dark");
  const { userData, motos, motoClubs, loading, refetch } = useHomeData();
  const { refreshing, onRefresh } = useRefresh(refetch);

  // Datos calculados para estadísticas
  const stats = {
    totalMotos: motos.length,
    totalClubs: motoClubs.length,
    upcomingEvents: userData?.events?.filter((event: any) => 
      new Date(event.date) > new Date()
    ).length || 0,
  };

  return (
    <ScreenLayout
      title="FREE CHAIN MX"
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con perfil */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            {userData?.full_profile_photo_url ? (
              <Image 
                source={{ uri: userData.full_profile_photo_url }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profilePlaceholder]}>
                <Ionicons name="person" size={24} color={Colors.textSecondary} />
              </View>
            )}
            <View style={styles.greeting}>
              <ThemedText style={styles.welcomeText}>¡Bienvenido de vuelta!</ThemedText>
              <ThemedText style={styles.userName}>
                {userData?.name || "Motociclista"}
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: Colors.surface }]}
            onPress={() => router.push("/screens/notifications")}
          >
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tarjetas de estadísticas */}
        {!loading && (
          <View style={styles.statsContainer}>
            <StatCard
              icon="bicycle"
              value={stats.totalMotos}
              label="Motos"
              color={Colors.primary}
              onPress={() => router.push("/screens/motorcycle/garage")}
            />
            <StatCard
              icon="people"
              value={stats.totalClubs}
              label="Clubs"
              color={Colors.success}
              onPress={() => router.push("/(tabs)/club")}
            />
            <StatCard
              icon="calendar"
              value={stats.upcomingEvents}
              label="Eventos"
              color={Colors.tint}
              onPress={() => router.push("/(tabs)/events")}
            />
          </View>
        )}

        {/* Acciones rápidas */}
        <View style={styles.quickActions}>
          <CustomButton
            title="Crear Evento"
            icon={<Ionicons name="add-circle-outline" size={16} color="#fff" />}
            onPress={() => router.push("/screens/events/create")}
            variant="primary"
            style={styles.quickActionButton}
            textStyle={styles.quickActionText}
          />
          <CustomButton
            title="Explorar Clubs"
            icon={<Ionicons name="search" size={16} color={Colors.text} />}
            onPress={() => router.push("/(tabs)/club")}
            variant="outlined"
            style={styles.quickActionButton}
            textStyle={[styles.quickActionText, { color: Colors.text }]}
          />
        </View>

        {/* Mis MotoClubs */}
        <View style={styles.section}>
          <SectionHeader
            title="Mis MotoClubs"
            subtitle={`${motoClubs.length} club${motoClubs.length !== 1 ? 'es' : ''} donde ruedas`}
            onPressMore={() => router.push("/(tabs)/club")}
          />
          
          {loading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loading} />
          ) : motoClubs.length === 0 ? (
            <EmptyState 
              message="No eres miembro de ningún motoclub"
              icon="people-outline"
              actionButton={{
                text: "Explorar Clubs",
                onPress: () => router.push("/(tabs)/club")
              }}
            />
          ) : (
            <FlatList
              data={motoClubs.slice(0, 5)} // Mostrar máximo 5
              horizontal
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <ClubCard
                  club={item}
                  onPress={() => router.push(`/screens/club/detail?id=${item.id}`)}
                />
              )}
            />
          )}
        </View>

        {/* Mi Garaje */}
        <View style={styles.section}>
          <SectionHeader
            title="Mi Garaje"
            subtitle={`${motos.length} motocicleta${motos.length !== 1 ? 's' : ''} registrada${motos.length !== 1 ? 's' : ''}`}
            onPressMore={() => router.push("/screens/motorcycle/garage")}
          />

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loading} />
          ) : motos.length === 0 ? (
            <EmptyState
              message="No has registrado ninguna moto"
              icon="bicycle-outline"
              actionButton={{
                text: "Agregar Moto",
                onPress: () => router.push("/screens/motorcycle/AddEditMotoScreen")
              }}
            />
          ) : (
            <FlatList
              data={motos.slice(0, 5)} // Mostrar máximo 5
              horizontal
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <MotorcycleCard
                  motorcycle={item}
                  onPress={() => router.push(`/screens/motorcycle/detail?id=${item.id}`)}
                />
              )}
            />
          )}

          {/* Agregar moto */}
          <CustomButton
            title="Agregar nueva moto"
            icon={<Ionicons name="add-circle-outline" size={18} color="#fff" />}
            onPress={() => router.push("/screens/motorcycle/AddEditMotoScreen")}
            style={styles.addButton}
          />
        </View>

        {/* Próximos Eventos (si tienes datos de eventos) */}
        {userData?.events && userData.events.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Próximos Eventos"
              subtitle="Tus próximas rodadas"
              onPressMore={() => router.push("/(tabs)/events")}
            />
            <EventPreview
              events={userData.events.filter((event: any) => 
                new Date(event.date) > new Date()
              ).slice(0, 3)}
              onPressEvent={(eventId) => router.push(`/screens/events/detail?id=${eventId}`)}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

// Componente de Tarjeta de Estadísticas
function StatCard({ icon, value, label, color, onPress }: any) {
  const Colors = getThemeColors("dark");
  
  return (
    <TouchableOpacity 
      style={[styles.statCard, { backgroundColor: Colors.surface }]}
      onPress={onPress}
    >
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

// Componente de Club (mejorado)
function ClubCard({ club, onPress }: any) {
  const Colors = getThemeColors("dark");
  
  return (
    <TouchableOpacity 
      style={[styles.clubCard, { backgroundColor: Colors.surface }]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: club.logo_url || "https://via.placeholder.com/60" }} 
        style={styles.clubImage}
      />
      <ThemedText style={styles.clubName} numberOfLines={1}>
        {club.name}
      </ThemedText>
      <ThemedText style={styles.clubMembers} numberOfLines={1}>
        {club.users_count} miembro{club.users_count !== 1 ? 's' : ''}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Componente de Motocicleta (mejorado)
function MotorcycleCard({ motorcycle, onPress }: any) {
  const Colors = getThemeColors("dark");
  
  return (
    <TouchableOpacity 
      style={[styles.motoCard, { backgroundColor: Colors.surface }]}
      onPress={onPress}
    >
      <View style={[styles.motoImage, { backgroundColor: Colors.border }]}>
        <Ionicons name="bicycle" size={24} color={Colors.textSecondary} />
      </View>
      <ThemedText style={styles.motoName} numberOfLines={1}>
        {motorcycle.model}
      </ThemedText>
      <ThemedText style={styles.motoBrand} numberOfLines={1}>
        {motorcycle.motorcycle_brand?.name || "Sin marca"}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Componente de Vista Previa de Eventos
function EventPreview({ events, onPressEvent }: any) {
  const Colors = getThemeColors("dark");
  
  if (events.length === 0) return null;
  
  return (
    <View style={styles.eventsPreview}>
      {events.map((event: any) => (
        <TouchableOpacity 
          key={event.id}
          style={[styles.eventPreviewCard, { backgroundColor: Colors.surface }]}
          onPress={() => onPressEvent(event.id)}
        >
          <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          <View style={styles.eventPreviewInfo}>
            <ThemedText style={styles.eventPreviewTitle} numberOfLines={1}>
              {event.name}
            </ThemedText>
            <ThemedText style={styles.eventPreviewDate} numberOfLines={1}>
              {new Date(event.date).toLocaleDateString('es-ES')}
            </ThemedText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profilePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  greeting: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  loading: {
    marginVertical: 20,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  addButton: {
    marginTop: 16,
  },
  clubCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 12,
  },
  clubImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  clubName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  clubMembers: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  motoCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 12,
  },
  motoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  motoName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  motoBrand: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  eventsPreview: {
    gap: 8,
  },
  eventPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  eventPreviewInfo: {
    flex: 1,
  },
  eventPreviewTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  eventPreviewDate: {
    fontSize: 12,
    opacity: 0.7,
  },
});