import {isPlatformBrowser} from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  LOCALE_ID,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideEnvironmentInitializer,
} from '@angular/core';

import {ClrLiftI18nService} from './clr-lift-i18n.service';
import {resolveLocale} from './locale-resolution';

/** Options for {@link provideClrLiftI18n}. */
export interface ClrLiftI18nOptions {
  /**
   * Locale supplied by the application, for example from a user preference or an i18n service.
   * Has the highest priority. Empty values are ignored.
   */
  locale?: string;
}

/**
 * Resolves clr-lift's language before the first render without persisting it.
 *
 * Resolution order: `options.locale`, then Angular's `LOCALE_ID`, then `navigator.language` on the browser only,
 * then `en`. Applications own persistence and forward runtime changes with `ClrLiftI18nService.setLanguage()`.
 *
 * @param options - Optional application-supplied locale; takes priority over the Angular locale.
 * @returns Environment providers that apply the resolved language before the first render.
 *
 * @example
 * ```typescript
 * const appConfig: ApplicationConfig = {
 *   providers: [provideClrLiftI18n({locale: 'fr'})],
 * };
 * ```
 */
export function provideClrLiftI18n(options: ClrLiftI18nOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      const translationService = inject(ClrLiftI18nService);
      const localeId = inject<string>(LOCALE_ID, {optional: true});
      const browserLanguage =
        isPlatformBrowser(inject(PLATFORM_ID)) && typeof navigator !== 'undefined' ? navigator.language : undefined;
      const language = resolveInitialLanguage(options, localeId, browserLanguage);
      translationService.setLanguage(language);
      translationService.syncClrCommonStrings(language);
    }),
  ]);
}

/** Internal test hook for the shared resolution rules; not part of the package barrel. */
export function resolveInitialLanguage(
  options: ClrLiftI18nOptions,
  localeId: string | null,
  browserLanguage?: string,
): string {
  return resolveLocale(options.locale, localeId, browserLanguage);
}
