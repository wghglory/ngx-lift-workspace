import {Pipe, PipeTransform} from '@angular/core';

const unmaskNumber = 6;
const maskChar = '*';

/**
 * Options for configuring the mask pipe behavior.
 */
export interface MaskOptions {
  /**
   * The number of characters to leave unmasked at the beginning of the string.
   * Defaults to 6.
   */
  unmaskedPrefixLength?: number;

  /**
   * The number of characters to leave unmasked at the end of the string.
   * Defaults to 6.
   */
  unmaskedSuffixLength?: number;

  /**
   * Whether to apply masking. If `false`, the original string is returned unchanged.
   * Defaults to `true`.
   */
  masked?: boolean;
}

/**
 * Angular pipe that masks sensitive string data by replacing characters with asterisks,
 * while preserving a configurable number of characters at the beginning and end.
 *
 * @example
 * ```html
 * <!-- Mask a credit card number -->
 * <div>{{ '1234567890123456' | mask }}</div>
 * <!-- Output: "123456******3456" -->
 *
 * <!-- Custom masking options -->
 * <div>{{ '1234567890123456' | mask: { unmaskedPrefixLength: 4, unmaskedSuffixLength: 4 } }}</div>
 * <!-- Output: "1234********3456" -->
 * ```
 */
@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  /**
   * Transforms the input string by masking characters based on the provided options.
   *
   * @param value - The input string to be masked
   * @param options - Options for customizing the masking behavior
   * @returns The masked string, or the original string if masking is disabled or the string is too short
   */
  transform(value: string, options: MaskOptions = {}): string {
    const {unmaskedPrefixLength = unmaskNumber, unmaskedSuffixLength = unmaskNumber, masked = true} = options;

    if (
      value.length <= unmaskedPrefixLength + unmaskedSuffixLength ||
      unmaskedPrefixLength < 0 ||
      unmaskedSuffixLength < 0 ||
      !masked
    ) {
      return value;
    }

    return value
      .split('')
      .map((char, i) => (i < unmaskedPrefixLength || i > value.length - unmaskedSuffixLength - 1 ? char : maskChar))
      .join('');
  }
}
