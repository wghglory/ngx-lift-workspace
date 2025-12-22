import {Pipe, PipeTransform} from '@angular/core';

import {range} from '../utils';

@Pipe({
  name: 'range',
  standalone: true,
})
export class RangePipe implements PipeTransform {
  transform(value: [number]): number[];
  transform(value: [number, number]): number[];
  transform(value: [number, number, number]): number[];
  transform(value: [number, number, number, boolean]): number[];
  transform(value: unknown): number[] {
    const input = value as [number, number, number, boolean];
    return range(...input);
  }
}
