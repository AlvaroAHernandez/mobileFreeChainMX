import React from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle, useColorScheme } from 'react-native';

import { getThemeColors } from '@/constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outlined' | 'text';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
}) => {
  const scheme = useColorScheme() || 'dark';
  const Colors = getThemeColors(scheme);

  const backgroundColor =
    variant === 'primary' ? Colors.primary : variant === 'outlined' ? 'transparent' : 'transparent';

  const border =
    variant === 'outlined' ? { borderColor: Colors.text, borderWidth: 1 } : undefined;

  const textColor =
    variant === 'primary' ? '#fff' : variant === 'outlined' ? Colors.text : Colors.textMuted;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 18,
          backgroundColor,
        },
        border,
        style,
      ]}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      <Text style={[{ color: textColor, fontWeight: '600' }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
