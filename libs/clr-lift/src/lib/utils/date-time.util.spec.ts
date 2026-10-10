import {describe, expect, it} from 'vitest';

import {getTimeUntilExpiration} from './date-time.util';

describe('getTimeUntilExpiration', () => {
  const baseDate = new Date('2026-10-10T12:00:00Z');

  it('should return null when input is null, undefined, or empty', () => {
    expect(getTimeUntilExpiration(null, baseDate)).toBeNull();
    expect(getTimeUntilExpiration(undefined, baseDate)).toBeNull();
    expect(getTimeUntilExpiration('', baseDate)).toBeNull();
  });

  it('should return null for invalid date string', () => {
    expect(getTimeUntilExpiration('invalid-date', baseDate)).toBeNull();
  });

  it('should return null when date is already expired', () => {
    const pastDate = new Date('2026-10-09T12:00:00Z');
    expect(getTimeUntilExpiration(pastDate, baseDate)).toBeNull();
  });

  it('should calculate remaining days, hours, minutes, and seconds', () => {
    // 2 days, 3 hours, 15 minutes, 40 seconds in the future
    const futureDate = new Date('2026-10-12T15:15:40Z');
    const result = getTimeUntilExpiration(futureDate, baseDate);

    expect(result).toEqual({
      days: 2,
      hours: 3,
      minutes: 15,
      seconds: 40,
    });
  });

  it('should accept ISO string input', () => {
    const result = getTimeUntilExpiration('2026-10-10T12:05:30Z', baseDate);
    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 5,
      seconds: 30,
    });
  });
});
