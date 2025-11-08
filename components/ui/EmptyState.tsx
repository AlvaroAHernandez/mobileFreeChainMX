import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

import { getThemeColors } from "@/constants/theme";

interface Props {
  message: string;
  subtitle?: string;
  icon?: string;
  onRetry?: () => void;
  actionButton?: {
    text: string;
    onPress: () => void;
  };
}

export const EmptyState: React.FC<Props> = ({
  message,
  icon = "alert-circle-outline",
}) => {
  const scheme = useColorScheme() || "dark";
  const Colors = getThemeColors(scheme);

  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <Ionicons name={icon as any} size={36} color={Colors.textMuted} />
      <Text style={{ color: Colors.textSecondary, marginTop: 8 }}>
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;
