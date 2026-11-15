/**
 * Shared value predicates for the standard validators.
 *
 * This module is deliberately not exported from `validators/index.ts`: the parsing rules are an
 * implementation detail, not a public contract.
 */

const DECIMAL_NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const INTEGER_PATTERN = /^[+-]?\d+$/;

/** A value a form control reports when it has no user input. */
export function isEmptyControlValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

/**
 * Parses a finite number from a number or a decimal/exponential string.
 *
 * Hexadecimal strings, booleans, arrays, blank strings and non-finite numbers are not numeric
 * input and return `null` so that callers can treat them as "not comparable" instead of zero.
 */
export function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && DECIMAL_NUMBER_PATTERN.test(value.trim())) {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Parses a safe integer from a number or a signed decimal integer string.
 *
 * Decimal fractions, exponent notation, hexadecimal strings and values outside the safe integer
 * range are rejected; JavaScript would otherwise silently round or coerce them.
 */
export function parseSafeInteger(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) ? value : null;
  }
  if (typeof value === 'string' && INTEGER_PATTERN.test(value.trim())) {
    const parsed = Number(value.trim());
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}
