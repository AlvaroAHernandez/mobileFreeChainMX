import { ThemedText } from '@/components/themed-text';
import { getThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const SectionHeader = ({ title, subtitle, onPressMore }: any) => {
  const Colors = getThemeColors('dark');

  return (
    <View style={styles.header}>
      <View>
        <ThemedText style={[styles.title, { color: Colors.text }]}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={[styles.subtitle, { color: Colors.textSecondary }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>

      {onPressMore && (
        <TouchableOpacity
          onPress={onPressMore}
          style={[
            styles.moreButton,
            { backgroundColor: Colors.primary, borderColor: Colors.primary },
          ]}
        >
          <Ionicons name="arrow-forward" size={14} color="#fff" />
          <ThemedText style={[styles.moreText, { color: '#fff' }]}>Ver más</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  moreText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
