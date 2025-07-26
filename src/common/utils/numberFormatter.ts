import { Decimal } from "@prisma/client/runtime/library";

export function toNumber(
  value: Decimal | string | number | null,
): number | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Decimal) return value.toNumber();
  const num = Number(value);
  return isNaN(num) ? null : num;
}
