import HorizontalListCard from "@/components/home/HorizontalListCard";
import SectionCard from "@/components/home/SectionCard";
import ScreenLayout from "@/components/ScreenLayout";
import { ThemedText } from "@/components/themed-text";
import { CustomButton } from "@/components/ui/CustomButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useGlobalStyles } from "@/constants/globalStyles";
import { getThemeColors } from "@/constants/theme";
import { useHomeData } from "@/hooks/useHomeData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function HomeScreen() {
  const gs = useGlobalStyles();
  const router = useRouter();
  const Colors = getThemeColors("dark");
  const { userData, motos, motoClubs, loading } = useHomeData();

  return (
    <ScreenLayout title="FREE CHAIN MX">
      {/* Saludo */}
      <View style={{ marginTop: 6, marginBottom: 4 }}>
        <ThemedText
          style={[gs.textPrimary, { fontSize: 20, fontWeight: "600" }]}
        >
          Hola, {userData?.name || "Motociclista"}
        </ThemedText>
        <ThemedText style={gs.textSecondary}>Bienvenido de vuelta</ThemedText>
      </View>

      {/* Mis MotoClubs */}
      <SectionCard>
        <SectionHeader
          title="Mis MotoClubs"
          subtitle="Los clubes donde ruedas"
          onPressMore={() => router.push("/club/explore")}
        />
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : motoClubs.length === 0 ? (
          <EmptyState message="No eres miembro de ningún motoclub" />
        ) : (
          <FlatList
            data={motoClubs}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <HorizontalListCard
                item={item}
                type="club"
                onPress={() =>
                  router.push(`/screens/club/detail?id=${item.id}`)
                }
              />
            )}
          />
        )}
      </SectionCard>

      {/* Mi Garaje */}
      <SectionCard>
        <SectionHeader
          title="Mi Garaje"
          subtitle="Tus motocicletas registradas"
          onPressMore={() => router.push("/screens/motorcycle/garage")}
        />

        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : motos.length === 0 ? (
          <EmptyState
            message="No has registrado ninguna moto"
            icon="bicycle-outline"
          />
        ) : (
          <FlatList
            data={motos}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <HorizontalListCard
                item={item}
                type="moto"
                onPress={() =>
                  router.push(`/screens/motorcycle/detail?id=${item.id}`)
                }
              />
            )}
          />
        )}

        {/* Agregar moto */}
        <CustomButton
          title="Agregar nueva moto"
          icon={<Ionicons name="add-circle-outline" size={20} color="#fff" />}
          onPress={() => router.push("/screens/motorcycle/AddEditMotoScreen")}
          style={{ marginTop: 16 }}
        />
      </SectionCard>

      <View style={{ height: 60 }} />
    </ScreenLayout>
  );
}
