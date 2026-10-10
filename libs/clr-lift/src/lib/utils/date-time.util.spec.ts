import {describe, expect, it} from 'vitest';

import {parseIsoTimestampOrNull} from './date-time.util';

describe('parseIsoTimestampOrNull', () => {
  it('should return null for undefined, null, or empty string', () => {
    expect(parseIsoTimestampOrNull(undefined)).toBeNull();
    expect(parseIsoTimestampOrNull(null)).toBeNull();
    expect(parseIsoTimestampOrNull('')).toBeNull();
  });

  it('should return null for invalid date strings', () => {
    expect(parseIsoTimestampOrNull('not-a-date')).toBeNull();
    expect(parseIsoTimestampOrNull('2026-99-99T99:99:99Z')).toBeNull();
  });

  it('should return Date instance for valid ISO timestamp', () => {
    const isoString = '2026-10-10T12:00:00.000Z';
    const result = parseIsoTimestampOrNull(isoString);
    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe(isoString);
  });
});
