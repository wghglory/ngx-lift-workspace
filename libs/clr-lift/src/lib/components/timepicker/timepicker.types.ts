import {InjectionToken} from '@angular/core';

/**
 * Represents a single time option in the timepicker dropdown.
 *
 * @example
 * ```typescript
 * const option: TimepickerOption = {
 *   value: new Date(2024, 0, 1, 14, 30),
 *   label: '2:30 PM',
 *   disabled: false
 * };
 * ```
 */
export interface TimepickerOption {
  /**
   * The Date object representing the time value.
   * Only the time portion (hours, minutes, seconds) is relevant.
   */
  value: Date;

  /**
   * The formatted string to display in the dropdown (e.g., '2:30 PM', '14:30').
   */
  label: string;

  /**
   * Whether this option is disabled and cannot be selected.
   * Defaults to false.
   */
  disabled?: boolean;
}

/**
 * Type for time interval specification.
 * Can be a string (e.g., '30m', '1h', '90 minutes') or a number representing minutes.
 *
 * @example
 * ```typescript
 * const interval1: TimepickerInterval = '30m';
 * const interval2: TimepickerInterval = '1.5 hours';
 * const interval3: TimepickerInterval = 90; // 90 minutes
 * ```
 */
export type TimepickerInterval = string | number;

/**
 * Configuration options for the timepicker component.
 * Can be provided globally via the MAT_TIMEPICKER_CONFIG injection token.
 *
 * @example
 * ```typescript
 * const config: TimepickerConfig = {
 *   interval: '15m',
 *   ariaLabel: 'Select meeting time'
 * };
 * ```
 */
export interface TimepickerConfig {
  /**
   * Default interval between time options.
   * Defaults to '30m' if not specified.
   */
  interval?: TimepickerInterval;

  /**
   * Default ARIA label for timepicker dropdowns.
   */
  ariaLabel?: string;

  /**
   * Default ARIA labelledby for timepicker dropdowns.
   */
  ariaLabelledby?: string;
}

/**
 * Injection token for providing global timepicker configuration.
 *
 * @example
 * ```typescript
 * // In app config or module providers:
 * providers: [
 *   {
 *     provide: MAT_TIMEPICKER_CONFIG,
 *     useValue: { interval: '15m' }
 *   }
 * ]
 * ```
 */
export const MAT_TIMEPICKER_CONFIG = new InjectionToken<TimepickerConfig>('MAT_TIMEPICKER_CONFIG');
