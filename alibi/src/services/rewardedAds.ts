import { Platform } from 'react-native';

import { showRewardedAdForHint as showYandexRewardedAd } from './yandexAds';

/** Показ вознаграждаемой рекламы; в Expo Go без native-модуля вернёт false. */
export const showRewardedAdForHint = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    return await showYandexRewardedAd();
  } catch {
    return false;
  }
};
