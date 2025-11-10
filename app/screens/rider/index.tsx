import { useAuth } from "@/context/AuthContext";
import { useRiders } from "@/hooks/useRiders";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function RidersMap() {
  const { riders, location, startTracking, stopTracking } = useRiders();
  const { user } = useAuth();
  const [showRidersList, setShowRidersList] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    React.useCallback(() => {
      startTracking();
      return () => stopTracking();
    }, [])
  );

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const toggleRidersList = () => {
    const toValue = showRidersList ? 0 : 1;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
    setShowRidersList(!showRidersList);
  };

  const listHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Conectando con otros riders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🗺️ Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {riders.map(
          (r) =>
            r.latitude &&
            r.longitude && (
              <Marker
                key={r.user_id}
                coordinate={{
                  latitude: r.latitude,
                  longitude: r.longitude,
                }}
                title={
                  r.user_id === user?.id ? `${r.user.name} (Tú)` : r.user.name
                }
              >
                {/* Si es el usuario actual, no mostrar imagen */}
                {r.user_id !== user?.id && (
                  <View style={styles.markerContainer}>
                    <View style={styles.markerImageWrapper}>
                      <Image
                        source={{ uri: r.user.profile_photo_path }}
                        style={styles.markerImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                )}
              </Marker>
            )
        )}
      </MapView>

      {/* Header con contador */}
      <View style={styles.header}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#FF6B35" />
          <View style={styles.statTextContainer}>
            <Text style={styles.statValue}>{riders.length}</Text>
            <Text style={styles.statLabel}>Riders activos</Text>
          </View>
        </View>
      </View>

      {/* Botón para centrar ubicación */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerOnUser}
        activeOpacity={0.8}
      >
        <Ionicons name="navigate" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Panel inferior con lista de riders */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.panelHeader}
          onPress={toggleRidersList}
          activeOpacity={0.7}
        >
          <View style={styles.panelHeaderContent}>
            <Ionicons name="people-outline" size={20} color="#333" />
            <Text style={styles.panelTitle}>
              Motociclistas cerca ({riders.length})
            </Text>
          </View>
          <Ionicons
            name={showRidersList ? "chevron-down" : "chevron-up"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        <Animated.View style={[styles.ridersList, { height: listHeight }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {riders.map((rider) => (
              <View key={rider.user_id} style={styles.riderItem}>
                <Image
                  source={{ uri: rider.user.profile_photo_path }}
                  style={styles.riderPhoto}
                  resizeMode="cover"
                />
                <View style={styles.riderInfo}>
                  <Text style={styles.riderName}>{rider.user.name}</Text>
                  <Text style={styles.riderStatus}>En línea</Text>
                </View>

                {/* Mostrar “Tú” si es el usuario actual */}
                {rider.user_id === user?.id ? (
                  <Text style={styles.youTag}>Tú</Text>
                ) : (
                  <View style={styles.statusDot} />
                )}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#666" },
  header: { position: "absolute", top: 50, left: 16, right: 16 },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statTextContainer: { flex: 1 },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#333" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 2 },
  centerButton: {
    position: "absolute",
    right: 16,
    bottom: 280,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  markerContainer: {
    width: 46,
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 23,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  markerImageWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  markerImage: { width: "100%", height: "100%" },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  panelHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  panelTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  ridersList: { overflow: "hidden" },
  riderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  riderPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  riderInfo: { flex: 1, marginLeft: 12 },
  riderName: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 2 },
  riderStatus: { fontSize: 13, color: "#4ECDC4" },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ECDC4",
  },
  youTag: {
    backgroundColor: "#ddd",
    color: "#333",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: "600",
  },
});
