import {ApplicationRef, inject, Injectable, signal} from '@angular/core';

export const DEFAULT_LANGUAGE = 'en';
export const STORAGE_KEY_LANGUAGE = 'clr-lift-lang';

/**
 * Service for managing translations and localization in the application.
 * Supports multiple languages, reactive language switching, persistence,
 * and component-scoped translation keys.
 *
 * Automatically resolves initial language from localStorage or `navigator.language`
 * with fallback to English ('en').
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private appRef = inject(ApplicationRef, {optional: true});
  private translations: Record<string, Record<string, string>> = {};

  private initialLanguage(): string {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
        if (saved) {
          return saved;
        }
      } catch {
        // ignore localStorage access errors
      }
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language;
    }
    return DEFAULT_LANGUAGE;
  }

  private readonly currentLanguageSignal = signal<string>(this.initialLanguage());

  /** Readonly signal of the active language code (e.g. 'en', 'zh-CN', 'es'). */
  readonly currentLanguage = this.currentLanguageSignal.asReadonly();

  /**
   * Current language code.
   * Maintained as getter and setter for backward compatibility with existing tests and call sites.
   */
  get language(): string {
    return this.currentLanguageSignal();
  }

  set language(val: string) {
    this.setLanguage(val, false);
  }

  /**
   * Loads translations for a specific component.
   * Translations are stored with a prefixed key format: `{componentKey}.{translationKey}`.
   *
   * @param componentKey - The unique key identifying the component (e.g., 'FileReader', 'Alert').
   * @param translationsToAdd - An object mapping language codes to translation key-value pairs.
   *   Format: `{ [language: string]: { [key: string]: string } }`
   */
  loadTranslationsForComponent(componentKey: string, translationsToAdd: Record<string, Record<string, string>>) {
    for (const lang in translationsToAdd) {
      if (!this.translations[lang]) {
        this.translations[lang] = {};
      }

      for (const translationKey in translationsToAdd[lang]) {
        const newKey = componentKey ? `${componentKey}.${translationKey}` : translationKey;
        this.translations[lang][newKey] = translationsToAdd[lang][translationKey];
      }
    }
  }

  /**
   * Sets the active language across all components.
   *
   * @param lang - Target language tag (e.g. 'en', 'zh-CN', 'es', 'de', 'fr', 'ja').
   * @param persist - Whether to store the selection in localStorage (default: true).
   */
  setLanguage(lang: string, persist = true): void {
    if (!lang) {
      return;
    }
    this.currentLanguageSignal.set(lang);
    if (persist && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
      } catch {
        // ignore storage errors
      }
    }
    if (this.appRef) {
      queueMicrotask(() => {
        try {
          this.appRef?.tick();
        } catch {
          // ignore error if tick called during existing cycle or destroyed app
        }
      });
    }
  }

  /**
   * Gets the active language code.
   */
  getLanguage(): string {
    return this.currentLanguageSignal();
  }

  /**
   * Translates a key to its localized string value for a specific target language with optional parameter substitution.
   *
   * @param key - The translation key to look up.
   * @param targetLang - The explicit language tag to translate for.
   * @param args - Optional arguments to substitute into `{0}`, `{1}` placeholders.
   */
  translateWithLanguage(key: string, targetLang: string, ...args: unknown[]): string {
    const language = this.resolveLanguage(targetLang);

    // Check if the current language or its resolved fallback is supported.
    if (!this.translations[language]) {
      console.warn(`${targetLang} is not supported yet.`);
    }

    // Check if the translation for the given key exists in the current language
    if (this.translations[language]?.[key] === undefined) {
      console.warn(
        `${key} is not translated in ${targetLang} yet. Will fallback to English to see if translation is available.`,
      );
    }

    let translation = this.translations[language]?.[key] ?? this.translations[DEFAULT_LANGUAGE]?.[key];

    if (translation === undefined) {
      translation = `!! Key ${key} not found !!`;
    }

    return this.format(translation, ...args);
  }

  /**
   * Translates a key to its localized string value using the reactive active language.
   *
   * @param key - The translation key to look up.
   * @param args - Optional arguments to substitute into `{0}`, `{1}` placeholders.
   */
  translate(key: string, ...args: unknown[]): string {
    return this.translateWithLanguage(key, this.currentLanguageSignal(), ...args);
  }

  /**
   * Resolves target language code against loaded translations with case-insensitivity
   * and regional fallback.
   */
  private resolveLanguage(targetLang: string): string {
    if (!targetLang) {
      return DEFAULT_LANGUAGE;
    }
    if (this.translations[targetLang]) {
      return targetLang;
    }
    const lowerTarget = targetLang.toLowerCase();
    const availableKeys = Object.keys(this.translations);

    // 1. Case-insensitive exact match (e.g. 'zh-CN' <-> 'zh-cn')
    const caseMatch = availableKeys.find((k) => k.toLowerCase() === lowerTarget);
    if (caseMatch) {
      return caseMatch;
    }

    // 2. Base language match (e.g. 'en-US' -> 'en', 'zh-CN' -> 'zh')
    const baseLang = lowerTarget.split('-')[0];
    const baseMatch = availableKeys.find((k) => k.toLowerCase() === baseLang);
    if (baseMatch) {
      return baseMatch;
    }

    // 3. Dialect/regional prefix fallback (e.g. 'zh' -> 'zh-CN', 'zh-SG' -> 'zh-CN')
    const dialectMatch = availableKeys.find((k) => k.toLowerCase().startsWith(`${baseLang}-`));
    if (dialectMatch) {
      return dialectMatch;
    }

    return targetLang;
  }

  /**
   * Formats a string by replacing placeholders with provided arguments.
   */
  private format(format: string, ...args: unknown[]) {
    return format.replace(/{(\d+)}/g, function (match, number) {
      const value = args[Number(number)];
      return value === undefined ? match : String(value);
    });
  }
}
