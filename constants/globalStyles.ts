import { StyleSheet, useColorScheme } from 'react-native';
import { FontSizes, getThemeColors, Radius, Spacing } from './theme';

/**
 * Hook para obtener los estilos globales dinámicos*/
export const useGlobalStyles = () => {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  return StyleSheet.create({
    // === CONTENEDORES ===
    screen: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.medium,
      padding: Spacing.lg,
      marginVertical: Spacing.sm,
    },

    // === TEXTOS ===
    title: {
      color: Colors.text,
      fontSize: FontSizes.title,
      fontWeight: '700',
    },
    subtitle: {
      color: Colors.textSecondary,
      fontSize: FontSizes.medium,
      textAlign: 'center',
    },
    textPrimary: {
      color: Colors.text,
    },
    textSecondary: {
      color: Colors.textSecondary,
    },
    textMuted: {
      color: Colors.textMuted,
    },

    // === BOTONES ===
    primaryButton: {
      backgroundColor: Colors.tint,
      borderRadius: Radius.medium,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: Colors.text,
      fontSize: FontSizes.medium,
      fontWeight: '500',
    },
    secondaryButton: {
      backgroundColor: Colors.surface,
      borderColor: Colors.border,
      borderWidth: 1,
      borderRadius: Radius.medium,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: Colors.text,
      fontSize: FontSizes.medium,
    },

    // === INPUTS ===
    input: {
      backgroundColor: Colors.background,
      borderColor: Colors.border,
      borderWidth: 1,
      borderRadius: Radius.medium,
      color: Colors.text,
      fontSize: FontSizes.medium,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.sm,
    },

    // === SECCIONES ===
    sectionTitle: {
      color: Colors.text,
      fontSize: FontSizes.large,
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.lg,
    },

    // === HEADER ===
    header: {
      backgroundColor: Colors.header,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
    },
    headerTitle: {
      color: Colors.text,
      fontSize: FontSizes.medium,
      fontWeight: '600',
    },
  });
};
