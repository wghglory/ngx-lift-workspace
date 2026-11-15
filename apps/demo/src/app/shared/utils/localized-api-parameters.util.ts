import {computed, Signal} from '@angular/core';
import {TranslationService} from 'clr-lift';

import {ApiProperty} from '../components/api-table';

/** One documented API parameter whose description comes from the active locale. */
export interface LocalizedApiParameter {
  name: string;
  type?: string;
  descriptionKey: string;
}

/**
 * Builds the localized API table rows for a demo page.
 *
 * @param translations Service that owns the active language and the demo dictionaries.
 * @param parameters Parameter names, types and translation keys, in display order.
 * @returns A signal of API rows that recomputes when the language changes.
 *
 * @example
 * ```typescript
 * readonly parameters = localizedApiParameters(this.translationService, [
 *   {name: 'obj', type: 'unknown', descriptionKey: 'objectPath.paramObj'},
 * ]);
 * ```
 */
export function localizedApiParameters(
  translations: TranslationService,
  parameters: readonly LocalizedApiParameter[],
): Signal<ApiProperty[]> {
  return computed<ApiProperty[]>(() => {
    translations.currentLanguage();
    return parameters.map(({name, type, descriptionKey}) => ({
      name,
      type,
      description: translations.translate(descriptionKey),
    }));
  });
}
