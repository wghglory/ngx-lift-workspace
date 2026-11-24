const STORAGE_KEY = 'demo-lang';
const LEGACY_STORAGE_KEY = 'clr-lift-lang';

/**
 * Reads the demo's own language preference; the library never owns this storage.
 * The legacy key is read only as a migration fallback; new selections use `demo-lang`.
 *
 * @returns The stored language, or undefined when neither key is present or storage is unavailable.
 */
export function readDemoLanguagePreference(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  try {
    return localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Stores the demo's own language preference.
 *
 * @param language - Language tag to remember for the next visit.
 */
export function storeDemoLanguagePreference(language: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // ignore storage errors
  }
}
