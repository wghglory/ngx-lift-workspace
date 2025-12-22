import {Pipe, PipeTransform} from '@angular/core';

import {isHttps} from '../utils';

@Pipe({
  name: 'isHttps',
  standalone: true,
})
export class IsHttpsPipe implements PipeTransform {
  transform(value: string): boolean {
    return isHttps(value);
  }
}
