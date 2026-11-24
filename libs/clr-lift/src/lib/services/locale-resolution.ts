/** English fallback used when a requested translation is unavailable. */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Resolves a language from the available sources.
 *
 * @param explicit - Application-supplied locale with the highest priority.
 * @param localeId - Angular locale, when present.
 * @param browserLanguage - Browser locale, supplied only on the browser platform.
 * @returns The first non-empty source, or `en`.
 */
export function resolveLocale(explicit?: string | null, localeId?: string | null, browserLanguage?: string): string {
  const configured = explicit?.trim() || localeId?.trim();
  if (configured) return configured;
  return browserLanguage?.trim() || DEFAULT_LANGUAGE;
}
