import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AnswerForm } from '../components/AnswerForm';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ClueList } from '../components/ClueList';
import { HintPanel } from '../components/HintPanel';
import { LocationMap } from '../components/LocationMap';
import { ResultModal } from '../components/ResultModal';
import { SuspectCard } from '../components/SuspectCard';
import { Timeline } from '../components/Timeline';
import { colors, spacing, typography } from '../theme';
import { CaseData } from '../types';
import { calculateStars } from '../utils/progress';

type InvestigationTab = 'suspects' | 'map' | 'time' | 'clues' | 'answer';

interface InvestigationScreenProps {
  caseData: CaseData;
  hintsAvailable: number;
  onBack: () => void;
  onSpendHint: () => boolean;
  onWatchAd: () => void;
  onSolved: (stars: number, attempts: number, hintsUsed: number) => void;
  onNextCase?: () => void;
}

const tabs: Array<{ id: InvestigationTab; title: string }> = [
  { id: 'suspects', title: 'Подозреваемые' },
  { id: 'map', title: 'Карта' },
  { id: 'time', title: 'Время' },
  { id: 'clues', title: 'Улики' },
  { id: 'answer', title: 'Ответ' },
];

export const InvestigationScreen = ({
  caseData,
  hintsAvailable,
  onBack,
  onSpendHint,
  onWatchAd,
  onSolved,
  onNextCase,
}: InvestigationScreenProps) => {
  const [activeTab, setActiveTab] = useState<InvestigationTab>('suspects');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>();
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>();
  const [attempts, setAttempts] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [resultVisible, setResultVisible] = useState(false);
  const [lastResultCorrect, setLastResultCorrect] = useState(false);
  const [earnedStars, setEarnedStars] = useState(1);

  useEffect(() => {
    setActiveTab('suspects');
    setSelectedSuspectId(undefined);
    setSelectedWeaponId(undefined);
    setAttempts(0);
    setRevealedHints(0);
    setResultVisible(false);
    setLastResultCorrect(false);
    setEarnedStars(1);
  }, [caseData.id]);

  const crimeLocation = useMemo(
    () => caseData.locations.find((location) => location.id === caseData.crimeLocationId),
    [caseData.crimeLocationId, caseData.locations],
  );

  const handleUseHint = () => {
    if (revealedHints >= caseData.hints.length) {
      return;
    }

    const canSpend = onSpendHint();
    if (canSpend) {
      setRevealedHints((current) => current + 1);
    }
  };

  const handleSubmit = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const isCorrect = selectedSuspectId === caseData.correctSuspectId && selectedWeaponId === caseData.correctWeaponId;
    setLastResultCorrect(isCorrect);

    if (isCorrect) {
      const stars = calculateStars(nextAttempts, revealedHints);
      setEarnedStars(stars);
      onSolved(stars, nextAttempts, revealedHints);
    }

    setResultVisible(true);
  };

  const renderTab = () => {
    if (activeTab === 'suspects') {
      return (
        <View style={styles.tabContent}>
          <Card highlighted>
            <Text style={styles.cardTitle}>Цель расследования</Text>
            <Text style={styles.bodyText}>
              Преступление произошло в {caseData.crimeTime} в локации «{crimeLocation?.name}». Проверь, кто мог добраться туда вовремя и каким способом.
            </Text>
          </Card>
          {caseData.suspects.map((suspect) => (
            <SuspectCard key={suspect.id} suspect={suspect} />
          ))}
        </View>
      );
    }

    if (activeTab === 'map') {
      return <LocationMap caseData={caseData} />;
    }

    if (activeTab === 'time') {
      return <Timeline caseData={caseData} />;
    }

    if (activeTab === 'clues') {
      return (
        <View style={styles.tabContent}>
          <ClueList caseData={caseData} />
          <HintPanel
            caseData={caseData}
            revealedCount={revealedHints}
            hintsAvailable={hintsAvailable}
            onUseHint={handleUseHint}
            onWatchAd={onWatchAd}
          />
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <AnswerForm
          caseData={caseData}
          selectedSuspectId={selectedSuspectId}
          selectedWeaponId={selectedWeaponId}
          onSelectSuspect={setSelectedSuspectId}
          onSelectWeapon={setSelectedWeaponId}
          onSubmit={handleSubmit}
        />
        <HintPanel
          caseData={caseData}
          revealedCount={revealedHints}
          hintsAvailable={hintsAvailable}
          onUseHint={handleUseHint}
          onWatchAd={onWatchAd}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="← Дело" onPress={onBack} variant="ghost" style={styles.backButton} />
        <View style={styles.topInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {caseData.title}
          </Text>
          <Text style={styles.meta}>
            {caseData.crimeTime} · {crimeLocation?.name}
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.82}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>{renderTab()}</ScrollView>

      <ResultModal
        visible={resultVisible}
        isCorrect={lastResultCorrect}
        stars={earnedStars}
        caseData={caseData}
        hintsUsed={revealedHints}
        onClose={() => setResultVisible(false)}
        onNext={lastResultCorrect ? onNextCase : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  topInfo: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
  },
  activeTabText: {
    color: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  tabContent: {
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bodyText: {
    ...typography.body,
    color: colors.text,
  },
});
