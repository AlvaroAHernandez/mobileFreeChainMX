import { ThemedText } from "@/components/themed-text";
import { getThemeColors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function HorizontalListCard({ item, onPress, type }: any) {
  const Colors = getThemeColors("dark");
  const isClub = type === "club";

  const imageUri = isClub
    ? item.logo_url || item.logo || item.photo_url 
    : item.image_url || item.logo || item.photo_url;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: Colors.surface,
          shadowColor: Colors.primary,
        },
      ]}
      onPress={onPress}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: Colors.border }]} />
      )}

      <ThemedText
        style={[styles.title, { color: Colors.text }]}
        numberOfLines={1}
      >
        {item.name || item.model}
      </ThemedText>

      <ThemedText
        style={[styles.subtitle, { color: Colors.textSecondary }]}
        numberOfLines={1}
      >
        {isClub
          ? `${item.users_count} miembro${item.users_count !== 1 ? "s" : ""}`
          : item.motorcycle_brand?.name || "Sin marca"}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    borderRadius: 14,
    alignItems: "center",
    padding: 10,
    marginRight: 12,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
  },
});
