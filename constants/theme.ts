/**
 * Combina modo claro/oscuro + tipografía por plataforma + escalas reutilizables
 */

import { Platform } from 'react-native';

// ===== Colores principales =====
const primaryBlue = '#3B5BFE';
const darkBackground = '#000';
const darkSurface = '#11192E';
const lightBackground = '#fff';
const lightSurface = '#F4F4F6';

// ===== Tema dinámico =====
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#444',
    textMuted: '#666',
    background: lightBackground,
    surface: lightSurface,
    tint: primaryBlue,
    border: primaryBlue,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryBlue,
    header: '#E5E7EB',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#ccc',
    textMuted: '#999',
    background: darkBackground,
    surface: darkSurface,
    tint: primaryBlue,
    border: primaryBlue,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    header: '#0B1736',
  },
};

// ===== Tipografías =====
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ===== Escalas globales =====
export const FontSizes = {
  xsmall: 12,
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 22,
  title: 28,
};

export const Radius = {
  small: 6,
  medium: 8,
  large: 10,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
};

// ===== Helpers para usar colores según tema actual =====
export const getThemeColors = (scheme: 'light' | 'dark' = 'dark') => Colors[scheme];
