import { Image, StyleSheet, Text, View } from 'react-native';

import { getCharacterPortrait } from '../data/characterPortraits';
import { borderRadius, colors, spacing, typography } from '../theme';
import { Suspect } from '../types';
import { transportLabels } from '../utils/format';
import { Card } from './Card';

interface SuspectCardProps {
  suspect: Suspect;
}

export const SuspectCard = ({ suspect }: SuspectCardProps) => {
  const portraitSource = getCharacterPortrait(suspect.portrait);

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.portrait}>
          {portraitSource ? (
            <Image source={portraitSource} style={styles.portraitImage} resizeMode="cover" />
          ) : (
            <Text style={styles.portraitText}>{suspect.portrait}</Text>
          )}
        </View>
      <View style={styles.headerText}>
        <Text style={styles.name}>{suspect.name}</Text>
        <Text style={styles.role}>{suspect.role}</Text>
      </View>
    </View>

    <Text style={styles.label}>Мотив</Text>
    <Text style={styles.text}>{suspect.motive}</Text>

    <Text style={styles.label}>Алиби</Text>
    <Text style={styles.text}>{suspect.alibi}</Text>

    <Text style={styles.label}>Транспорт</Text>
    <View style={styles.chips}>
      {suspect.transport.map((transport) => (
        <View key={transport} style={styles.chip}>
          <Text style={styles.chipText}>{transportLabels[transport]}</Text>
        </View>
      ))}
    </View>

    <Text style={styles.label}>Заметки</Text>
    {suspect.notes.map((note) => (
      <Text key={note} style={styles.note}>
        • {note}
      </Text>
    ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  portrait: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  portraitText: {
    fontSize: 30,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  role: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '800',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.secondary,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
  },
  note: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
