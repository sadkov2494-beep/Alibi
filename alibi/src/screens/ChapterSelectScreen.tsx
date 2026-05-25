import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StarsRating } from '../components/StarsRating';
import { cases, chapters } from '../data/cases';
import { colors, spacing, typography } from '../theme';
import { PlayerProgress } from '../types';

interface ChapterSelectScreenProps {
  progress: PlayerProgress;
  onBack: () => void;
  onOpenCase: (caseId: string) => void;
}

export const ChapterSelectScreen = ({ progress, onBack, onOpenCase }: ChapterSelectScreenProps) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Button title="← На главный экран" onPress={onBack} variant="ghost" />
    <Text style={styles.title}>Главы кампании</Text>

    {chapters.map((chapter) => {
      const isChapterUnlocked = progress.unlockedChapterIds.includes(chapter.id);
      const chapterCases = chapter.caseIds.map((caseId) => cases.find((caseData) => caseData.id === caseId)).filter(Boolean);
      const completedCount = chapterCases.filter((caseData) => caseData && progress.completedCases[caseData.id]?.solved).length;

      return (
        <Card key={chapter.id} highlighted={isChapterUnlocked}>
          <View style={styles.chapterHeader}>
            <View style={styles.chapterIcon}>
              <Text style={styles.chapterIconText}>{isChapterUnlocked ? '🔎' : '🔒'}</Text>
            </View>
            <View style={styles.chapterText}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.description}>{chapter.description}</Text>
              {chapter.storyIntro ? <Text style={styles.storyIntro}>{chapter.storyIntro}</Text> : null}
              <Text style={styles.progress}>
                Прогресс: {completedCount}/{chapterCases.length}
              </Text>
            </View>
          </View>

          <View style={styles.caseList}>
            {chapterCases.map((caseData) => {
              if (!caseData) {
                return null;
              }

              const isUnlocked = progress.unlockedCaseIds.includes(caseData.id);
              const caseProgress = progress.completedCases[caseData.id];

              return (
                <Card key={caseData.id} style={styles.caseCard}>
                  <View style={styles.caseHeader}>
                    <View style={styles.caseInfo}>
                      <Text style={styles.caseTitle}>{caseData.title}</Text>
                      <Text style={styles.caseMeta}>
                        {caseData.crimeTime} · {caseData.locations.find((location) => location.id === caseData.crimeLocationId)?.name}
                      </Text>
                    </View>
                    {caseProgress?.solved ? <StarsRating stars={caseProgress.stars} /> : <Text style={styles.lock}>{isUnlocked ? 'Открыто' : '🔒'}</Text>}
                  </View>
                  <Button
                    title={isUnlocked ? 'Открыть дело' : 'Заблокировано'}
                    onPress={() => onOpenCase(caseData.id)}
                    disabled={!isUnlocked || !isChapterUnlocked}
                    variant={isUnlocked ? 'secondary' : 'ghost'}
                  />
                </Card>
              );
            })}
          </View>
        </Card>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  chapterHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chapterIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIconText: {
    fontSize: 28,
  },
  chapterText: {
    flex: 1,
  },
  chapterTitle: {
    ...typography.h2,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
  storyIntro: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.sm,
  },
  progress: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  caseList: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  caseCard: {
    padding: spacing.md,
  },
  caseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  caseInfo: {
    flex: 1,
  },
  caseTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '900',
  },
  caseMeta: {
    ...typography.caption,
    color: colors.mutedText,
  },
  lock: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
});
