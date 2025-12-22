import {Injectable} from '@angular/core';

const DEFAULT_LANGUAGE = 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: Record<string, Record<string, string>> = {};
  private language = navigator.language;

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

  private format(format: string, ...args: string[]) {
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }
}
