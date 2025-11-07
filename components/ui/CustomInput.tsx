import React from 'react';
import { Text, TextInput, useColorScheme, View } from 'react-native';

import { getThemeColors } from '@/constants/theme';

interface Props {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

export const CustomInput: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
}) => {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: Colors.textSecondary, marginBottom: 6, fontWeight: '600' }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 10,
          padding: 12,
          backgroundColor: Colors.inputBackground,
          color: Colors.text,
        }}
      />
    </View>
  );
};

export default CustomInput;
