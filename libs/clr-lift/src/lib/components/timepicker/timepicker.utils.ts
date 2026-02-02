import {TimepickerOption} from './timepicker.types';

/**
 * Parse a time string into a Date object.
 * Supports multiple formats: "2:30 PM", "14:30", "14.30", "2:30pm", "02:30:00".
 *
 * The date portion will be set to today's date (or baseDate if provided).
 * Only the time portion (hours, minutes, seconds) is relevant for the timepicker.
 *
 * @param timeStr - The time string to parse
 * @param baseDate - Optional base date to use (defaults to today)
 * @returns Date object with the parsed time, or null if parsing fails
 *
 * @example
 * ```typescript
 * parseTimeString('2:30 PM');        // Date with 14:30
 * parseTimeString('14:30');          // Date with 14:30
 * parseTimeString('14.30');          // Date with 14:30
 * parseTimeString('2:30pm');         // Date with 14:30
 * parseTimeString('invalid');        // null
 * ```
 */
export function parseTimeString(timeStr: string, baseDate?: Date): Date | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null;
  }

  const trimmed = timeStr.trim();
  if (!trimmed) {
    return null;
  }

  const base = baseDate ? new Date(baseDate) : new Date();

  // Try parsing with 12-hour format (with AM/PM)
  const time12hRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)$/i;
  const match12h = trimmed.match(time12hRegex);

  if (match12h) {
    let hours = parseInt(match12h[1], 10);
    const minutes = parseInt(match12h[2], 10);
    const seconds = match12h[3] ? parseInt(match12h[3], 10) : 0;
    const period = match12h[4].toLowerCase();

    if (hours < 1 || hours > 12 || minutes > 59 || seconds > 59) {
      return null;
    }

    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }

    base.setHours(hours, minutes, seconds, 0);
    return base;
  }

  // Try parsing with 24-hour format (colon or dot separator)
  const time24hRegex = /^(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?$/;
  const match24h = trimmed.match(time24hRegex);

  if (match24h) {
    const hours = parseInt(match24h[1], 10);
    const minutes = parseInt(match24h[2], 10);
    const seconds = match24h[3] ? parseInt(match24h[3], 10) : 0;

    if (hours > 23 || minutes > 59 || seconds > 59) {
      return null;
    }

    base.setHours(hours, minutes, seconds, 0);
    return base;
  }

  return null;
}

/**
 * Format a Date object to a time string based on the browser's locale.
 * Uses Intl.DateTimeFormat for locale-aware formatting.
 *
 * @param date - The date to format
 * @param locale - Optional locale string (defaults to browser locale)
 * @returns Formatted time string (e.g., '2:30 PM' or '14:30')
 *
 * @example
 * ```typescript
 * const date = new Date(2024, 0, 1, 14, 30);
 * formatTime(date);              // '2:30 PM' (in en-US locale)
 * formatTime(date, 'en-GB');     // '14:30' (in en-GB locale)
 * formatTime(date, 'de-DE');     // '14:30' (in de-DE locale)
 * ```
 */
export function formatTime(date: Date, locale?: string): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const localeToUse = locale || navigator.language;

  try {
    return new Intl.DateTimeFormat(localeToUse, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    // Fallback to default locale if specified locale is invalid
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }
}

/**
 * Parse an interval string to minutes.
 * Supports various formats:
 * - Number: interpreted as minutes (e.g., 30)
 * - Short units: '30m', '1h', '90s' (m/M = minutes, h/H = hours, s/S = seconds)
 * - Long units: '30 minutes', '1.5 hours', '90 seconds'
 *
 * @param interval - The interval to parse
 * @returns Number of minutes, or 30 (default) if parsing fails
 *
 * @example
 * ```typescript
 * parseInterval('30m');          // 30
 * parseInterval('1h');           // 60
 * parseInterval('1.5 hours');    // 90
 * parseInterval('90 minutes');   // 90
 * parseInterval(45);             // 45
 * parseInterval('invalid');      // 30 (default)
 * ```
 */
export function parseInterval(interval: string | number): number {
  if (typeof interval === 'number') {
    return interval > 0 ? interval : 30;
  }

  if (!interval || typeof interval !== 'string') {
    return 30;
  }

  const trimmed = interval.trim().toLowerCase();

  // Try parsing as plain number
  const plainNumber = parseFloat(trimmed);
  if (!isNaN(plainNumber) && trimmed === plainNumber.toString()) {
    return plainNumber > 0 ? plainNumber : 30;
  }

  // Try parsing with short units (e.g., '30m', '1h', '90s')
  const shortUnitRegex = /^([\d.]+)\s*([hms])$/i;
  const shortMatch = trimmed.match(shortUnitRegex);

  if (shortMatch) {
    const value = parseFloat(shortMatch[1]);
    const unit = shortMatch[2].toLowerCase();

    if (isNaN(value) || value <= 0) {
      return 30;
    }

    switch (unit) {
      case 'h':
        return Math.round(value * 60);
      case 'm':
        return Math.round(value);
      case 's':
        return Math.round(value / 60);
      default:
        return 30;
    }
  }

  // Try parsing with long units (e.g., '30 minutes', '1.5 hours')
  const longUnitRegex = /^([\d.]+)\s*(hour|hours|min|minute|minutes|second|seconds)$/i;
  const longMatch = trimmed.match(longUnitRegex);

  if (longMatch) {
    const value = parseFloat(longMatch[1]);
    const unit = longMatch[2].toLowerCase();

    if (isNaN(value) || value <= 0) {
      return 30;
    }

    if (unit.startsWith('hour')) {
      return Math.round(value * 60);
    } else if (unit.startsWith('min')) {
      return Math.round(value);
    } else if (unit.startsWith('second')) {
      return Math.round(value / 60);
    }
  }

  return 30;
}

/**
 * Generate an array of time options based on the specified interval.
 * Options span from midnight (00:00) to 23:59, or within min/max bounds if specified.
 *
 * @param interval - Time interval string or number (in minutes)
 * @param min - Optional minimum time (Date or time string)
 * @param max - Optional maximum time (Date or time string)
 * @param locale - Optional locale for formatting (defaults to browser locale)
 * @returns Array of TimepickerOption objects
 *
 * @example
 * ```typescript
 * // Generate options every 30 minutes
 * generateTimeOptions('30m');
 *
 * // Generate options every hour from 9 AM to 5 PM
 * generateTimeOptions('1h', '9:00 AM', '5:00 PM');
 *
 * // Generate options every 15 minutes
 * generateTimeOptions('15m');
 * ```
 */
export function generateTimeOptions(
  interval: string | number,
  min?: Date | string | null,
  max?: Date | string | null,
  locale?: string,
): TimepickerOption[] {
  const intervalMinutes = parseInterval(interval);
  const options: TimepickerOption[] = [];

  // Parse min/max bounds
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  if (min) {
    minDate = typeof min === 'string' ? parseTimeString(min) : min;
  }

  if (max) {
    maxDate = typeof max === 'string' ? parseTimeString(max) : max;
  }

  // Generate options from 00:00 to 23:59
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Determine the actual start time
  const currentTime = new Date(baseDate);
  if (minDate) {
    const minHours = minDate.getHours();
    const minMinutes = minDate.getMinutes();
    currentTime.setHours(minHours, minMinutes, 0, 0);
  }

  // Determine the actual end time
  const endTime = new Date(endOfDay);
  if (maxDate) {
    const maxHours = maxDate.getHours();
    const maxMinutes = maxDate.getMinutes();
    endTime.setHours(maxHours, maxMinutes, 0, 0);
  }

  // Generate options
  while (currentTime <= endTime) {
    const optionDate = new Date(currentTime);
    const isDisabled = !isTimeInBounds(optionDate, minDate, maxDate);

    options.push({
      value: optionDate,
      label: formatTime(optionDate, locale),
      disabled: isDisabled,
    });

    // Add interval minutes
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);

    // Prevent infinite loop
    if (intervalMinutes <= 0 || options.length > 1000) {
      break;
    }
  }

  return options;
}

/**
 * Check if a time is within the specified min/max bounds.
 * Only compares the time portion (hours, minutes), ignoring the date.
 *
 * @param time - The time to check
 * @param min - Optional minimum time bound
 * @param max - Optional maximum time bound
 * @returns True if time is within bounds, false otherwise
 *
 * @example
 * ```typescript
 * const time = new Date(2024, 0, 1, 14, 30); // 2:30 PM
 * const min = new Date(2024, 0, 1, 9, 0);    // 9:00 AM
 * const max = new Date(2024, 0, 1, 17, 0);   // 5:00 PM
 *
 * isTimeInBounds(time, min, max);  // true
 * isTimeInBounds(time, null, null); // true
 * ```
 */
export function isTimeInBounds(time: Date, min?: Date | null, max?: Date | null): boolean {
  if (!time || !(time instanceof Date) || isNaN(time.getTime())) {
    return false;
  }

  const timeMinutes = time.getHours() * 60 + time.getMinutes();

  if (min && min instanceof Date && !isNaN(min.getTime())) {
    const minMinutes = min.getHours() * 60 + min.getMinutes();
    if (timeMinutes < minMinutes) {
      return false;
    }
  }

  if (max && max instanceof Date && !isNaN(max.getTime())) {
    const maxMinutes = max.getHours() * 60 + max.getMinutes();
    if (timeMinutes > maxMinutes) {
      return false;
    }
  }

  return true;
}

/**
 * Compare two Date objects by their time portions only.
 * Ignores the date portion (year, month, day).
 *
 * @param time1 - First time to compare
 * @param time2 - Second time to compare
 * @returns True if both times have the same hours and minutes
 *
 * @example
 * ```typescript
 * const time1 = new Date(2024, 0, 1, 14, 30);
 * const time2 = new Date(2025, 5, 15, 14, 30);
 * isSameTime(time1, time2);  // true (same time, different dates)
 * ```
 */
export function isSameTime(time1: Date | null, time2: Date | null): boolean {
  if (!time1 || !time2) {
    return false;
  }

  if (!(time1 instanceof Date) || !(time2 instanceof Date)) {
    return false;
  }

  if (isNaN(time1.getTime()) || isNaN(time2.getTime())) {
    return false;
  }

  return time1.getHours() === time2.getHours() && time1.getMinutes() === time2.getMinutes();
}
