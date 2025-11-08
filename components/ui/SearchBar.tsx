// components/ui/SearchBar.tsx
import { getThemeColors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Buscar...",
  onClear 
}: SearchBarProps) {
  const Colors = getThemeColors('dark');

  return (
    <View style={[styles.container, { backgroundColor: Colors.surface }]}>
      <Ionicons name="search" size={20} color={Colors.textSecondary} />
      <TextInput
        style={[styles.input, { color: Colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
});