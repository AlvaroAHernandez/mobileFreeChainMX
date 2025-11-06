import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGlobalStyles } from "@/constants/globalStyles";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const gs = useGlobalStyles();
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={{ alignItems: "center", paddingHorizontal: 24 }}>
          <ThemedText style={[gs.title, { marginBottom: 8 }]}>
            Bienvenido
          </ThemedText>
          <ThemedText style={[gs.subtitle, { marginBottom: 32 }]}>
            Inicia sesión en tu cuenta
          </ThemedText>

          <View style={[gs.card, { width: "100%", maxWidth: 400 }]}>
            <TextInput
              style={gs.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
            <TextInput
              style={gs.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />

            <TouchableOpacity
              style={[
                gs.primaryButton,
                { marginTop: 12, opacity: loading ? 0.7 : 1 },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                if (loading) return;
                handleLogin();
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={gs.primaryButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            <Text
              style={[gs.textSecondary, { textAlign: "center", marginTop: 16 }]}
            >
              ¿Olvidaste tu contraseña?
            </Text>
            <Text
              style={[gs.textSecondary, { textAlign: "center", marginTop: 12 }]}
            >
              ¿No tienes cuenta?{" "}
              <Text
                style={{ color: "#3B5BFE", textDecorationLine: "underline" }}
                onPress={() => router.push("/screens/auth/register")}
              >
                Regístrate
              </Text>
            </Text>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
