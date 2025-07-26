export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const calculateSumPercentageChange = (
  current: number[] = [],
  previous: number[] = [],
): number => {
  const currentTotal = current.reduce((sum, val) => sum + val, 0);
  const previousTotal = previous.reduce((sum, val) => sum + val, 0);
  if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
  return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
};
