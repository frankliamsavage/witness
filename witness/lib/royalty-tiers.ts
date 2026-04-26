export type RoyaltyTier = {
  name: "Starter" | "Growth" | "Pro";
  ratePercent: 5 | 10 | 15;
  minSales: number;
  maxSales: number | null;
};

export const ROYALTY_TIERS: RoyaltyTier[] = [
  { name: "Starter", ratePercent: 5, minSales: 0, maxSales: 50 },
  { name: "Growth", ratePercent: 10, minSales: 51, maxSales: 199 },
  { name: "Pro", ratePercent: 15, minSales: 200, maxSales: null },
];

export function getRoyaltyTier(totalSales: number): RoyaltyTier {
  if (totalSales >= 200) return ROYALTY_TIERS[2];
  if (totalSales >= 51) return ROYALTY_TIERS[1];
  return ROYALTY_TIERS[0];
}

export function getProgressToNextTier(totalSales: number): {
  nextTier: RoyaltyTier | null;
  salesNeeded: number;
  percent: number;
} {
  if (totalSales >= 200) {
    return { nextTier: null, salesNeeded: 0, percent: 100 };
  }

  if (totalSales >= 51) {
    const targetSales = 200;
    const salesNeeded = Math.max(0, targetSales - totalSales);
    const percent = Math.min(100, Math.max(0, ((totalSales - 51) / (targetSales - 51)) * 100));
    return { nextTier: ROYALTY_TIERS[2], salesNeeded, percent };
  }

  const targetSales = 51;
  const salesNeeded = Math.max(0, targetSales - totalSales);
  const percent = Math.min(100, Math.max(0, (totalSales / 50) * 100));
  return { nextTier: ROYALTY_TIERS[1], salesNeeded, percent };
}
