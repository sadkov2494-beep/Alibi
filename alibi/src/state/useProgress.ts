import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { cases, chapters, getNextCaseId } from '../data/cases';
import { PlayerProgress, PlayerSettings } from '../types';

const STORAGE_KEY = '@alibi/progress';

const initialSettings: PlayerSettings = {
  sound: true,
  music: true,
  language: 'ru',
};

export const defaultProgress: PlayerProgress = {
  unlockedChapterIds: [chapters[0].id],
  unlockedCaseIds: [cases[0].id],
  completedCases: {},
  hintsAvailable: 3,
  settings: initialSettings,
  tutorialSeenCaseIds: [],
  adsRemoved: false,
};

const mergeProgress = (stored: Partial<PlayerProgress> | null): PlayerProgress => ({
  ...defaultProgress,
  ...stored,
  settings: {
    ...defaultProgress.settings,
    ...stored?.settings,
  },
  completedCases: stored?.completedCases ?? {},
  unlockedChapterIds: stored?.unlockedChapterIds?.length ? stored.unlockedChapterIds : defaultProgress.unlockedChapterIds,
  unlockedCaseIds: stored?.unlockedCaseIds?.length ? stored.unlockedCaseIds : defaultProgress.unlockedCaseIds,
  tutorialSeenCaseIds: stored?.tutorialSeenCaseIds ?? [],
});

export const useProgress = () => {
  const [progress, setProgress] = useState<PlayerProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const rawProgress = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = rawProgress ? (JSON.parse(rawProgress) as Partial<PlayerProgress>) : null;
        setProgress(mergeProgress(parsed));
      } catch {
        setProgress(defaultProgress);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProgress();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => undefined);
    }
  }, [isLoaded, progress]);

  const updateProgress = useCallback((updater: (current: PlayerProgress) => PlayerProgress) => {
    setProgress((current) => updater(current));
  }, []);

  const completeCase = useCallback(
    (caseId: string, stars: number, attempts: number, hintsUsed: number) => {
      updateProgress((current) => {
        const previousCaseProgress = current.completedCases[caseId];
        const nextCaseId = getNextCaseId(caseId);
        const unlockedCaseIds = nextCaseId && !current.unlockedCaseIds.includes(nextCaseId)
          ? [...current.unlockedCaseIds, nextCaseId]
          : current.unlockedCaseIds;

        return {
          ...current,
          unlockedCaseIds,
          completedCases: {
            ...current.completedCases,
            [caseId]: {
              solved: true,
              stars: Math.max(previousCaseProgress?.stars ?? 0, stars),
              attempts,
              hintsUsed,
            },
          },
        };
      });
    },
    [updateProgress],
  );

  const spendHint = useCallback((): boolean => {
    if (progress.hintsAvailable <= 0) {
      return false;
    }

    updateProgress((current) => ({
      ...current,
      hintsAvailable: Math.max(0, current.hintsAvailable - 1),
    }));

    return true;
  }, [progress.hintsAvailable, updateProgress]);

  const addHints = useCallback(
    (count: number) => {
      updateProgress((current) => ({
        ...current,
        hintsAvailable: current.hintsAvailable + count,
      }));
    },
    [updateProgress],
  );

  const updateSettings = useCallback(
    (settings: Partial<PlayerSettings>) => {
      updateProgress((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...settings,
        },
      }));
    },
    [updateProgress],
  );

  const markTutorialSeen = useCallback(
    (caseId: string) => {
      updateProgress((current) => ({
        ...current,
        tutorialSeenCaseIds: current.tutorialSeenCaseIds.includes(caseId)
          ? current.tutorialSeenCaseIds
          : [...current.tutorialSeenCaseIds, caseId],
      }));
    },
    [updateProgress],
  );

  const resetProgress = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
  }, []);

  return useMemo(
    () => ({
      progress,
      isLoaded,
      completeCase,
      spendHint,
      addHints,
      updateSettings,
      markTutorialSeen,
      resetProgress,
    }),
    [addHints, completeCase, isLoaded, markTutorialSeen, progress, resetProgress, spendHint, updateSettings],
  );
};
