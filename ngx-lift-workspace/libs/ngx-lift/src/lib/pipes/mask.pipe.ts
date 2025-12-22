import {Pipe, PipeTransform} from '@angular/core';

const unmaskNumber = 6;
const maskChar = '*';

export interface MaskOptions {
  unmaskedPrefixLength?: number;
  unmaskedSuffixLength?: number;
  masked?: boolean;
}

@Pipe({
  name: 'mask',
  standalone: true,
})
export class MaskPipe implements PipeTransform {
  /**
   * Transforms the input string by masking characters based on the provided options.
   *
   * @param {string} value - The input string to be masked.
   * @param {MaskOptions} [options={}] - Options for customizing the masking behavior.
   * @returns {string} - The masked string.
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
