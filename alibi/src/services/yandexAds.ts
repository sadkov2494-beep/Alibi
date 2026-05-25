import { MobileAds, RewardedAdLoader, type AdRequestParams } from 'yandex-mobile-ads';

import { YANDEX_REWARDED_AD_UNIT_ID } from '../config/ads';

let isInitialized = false;

const ensureInitialized = async () => {
  if (isInitialized) {
    return;
  }

  await MobileAds.initialize();
  isInitialized = true;
};

export const showRewardedAdForHint = async (): Promise<boolean> => {
  try {
    await ensureInitialized();

    const loader = await RewardedAdLoader.create();
    const request: AdRequestParams = {
      adUnitId: YANDEX_REWARDED_AD_UNIT_ID,
    };

    const ad = await loader.loadAd(request);
    let rewarded = false;

    return await new Promise<boolean>((resolve) => {
      ad.onRewarded = () => {
        rewarded = true;
      };

      ad.onAdDismissed = () => {
        resolve(rewarded);
      };

      ad.onAdFailedToShow = () => {
        resolve(false);
      };

      void ad.show().catch(() => resolve(false));
    });
  } catch {
    return false;
  }
};
