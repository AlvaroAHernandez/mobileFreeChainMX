import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useMotorcycles } from "@/hooks/useMotorcycles";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function AddEditMotoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const gs = useGlobalStyles();
  const scheme = useColorScheme() || "dark";
  const Colors = getThemeColors(scheme);
  const { addMotorcycle, updateMotorcycle, getMotorcycleById, brands, loading } =
    useMotorcycles();

  const [moto, setMoto] = useState<any>({
    marca: "",
    modelo: "",
    anio: "",
    matricula: "",
    color: "",
    photo: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadMotorcycle();
  }, [id]);

  const loadMotorcycle = async () => {
    const data = await getMotorcycleById(Number(id));
    if (data) {
      setMoto({
        marca: data.brand_id?.toString(),
        modelo: data.model,
        anio: data.year,
        matricula: data.plate,
        color: data.color,
        photo: null,
      });
      setPreview(data.photo_url || null);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPreview(result.assets[0].uri);
      setMoto({
        ...moto,
        photo: {
          uri: result.assets[0].uri,
          name: "photo.jpg",
          type: "image/jpeg",
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!moto.marca || !moto.modelo || !moto.anio || !moto.matricula) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos obligatorios.");
      return;
    }

    try {
      if (id) {
        await updateMotorcycle(Number(id), moto);
        Alert.alert("Éxito", "Motocicleta actualizada correctamente.");
      } else {
        await addMotorcycle(moto);
        Alert.alert("Éxito", "Motocicleta agregada correctamente.");
      }
      router.push("/screens/motorcycle/garage");
    } catch {
      Alert.alert("Error", "No se pudo guardar la motocicleta.");
    }
  };

  return (
    <ThemedView style={[gs.screen, { flex: 1 }]}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
            <Ionicons name="chevron-back" size={28} color={Colors.text} />
          </TouchableOpacity>
          <ThemedText style={[gs.headerTitle, { fontSize: 22 }]}>
            {id ? "Editar Motocicleta" : "Agregar Motocicleta"}
          </ThemedText>
        </View>

        {/* Form Card */}
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {/* Campos */}
          <View style={{ marginBottom: 14 }}>
            <Text style={[gs.textSecondary, { marginBottom: 6, fontWeight: "600" }]}>Marca</Text>
            <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 10 }}>
              <Picker
                selectedValue={moto.marca}
                onValueChange={(itemValue) => setMoto({ ...moto, marca: itemValue })}
                style={{ color: Colors.text, backgroundColor: Colors.inputBackground }}
              >
                <Picker.Item label="Seleccionar marca..." value="" />
                {brands.map((brand) => (
                  <Picker.Item key={brand.id} label={brand.name} value={brand.id.toString()} />
                ))}
              </Picker>
            </View>
          </View>

          {["modelo", "anio", "matricula", "color"].map((field) => (
            <View key={field} style={{ marginBottom: 14 }}>
              <Text style={[gs.textSecondary, { marginBottom: 6, fontWeight: "600" }]}>
                {field === "anio" ? "Año" : field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <TextInput
                value={moto[field]}
                onChangeText={(text) => setMoto({ ...moto, [field]: text })}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.border,
                  borderRadius: 10,
                  padding: 12,
                  backgroundColor: Colors.inputBackground,
                  color: Colors.text,
                }}
                placeholder={`Ingrese ${field}`}
                placeholderTextColor={Colors.textMuted}
                keyboardType={field === "anio" ? "numeric" : "default"}
              />
            </View>
          ))}

          {/* Imagen al final */}
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginTop: 14,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 12,
              padding: 10,
              backgroundColor: Colors.inputBackground,
            }}
            onPress={pickImage}
          >
            {preview ? (
              <Image source={{ uri: preview }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            ) : (
              <Ionicons name="camera-outline" size={50} color={Colors.textMuted} />
            )}
            <Text style={{ color: Colors.textMuted, marginTop: 8 }}>
              {preview ? "Cambiar foto" : "Agregar foto"}
            </Text>
          </TouchableOpacity>

          {/* Botón */}
          <TouchableOpacity
            style={[
              gs.primaryButton,
              {
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={[gs.primaryButtonText, { color: "#fff" }]}>
              {loading ? "Guardando..." : id ? "Actualizar Motocicleta" : "Guardar Motocicleta"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
