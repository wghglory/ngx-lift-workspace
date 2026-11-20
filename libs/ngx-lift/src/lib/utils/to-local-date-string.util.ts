/**
 * Formats a Date's local calendar day as YYYY-MM-DD for native date inputs and date-only bounds.
 *
 * This is a machine-readable format, independent of display locale. Unlike toISOString(), it
 * uses local calendar fields. The input is neither mutated nor reparsed; a Date constructed from
 * a date-only string already represents UTC midnight and is not converted back to its named day.
 * Uses the host timezone, so SSR and browser results require matching timezone assumptions.
 *
 * @param date - Valid native Date whose local calendar fields should be formatted.
 * @returns The local calendar day as a four-digit positive-year YYYY-MM-DD string.
 * @throws TypeError when date is not a native Date (cross-realm Dates are supported).
 * @throws RangeError for an invalid Date or a local year outside 1–9999.
 * @example
 * const minDate = toLocalDateString(addCalendarDays(new Date(), 1));
 */
export function toLocalDateString(date: Date): string {
  const value = new Date(Date.prototype.getTime.call(date));
  if (!Number.isFinite(value.getTime())) throw new RangeError('date must be a valid Date.');
  const year = value.getFullYear();
  if (year < 1 || year > 9999) throw new RangeError('The local year must be between 1 and 9999.');
  return [
    String(year).padStart(4, '0'),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}
