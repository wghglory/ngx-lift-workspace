import {Pipe, PipeTransform} from '@angular/core';

/**
 * Angular pipe that joins array elements into a string using a specified separator.
 *
 * @example
 * ```html
 * <!-- Join array with default comma separator -->
 * <div>{{ ['apple', 'banana', 'cherry'] | arrayJoin }}</div>
 * <!-- Output: "apple,banana,cherry" -->
 *
 * <!-- Join array with custom separator -->
 * <div>{{ ['apple', 'banana', 'cherry'] | arrayJoin: ' - ' }}</div>
 * <!-- Output: "apple - banana - cherry" -->
 * ```
 */
@Pipe({
  name: 'arrayJoin',
})
export class ArrayJoinPipe implements PipeTransform {
  /**
   * Transforms an array into a string by joining its elements with a separator.
   *
   * @param value - The array to join. If not an array, returns the value as-is.
   * @param separator - The separator string to use between array elements. Defaults to ','.
   * @returns A string containing the joined array elements, or the original value if not an array
   */
  transform(value: unknown, separator = ','): string | unknown {
    if (Array.isArray(value)) {
      return value.join(separator);
    }

    // For non-array cases or unexpected types, return the value as is
    return value;
  }
}
