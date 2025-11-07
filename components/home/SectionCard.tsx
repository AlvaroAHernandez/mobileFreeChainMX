import { getThemeColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SectionCard({ children, style }: any) {
  const Colors = getThemeColors('dark');

  return (
    <View
      style={[
        styles.container,
        { borderColor: Colors.border, backgroundColor: 'transparent' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
});
