import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../theme';
import { CaseData } from '../types';

interface CaseIntroScreenProps {
  caseData: CaseData;
  onBack: () => void;
  onStartInvestigation: () => void;
}

export const CaseIntroScreen = ({ caseData, onBack, onStartInvestigation }: CaseIntroScreenProps) => {
  const crimeLocation = caseData.locations.find((location) => location.id === caseData.crimeLocationId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="← К главам" onPress={onBack} variant="ghost" />

      <View style={styles.header}>
        <Text style={styles.kicker}>Дело</Text>
        <Text style={styles.title}>{caseData.title}</Text>
        <Text style={styles.description}>{caseData.description}</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Сводка преступления</Text>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Время</Text>
          <Text style={styles.factValue}>{caseData.crimeTime}</Text>
        </View>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Место</Text>
          <Text style={styles.factValue}>{crimeLocation?.name}</Text>
        </View>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Подозреваемых</Text>
          <Text style={styles.factValue}>{caseData.suspects.length}</Text>
        </View>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Улик</Text>
          <Text style={styles.factValue}>{caseData.clues.length}</Text>
        </View>
      </Card>

      {caseData.tutorial?.length ? (
        <Card highlighted>
          <Text style={styles.cardTitle}>Короткое обучение</Text>
          {caseData.tutorial.map((line) => (
            <Text key={line} style={styles.tutorialLine}>
              • {line}
            </Text>
          ))}
        </Card>
      ) : null}

      <Button title="Перейти к расследованию" onPress={onStartInvestigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.mutedText,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  factLabel: {
    ...typography.body,
    color: colors.mutedText,
  },
  factValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '900',
    flex: 1,
    textAlign: 'right',
  },
  tutorialLine: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
