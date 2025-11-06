import { useRiders } from "@/hooks/useRiders";
import { useFocusEffect } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function RidersMap() {
  const { riders, location, currentUserId, startTracking, stopTracking } =
    useRiders();

  // Arranca y detiene tracking cuando la pantalla gana/perde el foco
  useFocusEffect(
    React.useCallback(() => {
      startTracking();
      return () => stopTracking();
    }, [])
  );

  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
    >
      {riders.map((r) =>
        r.user_id !== currentUserId && r.latitude && r.longitude ? (
          <Marker
            key={r.user_id}
            coordinate={{ latitude: r.latitude, longitude: r.longitude }}
            title={r.user.name}
          >
            <Image
              source={r.user.profile_photo_path}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 0,
              }}
            />
          </Marker>
        ) : null
      )}
    </MapView>
  );
}
