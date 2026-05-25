import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({ title, onPress, variant = 'primary', disabled, icon, style }: ButtonProps) => (
  <TouchableOpacity
    activeOpacity={0.82}
    disabled={disabled}
    onPress={onPress}
    style={[styles.base, styles[variant], disabled && styles.disabled, style]}
  >
    {icon}
    <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceLight,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.48,
  },
  text: {
    ...typography.body,
    color: colors.background,
    fontWeight: '800',
  },
  ghostText: {
    color: colors.text,
  },
});
