import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { StarsRating } from './StarsRating';

interface ResultModalProps {
  visible: boolean;
  isCorrect: boolean;
  stars: number;
  caseData: CaseData;
  hintsUsed: number;
  onClose: () => void;
  onNext?: () => void;
}

export const ResultModal = ({ visible, isCorrect, stars, caseData, hintsUsed, onClose, onNext }: ResultModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <Card style={styles.modal}>
        <Text style={[styles.title, isCorrect ? styles.success : styles.danger]}>{isCorrect ? 'Верно!' : 'Есть противоречие'}</Text>
        {isCorrect ? (
          <>
            <StarsRating stars={stars} />
            <Text style={styles.text}>{caseData.explanation}</Text>
            <Text style={styles.subtitle}>Кто исключается</Text>
            {caseData.exclusions.map((exclusion) => {
              const suspect = caseData.suspects.find((item) => item.id === exclusion.suspectId);
              return (
                <Text key={exclusion.suspectId} style={styles.exclusion}>
                  • {suspect?.name}: {exclusion.reason}
                </Text>
              );
            })}
            <Text style={styles.footerText}>Использовано подсказок: {hintsUsed}</Text>
            <Button title={onNext ? 'Следующее дело' : 'Вернуться'} onPress={onNext ?? onClose} />
          </>
        ) : (
          <>
            <Text style={styles.text}>В этой версии есть противоречие. Проверь временную шкалу, маршруты и способ убийства.</Text>
            <Button title="Продолжить расследование" onPress={onClose} variant="secondary" />
          </>
        )}
      </Card>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxHeight: '86%',
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  subtitle: {
    ...typography.h2,
    color: colors.text,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  exclusion: {
    ...typography.caption,
    color: colors.mutedText,
  },
  footerText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
});
