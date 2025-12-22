/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject, Pipe, PipeTransform} from '@angular/core';

import {TranslationService} from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key = '', ...args: any[]) {
    return this.translationService.translate(key, ...args);
  }
}
