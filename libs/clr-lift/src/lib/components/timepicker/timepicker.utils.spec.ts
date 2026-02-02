import {describe, expect, it} from 'vitest';

import {
  formatTime,
  generateTimeOptions,
  isSameTime,
  isTimeInBounds,
  parseInterval,
  parseTimeString,
} from './timepicker.utils';

describe('Timepicker Utils', () => {
  describe('parseTimeString', () => {
    it('should parse 12-hour format with AM', () => {
      const result = parseTimeString('9:30 AM');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(9);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should parse 12-hour format with PM', () => {
      const result = parseTimeString('2:30 PM');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should parse 12:00 PM as noon', () => {
      const result = parseTimeString('12:00 PM');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(12);
      expect(result?.getMinutes()).toBe(0);
    });

    it('should parse 12:00 AM as midnight', () => {
      const result = parseTimeString('12:00 AM');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it('should parse 24-hour format with colon', () => {
      const result = parseTimeString('14:30');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should parse 24-hour format with dot', () => {
      const result = parseTimeString('14.30');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should parse time with seconds', () => {
      const result = parseTimeString('14:30:45');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
      expect(result?.getSeconds()).toBe(45);
    });

    it('should parse lowercase am/pm', () => {
      const result = parseTimeString('2:30pm');
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should return null for invalid format', () => {
      expect(parseTimeString('invalid')).toBeNull();
      expect(parseTimeString('25:00')).toBeNull();
      expect(parseTimeString('12:60')).toBeNull();
      expect(parseTimeString('13:00 AM')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseTimeString('')).toBeNull();
      expect(parseTimeString('   ')).toBeNull();
    });

    it('should use base date when provided', () => {
      const baseDate = new Date(2024, 5, 15);
      const result = parseTimeString('14:30', baseDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(5);
      expect(result?.getDate()).toBe(15);
    });
  });

  describe('formatTime', () => {
    it('should format time based on locale', () => {
      const date = new Date(2024, 0, 1, 14, 30);
      const result = formatTime(date, 'en-US');
      expect(result).toContain('2:30');
      expect(result).toContain('PM');
    });

    it('should format time in 24-hour format for appropriate locales', () => {
      const date = new Date(2024, 0, 1, 14, 30);
      const result = formatTime(date, 'en-GB');
      expect(result).toBe('14:30');
    });

    it('should handle midnight', () => {
      const date = new Date(2024, 0, 1, 0, 0);
      const result = formatTime(date);
      expect(result).toBeTruthy();
    });

    it('should return empty string for invalid date', () => {
      expect(formatTime(new Date('invalid'))).toBe('');
      expect(formatTime(null as never)).toBe('');
    });

    it('should fallback to default locale for invalid locale', () => {
      const date = new Date(2024, 0, 1, 14, 30);
      const result = formatTime(date, 'invalid-locale');
      expect(result).toBeTruthy();
    });
  });

  describe('parseInterval', () => {
    it('should parse numeric minutes', () => {
      expect(parseInterval(30)).toBe(30);
      expect(parseInterval(45)).toBe(45);
    });

    it('should parse minutes with short unit', () => {
      expect(parseInterval('30m')).toBe(30);
      expect(parseInterval('45M')).toBe(45);
    });

    it('should parse hours with short unit', () => {
      expect(parseInterval('1h')).toBe(60);
      expect(parseInterval('1.5h')).toBe(90);
      expect(parseInterval('2H')).toBe(120);
    });

    it('should parse seconds with short unit', () => {
      expect(parseInterval('120s')).toBe(2);
      expect(parseInterval('30S')).toBe(1);
    });

    it('should parse minutes with long unit', () => {
      expect(parseInterval('30 minutes')).toBe(30);
      expect(parseInterval('45 minute')).toBe(45);
      expect(parseInterval('90 min')).toBe(90);
    });

    it('should parse hours with long unit', () => {
      expect(parseInterval('1 hour')).toBe(60);
      expect(parseInterval('1.5 hours')).toBe(90);
      expect(parseInterval('2 hour')).toBe(120);
    });

    it('should parse seconds with long unit', () => {
      expect(parseInterval('120 seconds')).toBe(2);
      expect(parseInterval('30 second')).toBe(1);
    });

    it('should return default (30) for invalid input', () => {
      expect(parseInterval('invalid')).toBe(30);
      expect(parseInterval('')).toBe(30);
      expect(parseInterval(0)).toBe(30);
      expect(parseInterval(-10)).toBe(30);
    });

    it('should handle plain number strings', () => {
      expect(parseInterval('30')).toBe(30);
      expect(parseInterval('45')).toBe(45);
    });
  });

  describe('generateTimeOptions', () => {
    it('should generate options at 30-minute intervals', () => {
      const options = generateTimeOptions('30m');
      expect(options.length).toBeGreaterThan(0);
      expect(options[0].value.getHours()).toBe(0);
      expect(options[0].value.getMinutes()).toBe(0);
      expect(options[1].value.getMinutes()).toBe(30);
    });

    it('should generate options at 1-hour intervals', () => {
      const options = generateTimeOptions('1h');
      expect(options.length).toBe(24);
      expect(options[0].value.getHours()).toBe(0);
      expect(options[1].value.getHours()).toBe(1);
    });

    it('should generate options at 15-minute intervals', () => {
      const options = generateTimeOptions('15m');
      expect(options.length).toBe(96);
    });

    it('should respect min time', () => {
      const options = generateTimeOptions('30m', '9:00 AM');
      expect(options[0].value.getHours()).toBe(9);
      expect(options[0].value.getMinutes()).toBe(0);
    });

    it('should respect max time', () => {
      const options = generateTimeOptions('1h', null, '5:00 PM');
      const lastOption = options[options.length - 1];
      expect(lastOption.value.getHours()).toBeLessThanOrEqual(17);
    });

    it('should disable options outside min/max bounds', () => {
      const options = generateTimeOptions('1h', '9:00 AM', '5:00 PM');
      const firstOption = options.find((opt) => opt.value.getHours() === 9);
      const lastOption = options.find((opt) => opt.value.getHours() === 17);
      expect(firstOption?.disabled).toBeFalsy();
      expect(lastOption?.disabled).toBeFalsy();
    });

    it('should include labels for all options', () => {
      const options = generateTimeOptions('1h');
      options.forEach((option) => {
        expect(option.label).toBeTruthy();
        expect(typeof option.label).toBe('string');
      });
    });
  });

  describe('isTimeInBounds', () => {
    it('should return true when no bounds are specified', () => {
      const time = new Date(2024, 0, 1, 14, 30);
      expect(isTimeInBounds(time)).toBe(true);
      expect(isTimeInBounds(time, null, null)).toBe(true);
    });

    it('should return true when time is within bounds', () => {
      const time = new Date(2024, 0, 1, 14, 30);
      const min = new Date(2024, 0, 1, 9, 0);
      const max = new Date(2024, 0, 1, 17, 0);
      expect(isTimeInBounds(time, min, max)).toBe(true);
    });

    it('should return false when time is before min', () => {
      const time = new Date(2024, 0, 1, 8, 30);
      const min = new Date(2024, 0, 1, 9, 0);
      expect(isTimeInBounds(time, min, null)).toBe(false);
    });

    it('should return false when time is after max', () => {
      const time = new Date(2024, 0, 1, 18, 0);
      const max = new Date(2024, 0, 1, 17, 0);
      expect(isTimeInBounds(time, null, max)).toBe(false);
    });

    it('should return true when time equals min', () => {
      const time = new Date(2024, 0, 1, 9, 0);
      const min = new Date(2024, 0, 1, 9, 0);
      expect(isTimeInBounds(time, min, null)).toBe(true);
    });

    it('should return true when time equals max', () => {
      const time = new Date(2024, 0, 1, 17, 0);
      const max = new Date(2024, 0, 1, 17, 0);
      expect(isTimeInBounds(time, null, max)).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(isTimeInBounds(new Date('invalid'))).toBe(false);
      expect(isTimeInBounds(null as never)).toBe(false);
    });

    it('should ignore date portion and only compare time', () => {
      const time = new Date(2024, 5, 15, 14, 30);
      const min = new Date(2025, 1, 1, 9, 0);
      const max = new Date(2023, 11, 31, 17, 0);
      expect(isTimeInBounds(time, min, max)).toBe(true);
    });
  });

  describe('isSameTime', () => {
    it('should return true for same time on different dates', () => {
      const time1 = new Date(2024, 0, 1, 14, 30);
      const time2 = new Date(2025, 5, 15, 14, 30);
      expect(isSameTime(time1, time2)).toBe(true);
    });

    it('should return false for different times', () => {
      const time1 = new Date(2024, 0, 1, 14, 30);
      const time2 = new Date(2024, 0, 1, 15, 30);
      expect(isSameTime(time1, time2)).toBe(false);
    });

    it('should return false when one time is null', () => {
      const time = new Date(2024, 0, 1, 14, 30);
      expect(isSameTime(time, null)).toBe(false);
      expect(isSameTime(null, time)).toBe(false);
    });

    it('should return false for invalid dates', () => {
      const time1 = new Date('invalid');
      const time2 = new Date(2024, 0, 1, 14, 30);
      expect(isSameTime(time1, time2)).toBe(false);
    });

    it('should ignore seconds when comparing', () => {
      const time1 = new Date(2024, 0, 1, 14, 30, 0);
      const time2 = new Date(2024, 0, 1, 14, 30, 45);
      expect(isSameTime(time1, time2)).toBe(true);
    });
  });
});
