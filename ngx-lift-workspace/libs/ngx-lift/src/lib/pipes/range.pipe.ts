import {Pipe, PipeTransform} from '@angular/core';

import {range} from '../utils';

/**
 * Angular pipe that generates an array of numbers within a specified range.
 *
 * @example
 * ```html
 * <!-- Generate array from 0 to 4 -->
 * <div *ngFor="let i of [5] | range">{{ i }}</div>
 *
 * <!-- Generate array from 1 to 5 -->
 * <div *ngFor="let i of [1, 5] | range">{{ i }}</div>
 *
 * <!-- Generate array from 0 to 10 with step 2 -->
 * <div *ngFor="let i of [0, 10, 2] | range">{{ i }}</div>
 * ```
 */
@Pipe({
  name: 'range',
})
export class RangePipe implements PipeTransform {
  /**
   * Transforms the input value into an array of numbers.
   *
   * @param value - An array containing:
   *   - `[number]`: The end value (starts from 0)
   *   - `[number, number]`: The start and end values
   *   - `[number, number, number]`: The start, end, and step values
   *   - `[number, number, number, boolean]`: The start, end, step, and inclusive flag
   * @returns An array of numbers within the specified range
   */
  transform(value: [number]): number[];
  transform(value: [number, number]): number[];
  transform(value: [number, number, number]): number[];
  transform(value: [number, number, number, boolean]): number[];
  transform(value: unknown): number[] {
    const input = value as [number, number, number, boolean];
    return range(...input);
  }
}
