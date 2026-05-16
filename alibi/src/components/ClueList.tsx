import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { Card } from './Card';

interface ClueListProps {
  caseData: CaseData;
}

const categoryLabels = {
  camera: 'Камера',
  witness: 'Свидетель',
  receipt: 'Чек',
  call: 'Звонок',
  message: 'Сообщение',
  transport: 'Транспорт',
  item: 'Предмет',
  falseLead: 'Ложный след',
};

export const ClueList = ({ caseData }: ClueListProps) => (
  <View style={styles.wrap}>
    {caseData.clues.map((clue) => (
      <Card key={clue.id} highlighted={clue.category === 'falseLead'}>
        <View style={styles.header}>
          <Text style={styles.badge}>{categoryLabels[clue.category]}</Text>
          {clue.relatedSuspectIds?.length ? (
            <Text style={styles.related}>
              {clue.relatedSuspectIds
                .map((suspectId) => caseData.suspects.find((suspect) => suspect.id === suspectId)?.name)
                .filter(Boolean)
                .join(', ')}
            </Text>
          ) : null}
        </View>
        <Text style={styles.title}>{clue.title}</Text>
        <Text style={styles.text}>{clue.text}</Text>
      </Card>
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '900',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
  },
  related: {
    ...typography.caption,
    color: colors.mutedText,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
