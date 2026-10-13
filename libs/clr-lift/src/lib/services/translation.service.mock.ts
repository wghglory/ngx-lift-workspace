/* eslint-disable @typescript-eslint/no-unused-vars */
import {computed, signal} from '@angular/core';

/** @deprecated Compatibility test mock. Use the real TranslationService with fixture dictionaries to test localization. */
export class MockTranslationService {
  readonly currentLanguage = signal('en');
  readonly locale = computed(() => this.currentLanguage());

  translate(key: string, ...args: unknown[]): string {
    return 'TranslatedText';
  }

  translateWithLanguage(key: string, targetLang: string, ...args: unknown[]): string {
    return this.translate(key, ...args);
  }

  setLanguage(lang: string, persist = true): void {
    this.currentLanguage.set(lang);
  }

  getLanguage(): string {
    return this.currentLanguage();
  }

  loadTranslationsForComponent(componentKey: string, translationsToAdd: Record<string, Record<string, string>>) {
    // Mock implementation
  }
}
