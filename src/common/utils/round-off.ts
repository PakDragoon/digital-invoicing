export const roundToTwo = (value: number | null | undefined) =>
  Math.round((value ?? 0) * 100) / 100;
