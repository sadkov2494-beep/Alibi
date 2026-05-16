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
  onSelectSuspect: (suspectId: string) => void;
  onSelectWeapon: (weaponId: string) => void;
  onSubmit: () => void;
}

export const AnswerForm = ({
  caseData,
  selectedSuspectId,
  selectedWeaponId,
  onSelectSuspect,
  onSelectWeapon,
  onSubmit,
}: AnswerFormProps) => (
  <View style={styles.wrap}>
    <Card>
      <Text style={styles.title}>Кто мог совершить преступление?</Text>
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
      <Text style={styles.title}>Как было совершено преступление?</Text>
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

    <Button
      title="Проверить версию"
      onPress={onSubmit}
      disabled={!selectedSuspectId || !selectedWeaponId}
      variant="primary"
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
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
});
