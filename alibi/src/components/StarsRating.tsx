import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

interface StarsRatingProps {
  stars: number;
}

export const StarsRating = ({ stars }: StarsRatingProps) => (
  <View style={styles.row}>
    {[1, 2, 3].map((star) => (
      <Text key={star} style={[styles.star, star <= stars ? styles.active : styles.inactive]}>
        ★
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  star: {
    fontSize: 20,
    fontWeight: '900',
  },
  active: {
    color: colors.primary,
  },
  inactive: {
    color: colors.line,
  },
});
