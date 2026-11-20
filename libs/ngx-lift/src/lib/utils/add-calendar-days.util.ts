/**
 * Returns a new Date shifted by whole local calendar days, without changing the input.
 *
 * Local wall time is preserved where possible using native Date DST normalization. A calendar
 * day can span 23 or 25 hours; use timestamp arithmetic for an exact elapsed duration.
 * Zero returns an exact clone, including during a repeated DST hour. No current clock is read.
 *
 * @param date - Valid native Date used as the reference instant.
 * @param days - Positive, negative or zero safe-integer number of local calendar days.
 * @returns A distinct Date shifted by the requested calendar days.
 * @throws TypeError when date is not a native Date (cross-realm Dates are supported).
 * @throws RangeError for an invalid Date, a non-safe-integer offset, or Date overflow.
 * @example
 * const tomorrow = addCalendarDays(new Date(), 1);
 */
export function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(Date.prototype.getTime.call(date));
  if (!Number.isFinite(result.getTime())) throw new RangeError('date must be a valid Date.');
  if (!Number.isSafeInteger(days)) throw new RangeError('days must be a safe integer.');
  // Calling setDate even with zero could choose another instant in a repeated local hour.
  if (days === 0) return result;
  result.setDate(result.getDate() + days);
  if (!Number.isFinite(result.getTime())) throw new RangeError('The resulting date is outside the Date range.');
  return result;
}
