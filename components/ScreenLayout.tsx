import { getThemeColors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "./Header";
import { ThemedView } from "./themed-view";

interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function ScreenLayout({ children, title }: ScreenLayoutProps) {
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false); // loader mientras cierra sesión
  const Colors = getThemeColors("dark");
  const router = useRouter();

  const handleLogout = async () => {
    setMenuVisible(false);
    setLoading(true);
    try {
      await logout();
      setLoading(false);
      Alert.alert("Éxito", "Sesión cerrada correctamente"); // mensaje de éxito
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "No se pudo cerrar sesión"); // mensaje de error
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header
        title={title}
        onProfilePress={() => router.push("/screens/profile/profile")} // <--- aquí redirige
        onNotificationsPress={() => console.log("Notificaciones")}
        onMenuPress={() => setMenuVisible(true)}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {children}
      </ScrollView>

      {/* === Modal menú === */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View
            style={[styles.menuContainer, { backgroundColor: Colors.surface }]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, { color: Colors.text }]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => console.log("Otra acción")}
            >
              <Text style={[styles.menuText, { color: Colors.text }]}>
                Otra acción
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Loader de logout */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          <View
            style={[
              styles.loaderContainer,
              { backgroundColor: Colors.surface },
            ]}
          >
            <ActivityIndicator size="large" color={Colors.tint} />
            <Text style={{ color: Colors.text, marginTop: 10 }}>
              Cerrando sesión...
            </Text>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 20,
    borderRadius: 12,
    paddingVertical: 10,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuText: { fontSize: 16, fontWeight: "500" },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
