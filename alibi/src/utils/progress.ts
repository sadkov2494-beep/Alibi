export const calculateStars = (attempts: number, hintsUsed: number): number => {
  if (attempts <= 1 && hintsUsed <= 1) {
    return 3;
  }

  if (attempts <= 3 && hintsUsed <= 2) {
    return 2;
  }

  return 1;
};

export const clampStars = (stars: number): number => Math.max(1, Math.min(3, stars));
