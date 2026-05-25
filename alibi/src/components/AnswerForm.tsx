import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getCharacterPortrait } from '../data/characterPortraits';
import { borderRadius, colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { Button } from './Button';
import { Card } from './Card';

interface AnswerFormProps {
  caseData: CaseData;
  selectedSuspectId?: string;
  selectedWeaponId?: string;
  selectedDeductionAnswers: Record<string, string>;
  onSelectSuspect: (suspectId: string) => void;
  onSelectWeapon: (weaponId: string) => void;
  onSelectDeductionAnswer: (questionId: string, optionId: string) => void;
  onSubmit: () => void;
}

export const AnswerForm = ({
  caseData,
  selectedSuspectId,
  selectedWeaponId,
  selectedDeductionAnswers,
  onSelectSuspect,
  onSelectWeapon,
  onSelectDeductionAnswer,
  onSubmit,
}: AnswerFormProps) => {
  const answeredDeductionCount = caseData.deductionQuestions.filter((question) => selectedDeductionAnswers[question.id]).length;
  const isReady = Boolean(selectedSuspectId && selectedWeaponId && answeredDeductionCount === caseData.deductionQuestions.length);

  return (
    <View style={styles.wrap}>
      <Card highlighted>
        <Text style={styles.title}>Финальная версия</Text>
        <Text style={styles.helperText}>
          Чтобы обвинить человека, собери цепочку: виновный, способ и ключевые доказательства. Просто угадать теперь не получится.
        </Text>
        <Text style={styles.progressText}>
          Цепочка доказательств: {answeredDeductionCount}/{caseData.deductionQuestions.length}
        </Text>
      </Card>

      <Card>
        <Text style={styles.title}>Кто стоит за преступлением?</Text>
        <View style={styles.options}>
          {caseData.suspects.map((suspect) => {
            const portraitSource = getCharacterPortrait(suspect.portrait);

            return (
              <TouchableOpacity
                key={suspect.id}
                activeOpacity={0.82}
                onPress={() => onSelectSuspect(suspect.id)}
                style={[styles.option, selectedSuspectId === suspect.id && styles.selectedOption]}
              >
                {portraitSource ? (
                  <Image source={portraitSource} style={styles.optionImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.optionIcon}>{suspect.portrait}</Text>
                )}
                <Text style={styles.optionText}>{suspect.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>Как это было сделано?</Text>
        <View style={styles.options}>
          {caseData.weapons.map((weapon) => (
            <TouchableOpacity
              key={weapon.id}
              activeOpacity={0.82}
              onPress={() => onSelectWeapon(weapon.id)}
              style={[styles.weaponOption, selectedWeaponId === weapon.id && styles.selectedOption]}
            >
              <Text style={styles.weaponName}>{weapon.name}</Text>
              <Text style={styles.weaponDescription}>{weapon.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>Собери цепочку доказательств</Text>
        <View style={styles.questions}>
          {caseData.deductionQuestions.map((question, index) => (
            <View key={question.id} style={styles.question}>
              <Text style={styles.questionTitle}>
                {index + 1}. {question.prompt}
              </Text>
              <View style={styles.options}>
                {question.options.map((option) => {
                  const isSelected = selectedDeductionAnswers[question.id] === option.id;

                  return (
                    <TouchableOpacity
                      key={option.id}
                      activeOpacity={0.82}
                      onPress={() => onSelectDeductionAnswer(question.id, option.id)}
                      style={[styles.deductionOption, isSelected && styles.selectedOption]}
                    >
                      <Text style={styles.deductionOptionText}>{option.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Button title={isReady ? 'Разоблачить' : 'Собери всю цепочку'} onPress={onSubmit} disabled={!isReady} variant="primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  helperText: {
    ...typography.body,
    color: colors.text,
  },
  progressText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    minHeight: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  optionIcon: {
    fontSize: 26,
  },
  optionImage: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '800',
  },
  weaponOption: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  weaponName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '900',
  },
  weaponDescription: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
  questions: {
    gap: spacing.lg,
  },
  question: {
    gap: spacing.sm,
  },
  questionTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '900',
  },
  deductionOption: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  deductionOptionText: {
    ...typography.body,
    color: colors.text,
  },
});
