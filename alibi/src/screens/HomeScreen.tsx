import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { campaignPremise } from '../data/cases';
import { colors, spacing, typography } from '../theme';

interface HomeScreenProps {
  hintsAvailable: number;
  onPlay: () => void;
  onChapters: () => void;
  onSettings: () => void;
  onShop: () => void;
}

export const HomeScreen = ({ hintsAvailable, onPlay, onChapters, onSettings, onShop }: HomeScreenProps) => (
  <View style={styles.container}>
    <View style={styles.hero}>
      <Text style={styles.badge}>cozy mystery</Text>
      <Text style={styles.title}>Алиби</Text>
      <Text style={styles.subtitle}>Одна большая детективная история о фиолетовых приглашениях, минутах, маршрутах и слишком удобных алиби.</Text>
    </View>

    <Card style={styles.detectiveCard}>
      <Text style={styles.detective}>🕵️‍♀️</Text>
      <View style={styles.caseNote}>
        <Text style={styles.caseNoteTitle}>Приглашение на убийство</Text>
        <Text style={styles.caseNoteText}>{campaignPremise}</Text>
      </View>
    </Card>

    <View style={styles.buttons}>
      <Button title="Играть" onPress={onPlay} />
      <Button title="Главы" onPress={onChapters} variant="secondary" />
      <Button title={`Подсказки (${hintsAvailable})`} onPress={onShop} variant="ghost" />
      <Button title="Настройки" onPress={onSettings} variant="ghost" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
  },
  hero: {
    gap: spacing.sm,
  },
  badge: {
    ...typography.caption,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 58,
    lineHeight: 64,
  },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
  },
  detectiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  detective: {
    fontSize: 64,
  },
  caseNote: {
    flex: 1,
  },
  caseNoteTitle: {
    ...typography.h2,
    color: colors.text,
  },
  caseNoteText: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
  buttons: {
    gap: spacing.md,
  },
});
