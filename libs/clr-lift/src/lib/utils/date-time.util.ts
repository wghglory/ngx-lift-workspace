export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates the time remaining until a given expiration date/time.
 *
 * @param expiresAt - The expiration date/time (ISO string, Date object, or parseable string).
 * @param baseDate - Optional reference date to compare against (defaults to `new Date()`).
 * @returns An object with days, hours, minutes, and seconds remaining, or `null` if expired, invalid, or missing.
 *
 * @example
 * ```typescript
 * getTimeUntilExpiration('2026-12-31T23:59:59Z');
 * // => { days: 82, hours: 2, minutes: 54, seconds: 12 }
 * ```
 */
export function getTimeUntilExpiration(
  expiresAt: string | Date | null | undefined,
  baseDate: Date = new Date(),
): TimeRemaining | null {
  if (!expiresAt) {
    return null;
  }

  const expirationDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  if (Number.isNaN(expirationDate.getTime())) {
    return null;
  }

  const diffMs = expirationDate.getTime() - baseDate.getTime();
  if (diffMs <= 0) {
    return null;
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const remainingAfterDays = diffMs % (1000 * 60 * 60 * 24);
  const diffHours = Math.floor(remainingAfterDays / (1000 * 60 * 60));
  const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);
  const diffMinutes = Math.floor(remainingAfterHours / (1000 * 60));
  const remainingAfterMinutes = remainingAfterHours % (1000 * 60);
  const diffSeconds = Math.floor(remainingAfterMinutes / 1000);

  return {
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    seconds: diffSeconds,
  };
}
