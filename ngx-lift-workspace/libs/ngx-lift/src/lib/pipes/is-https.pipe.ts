import {Pipe, PipeTransform} from '@angular/core';

import {isHttps} from '../utils';

@Pipe({
  name: 'isHttps',
})
export class IsHttpsPipe implements PipeTransform {
  transform(value: string): boolean {
    return isHttps(value);
  }
}
