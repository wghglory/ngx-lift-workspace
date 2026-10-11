import {ChangeDetectorRef, effect, inject, Pipe, PipeTransform} from '@angular/core';

import {TranslationService} from '../services/translation.service';

/**
 * Angular pipe that translates a translation key to its localized string value.
 * Supports parameter substitution using placeholders like `{0}`, `{1}`, etc.
 *
 * Configured as impure (`pure: false`) so template bindings update reactively
 * whenever the active language changes via `TranslationService.setLanguage(...)`.
 *
 * @example
 * ```html
 * <!-- Simple translation -->
 * <div>{{ 'common.save' | translate }}</div>
 *
 * <!-- Translation with parameters -->
 * <div>{{ 'user.greeting' | translate: userName: userRole }}</div>
 * ```
 */
@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef, {optional: true});

  constructor() {
    if (typeof this.translationService?.currentLanguage === 'function') {
      effect(() => {
        this.translationService.currentLanguage();
        this.cdr?.markForCheck();
      });
    }
  }

  /**
   * Transforms a translation key into its localized string value.
   *
   * @param key - The translation key to look up. Defaults to empty string.
   * @param args - Optional arguments to substitute into the translation string.
   *   Placeholders in the format `{0}`, `{1}`, etc. will be replaced with the corresponding argument.
   * @returns The translated string with parameters substituted, or a fallback message if the key is not found.
   */
  transform(key = '', ...args: unknown[]) {
    return this.translationService.translate(key, ...args);
  }
}
