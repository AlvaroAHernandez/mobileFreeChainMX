// components/AuthScreenLayout.tsx
import { getThemeColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface AuthScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function AuthScreenLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
}: AuthScreenLayoutProps) {
  const Colors = getThemeColors("dark");
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Header simple con botón de volver */}
      {showBackButton && (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título y subtítulo */}
        {(title || subtitle) && (
          <View style={styles.titleSection}>
            {title && (
              <ThemedText style={styles.title}>
                {title}
              </ThemedText>
            )}
            {subtitle && (
              <ThemedText style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            )}
          </View>
        )}

        {/* Contenido */}
        {children}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
});