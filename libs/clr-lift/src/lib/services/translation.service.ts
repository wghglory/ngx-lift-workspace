import {Injectable} from '@angular/core';

const DEFAULT_LANGUAGE = 'en';

/**
 * Service for managing translations and localization in the application.
 * Supports multiple languages and component-scoped translation keys.
 *
 * The service automatically uses the browser's language (`navigator.language`) and falls back
 * to English if a translation is not available in the current language.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: Record<string, Record<string, string>> = {};
  private language = navigator.language;

  /**
   * Loads translations for a specific component.
   * Translations are stored with a prefixed key format: `{componentKey}.{translationKey}`.
   *
   * @param componentKey - The unique key identifying the component (e.g., 'FileReader', 'Alert').
   * @param translationsToAdd - An object mapping language codes to translation key-value pairs.
   *   Format: `{ [language: string]: { [key: string]: string } }`
   *
   * @example
   * ```typescript
   * translationService.loadTranslationsForComponent('FileReader', {
   *   en: {
   *     selectFile: 'Select File',
   *     removeFile: 'Remove File'
   *   },
   *   fr: {
   *     selectFile: 'Sélectionner un fichier',
   *     removeFile: 'Supprimer le fichier'
   *   }
   * });
   * // Keys will be stored as 'FileReader.selectFile', 'FileReader.removeFile', etc.
   * ```
   */
  loadTranslationsForComponent(componentKey: string, translationsToAdd: Record<string, Record<string, string>>) {
    for (const lang in translationsToAdd) {
      if (!this.translations[lang]) {
        this.translations[lang] = {};
      }

      for (const translationKey in translationsToAdd[lang]) {
        const newKey = componentKey + '.' + translationKey;
        this.translations[lang][newKey] = translationsToAdd[lang][translationKey];
      }
    }
  }

  /**
   * Translates a key to its localized string value with optional parameter substitution.
   *
   * The method:
   * - Looks up the translation in the current browser language
   * - Falls back to English if the translation is not found
   * - Substitutes parameters using placeholders like `{0}`, `{1}`, etc.
   * - Returns a warning message if the key is not found in any language
   *
   * @param key - The translation key to look up.
   * @param args - Optional arguments to substitute into the translation string.
   *   Placeholders in the format `{0}`, `{1}`, etc. will be replaced with the corresponding argument.
   * @returns The translated string with parameters substituted, or a fallback message if the key is not found.
   *
   * @example
   * ```typescript
   * // Simple translation
   * translationService.translate('common.save'); // Returns: 'Save'
   *
   * // Translation with parameters
   * translationService.translate('user.greeting', 'John', 'Admin');
   * // Translation: 'Hello {0}, you are {1}'
   * // Returns: 'Hello John, you are Admin'
   * ```
   */
  translate(key: string, ...args: string[]): string {
    // Check if the current language is supported
    if (!(this.language in this.translations)) {
      console.warn(`${this.language} is not supported yet.`);
    }

    // Check if the translation for the given key exists in the current language
    if (!this.translations[this.language]?.[key]) {
      console.warn(
        `${key} is not translated in ${this.language} yet. Will fallback to English to see if translation is available.`,
      );
    }

    let translation = this.translations[this.language]?.[key] || this.translations[DEFAULT_LANGUAGE]?.[key];

    if (!translation) {
      translation = `!! Key ${key} not found !!`;
    }

    return this.format(translation, ...args);
  }

  /**
   * Formats a string by replacing placeholders with provided arguments.
   *
   * @param format - The format string containing placeholders like `{0}`, `{1}`, etc.
   * @param args - The arguments to substitute into the placeholders.
   * @returns The formatted string with placeholders replaced.
   *
   * @example
   * ```typescript
   * format('Hello {0}, you are {1}', 'John', 'Admin');
   * // Returns: 'Hello John, you are Admin'
   * ```
   */
  private format(format: string, ...args: string[]) {
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }
}
