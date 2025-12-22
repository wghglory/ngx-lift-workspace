import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayJoin',
  standalone: true,
})
export class ArrayJoinPipe implements PipeTransform {
  transform(value: unknown, separator: string = ',') {
    if (Array.isArray(value)) {
      return value.join(separator);
    }

    // For non-array cases or unexpected types, return the value as is
    return value;
  }
}
