import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
  const Colors = getThemeColors("dark");
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      router.replace("/(tabs)"); // ir a home
    } catch (error: any) {
      console.log("❌ Error login:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={gs.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          {/* Logo y Header */}
          <View style={styles.header}>
            <Image 
              source={require("@/assets/images/1.jpg")} 
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText style={styles.title}>
              Bienvenido
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Inicia sesión en tu cuenta
            </ThemedText>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <View style={[gs.card, styles.formCard]}>
              <TextInput
                style={[gs.input, styles.input]}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
              <TextInput
                style={[gs.input, styles.input]}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { opacity: loading ? 0.7 : 1 },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  if (loading) return;
                  handleLogin();
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                )}
              </TouchableOpacity>

              {/* Enlaces adicionales */}
              <View style={styles.linksContainer}>
                <TouchableOpacity style={styles.linkItem}>
                  <Text style={styles.linkText}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.registerLink}>
                  <Text style={styles.registerText}>
                    ¿No tienes cuenta?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/screens/auth/register")}>
                    <Text style={styles.registerLinkText}>
                      Regístrate
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  formCard: {
    width: "100%",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#3B5BFE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#3B5BFE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linksContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  linkItem: {
    marginBottom: 16,
  },
  linkText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  registerLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLinkText: {
    color: "#3B5BFE",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});