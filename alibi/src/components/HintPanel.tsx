import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { hintLevelLabels } from '../utils/format';
import { Button } from './Button';
import { Card } from './Card';

interface HintPanelProps {
  caseData: CaseData;
  revealedCount: number;
  hintsAvailable: number;
  onUseHint: () => void;
  onWatchAd: () => void;
}

export const HintPanel = ({ caseData, revealedCount, hintsAvailable, onUseHint, onWatchAd }: HintPanelProps) => (
  <Card>
    <Text style={styles.title}>Подсказки</Text>
    <Text style={styles.text}>Доступно подсказок: {hintsAvailable}</Text>

    <View style={styles.hints}>
      {caseData.hints.slice(0, revealedCount).map((hint) => (
        <View key={hint.id} style={styles.hint}>
          <Text style={styles.hintLevel}>{hintLevelLabels[hint.level]}</Text>
          <Text style={styles.hintText}>{hint.text}</Text>
        </View>
      ))}
    </View>

    {revealedCount < caseData.hints.length ? (
      <Button
        title={hintsAvailable > 0 ? 'Использовать подсказку' : 'Нет подсказок'}
        onPress={onUseHint}
        disabled={hintsAvailable <= 0}
        variant="secondary"
      />
    ) : (
      <Text style={styles.allHints}>Все подсказки этого дела открыты.</Text>
    )}

    {hintsAvailable <= 0 ? (
      <Button title="Посмотреть рекламу (+1)" onPress={onWatchAd} variant="ghost" style={styles.adButton} />
    ) : null}
  </Card>
);

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.text,
  },
  text: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  hints: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  hint: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
  hintLevel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
  },
  hintText: {
    ...typography.body,
    color: colors.text,
  },
  allHints: {
    ...typography.body,
    color: colors.success,
    fontWeight: '800',
  },
  adButton: {
    marginTop: spacing.sm,
  },
});
