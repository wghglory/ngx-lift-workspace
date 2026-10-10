/**
 * Parses an ISO 8601 timestamp string or returns null if the string is empty or invalid.
 *
 * @param value - The timestamp string to parse.
 * @returns A Date object if valid, otherwise null.
 *
 * @example
 * ```typescript
 * parseIsoTimestampOrNull('2026-10-10T08:00:00Z'); // Date object
 * parseIsoTimestampOrNull('invalid-date'); // null
 * parseIsoTimestampOrNull(undefined); // null
 * ```
 */
export function parseIsoTimestampOrNull(value: string | undefined | null): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
