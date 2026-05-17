import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { cases, getCaseById, getNextCaseId } from './src/data/cases';
import { useProgress } from './src/state/useProgress';
import { colors, spacing, typography } from './src/theme';
import { ScreenName } from './src/types';
import { CaseIntroScreen } from './src/screens/CaseIntroScreen';
import { ChapterSelectScreen } from './src/screens/ChapterSelectScreen';
import { HintShopScreen } from './src/screens/HintShopScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InvestigationScreen } from './src/screens/InvestigationScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  const {
    progress,
    isLoaded,
    completeCase,
    spendHint,
    addHints,
    updateSettings,
    resetProgress,
  } = useProgress();
  const [screen, setScreen] = useState<ScreenName>('home');
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0].id);

  const selectedCase = useMemo(() => getCaseById(selectedCaseId) ?? cases[0], [selectedCaseId]);

  const openCase = (caseId: string, targetScreen: ScreenName = 'caseIntro') => {
    setSelectedCaseId(caseId);
    setScreen(targetScreen);
  };

  const handlePlay = () => {
    const firstOpenUnsolved =
      cases.find((caseData) => progress.unlockedCaseIds.includes(caseData.id) && !progress.completedCases[caseData.id]?.solved) ??
      cases.find((caseData) => progress.unlockedCaseIds.includes(caseData.id)) ??
      cases[0];

    openCase(firstOpenUnsolved.id);
  };

  const renderScreen = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Загружаем дело...</Text>
        </View>
      );
    }

    if (screen === 'chapters') {
      return <ChapterSelectScreen progress={progress} onBack={() => setScreen('home')} onOpenCase={openCase} />;
    }

    if (screen === 'caseIntro') {
      return (
        <CaseIntroScreen
          caseData={selectedCase}
          onBack={() => setScreen('chapters')}
          onStartInvestigation={() => setScreen('investigation')}
        />
      );
    }

    if (screen === 'investigation') {
      const nextCaseId = getNextCaseId(selectedCase.id);
      const onNextCase = nextCaseId ? () => openCase(nextCaseId) : undefined;

      return (
        <InvestigationScreen
          caseData={selectedCase}
          hintsAvailable={progress.hintsAvailable}
          onBack={() => setScreen('caseIntro')}
          onSpendHint={spendHint}
          onWatchAd={() => addHints(1)}
          onSolved={(stars, attempts, hintsUsed) => completeCase(selectedCase.id, stars, attempts, hintsUsed)}
          onNextCase={onNextCase}
        />
      );
    }

    if (screen === 'settings') {
      return (
        <SettingsScreen
          settings={progress.settings}
          onBack={() => setScreen('home')}
          onUpdateSettings={updateSettings}
          onResetProgress={() => {
            resetProgress();
            setSelectedCaseId(cases[0].id);
            setScreen('home');
          }}
        />
      );
    }

    if (screen === 'shop') {
      return (
        <HintShopScreen
          hintsAvailable={progress.hintsAvailable}
          adsRemoved={progress.adsRemoved}
          onBack={() => setScreen('home')}
          onAddHints={addHints}
        />
      );
    }

    return (
      <HomeScreen
        hintsAvailable={progress.hintsAvailable}
        solvedCases={Object.values(progress.completedCases).filter((caseProgress) => caseProgress.solved).length}
        totalCases={cases.length}
        onPlay={handlePlay}
        onChapters={() => setScreen('chapters')}
        onSettings={() => setScreen('settings')}
        onShop={() => setScreen('shop')}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.appShell}>{renderScreen()}</View>
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appShell: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text,
  },
});
