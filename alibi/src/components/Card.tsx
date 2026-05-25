import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { borderRadius, colors, shadows, spacing } from '../theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  highlighted?: boolean;
}

export const Card = ({ children, style, highlighted }: CardProps) => (
  <View style={[styles.card, highlighted && styles.highlighted, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  highlighted: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
});
