import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { parseTimeToMinutes } from '../utils/time';
import { Card } from './Card';

interface TimelineProps {
  caseData: CaseData;
}

const typeLabels = {
  crime: 'Преступление',
  witness: 'Свидетель',
  camera: 'Камера',
  transport: 'Транспорт',
  call: 'Звонок',
  clue: 'Улика',
  alibi: 'Алиби',
  receipt: 'Чек',
};

export const Timeline = ({ caseData }: TimelineProps) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('all');

  const events = useMemo(
    () =>
      [...caseData.timelineEvents]
        .filter((event) => selectedSuspectId === 'all' || event.suspectId === selectedSuspectId || event.type === 'crime')
        .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)),
    [caseData.timelineEvents, selectedSuspectId],
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.filters}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => setSelectedSuspectId('all')}
          style={[styles.filter, selectedSuspectId === 'all' && styles.activeFilter]}
        >
          <Text style={styles.filterText}>Все</Text>
        </TouchableOpacity>
        {caseData.suspects.map((suspect) => (
          <TouchableOpacity
            key={suspect.id}
            activeOpacity={0.82}
            onPress={() => setSelectedSuspectId(suspect.id)}
            style={[styles.filter, selectedSuspectId === suspect.id && styles.activeFilter]}
          >
            <Text style={styles.filterText}>{suspect.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {events.map((event) => {
        const location = caseData.locations.find((item) => item.id === event.locationId);
        const suspect = caseData.suspects.find((item) => item.id === event.suspectId);
        const isCrime = event.type === 'crime';

        return (
          <View key={event.id} style={styles.eventRow}>
            <View style={[styles.timeBubble, isCrime && styles.crimeBubble]}>
              <Text style={styles.timeText}>{event.time}</Text>
            </View>
            <View style={styles.line} />
            <Card style={[styles.eventCard, isCrime && styles.crimeCard]}>
              <Text style={styles.eventMeta}>
                {typeLabels[event.type]} {suspect ? `· ${suspect.name}` : ''} · {location?.name}
              </Text>
              <Text style={styles.eventText}>{event.text}</Text>
            </Card>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filter: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.line,
  },
  activeFilter: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  timeBubble: {
    width: 62,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crimeBubble: {
    backgroundColor: colors.accent,
  },
  timeText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '900',
  },
  line: {
    width: 2,
    backgroundColor: colors.line,
    marginHorizontal: spacing.sm,
  },
  eventCard: {
    flex: 1,
    padding: spacing.md,
  },
  crimeCard: {
    borderColor: colors.accent,
  },
  eventMeta: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  eventText: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
