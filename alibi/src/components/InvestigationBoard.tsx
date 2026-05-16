import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';
import { CaseData, CaseThreadType } from '../types';
import { Card } from './Card';

interface InvestigationBoardProps {
  caseData: CaseData;
}

const threadMeta: Record<CaseThreadType, { label: string; color: string; icon: string }> = {
  mystery: { label: 'Загадка', color: colors.primary, icon: '?' },
  contradiction: { label: 'Противоречие', color: colors.accent, icon: '!' },
  secret: { label: 'Секрет', color: colors.secondary, icon: '*' },
  connection: { label: 'Связь', color: colors.success, icon: '>' },
  twist: { label: 'Поворот', color: colors.warning, icon: '~' },
};

export const InvestigationBoard = ({ caseData }: InvestigationBoardProps) => (
  <View style={styles.wrap}>
    <Card highlighted>
      <Text style={styles.title}>Доска расследования</Text>
      <Text style={styles.text}>{caseData.storyContext}</Text>
    </Card>

    {caseData.caseThreads.map((thread) => {
      const meta = threadMeta[thread.type];

      return (
        <Card key={thread.id} style={styles.threadCard}>
          <View style={styles.threadHeader}>
            <View style={[styles.icon, { backgroundColor: meta.color }]}>
              <Text style={styles.iconText}>{meta.icon}</Text>
            </View>
            <View style={styles.threadTitleBlock}>
              <Text style={[styles.threadLabel, { color: meta.color }]}>{meta.label}</Text>
              <Text style={styles.threadTitle}>{thread.title}</Text>
            </View>
          </View>
          <Text style={styles.threadText}>{thread.text}</Text>
        </Card>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  threadCard: {
    padding: spacing.md,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '900',
  },
  threadTitleBlock: {
    flex: 1,
  },
  threadLabel: {
    ...typography.caption,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  threadTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '900',
  },
  threadText: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.md,
  },
});
