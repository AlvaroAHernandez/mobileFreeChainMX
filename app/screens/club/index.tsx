// app/screens/club/index.tsx
import ScreenLayout from "@/components/ScreenLayout";
import ClubCard from "@/components/clubs/ClubCard";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/EmptyState";
import SearchBar from "@/components/ui/SearchBar";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useRefresh } from "@/hooks/useRefresh";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ClubExploreScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");

  const [searchQuery, setSearchQuery] = useState("");
  const { user, refreshUser } = useAuth(); // 👈 traemos el usuario y el refresco global

  const {
    organizations,
    loading,
    error,
    actionLoading,
    refetch,
    searchOrganizations,
    joinOrganization,
    leaveOrganization,
  } = useOrganizations();

  const { refreshing, onRefresh } = useRefresh(refetch);

  // 👇 cuando el usuario cambia (por crear club, unirse, etc.), actualiza la lista
  useEffect(() => {
    refetch();
  }, [user]); // 🔥 importante: se actualiza al cambiar user.organizations

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchOrganizations(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    searchOrganizations("");
  };

  // Separar clubs por membresía
  const memberClubs = organizations.filter((org) => org.is_member);
  const availableClubs = organizations.filter((org) => !org.is_member);

  return (
    <ScreenLayout title="MOTOCLUBS" onRefresh={onRefresh} refreshing={refreshing}>
      <View style={{ marginBottom: 20 }}>
        <View style={styles.header}>
          <View>
            <ThemedText style={[gs.title, { fontSize: 24, marginBottom: 4 }]}>
              MotoClubs
            </ThemedText>
            <ThemedText style={[gs.textSecondary, { fontSize: 16 }]}>
              Explora y únete a clubs
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors.tint }]}
            onPress={() => router.push("/(tabs)/club/create")}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar clubs por nombre..."
            onClear={handleClearSearch}
          />
        </View>
      </View>

      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {error && !loading && (
        <View style={{ marginTop: 8 }}>
          <EmptyState
            message={error}
            icon="alert-circle-outline"
            onRetry={refetch}
          />
        </View>
      )}

      <View style={styles.clubsContainer}>
        {!loading && memberClubs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color={Colors.primary} />
              <ThemedText style={styles.sectionTitle}>
                Tus Clubs ({memberClubs.length})
              </ThemedText>
            </View>
            {memberClubs.map((organization) => (
              <ClubCard
                key={organization.id}
                organization={organization}
                onPress={() =>
                  router.push(`/screens/club/detail?id=${organization.id}` as any)
                }
                onJoin={joinOrganization}
                onLeave={leaveOrganization}
                actionLoading={actionLoading === organization.id}
              />
            ))}
          </View>
        )}

        {!loading && availableClubs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star-outline" size={20} color={Colors.primary} />
              <ThemedText style={styles.sectionTitle}>
                Clubs Disponibles ({availableClubs.length})
              </ThemedText>
            </View>
            {availableClubs.map((organization) => (
              <ClubCard
                key={organization.id}
                organization={organization}
                onPress={() =>
                  router.push(`/screens/club/detail?id=${organization.id}` as any)
                }
                onJoin={joinOrganization}
                onLeave={leaveOrganization}
                actionLoading={actionLoading === organization.id}
              />
            ))}
          </View>
        )}

        {!loading && organizations.length === 0 && (
          <EmptyState
            message={
              searchQuery
                ? "No se encontraron clubs con ese nombre"
                : "No hay clubs disponibles"
            }
            icon="people-outline"
            onRetry={refetch}
          />
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  clubsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
});