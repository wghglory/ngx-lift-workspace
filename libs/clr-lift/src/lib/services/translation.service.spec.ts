import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

import {TranslationService} from './translation.service';

describe('TranslationService', () => {
  let translationService: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    translationService = TestBed.inject(TranslationService);

    translationService['language'] = 'en';
  });

  it('should be created', () => {
    expect(translationService).toBeTruthy();
  });

  it('should load translations for a component', () => {
    const componentKey = 'testComponent';
    const translationsToAdd = {
      en: {
        key1: 'English translation 1',
        key2: 'English translation 2',
      },
      es: {
        key1: 'Spanish translation 1',
        key2: 'Spanish translation 2',
      },
    };

    translationService.loadTranslationsForComponent(componentKey, translationsToAdd);

    expect(translationService['translations']['en']['testComponent.key1']).toBe('English translation 1');
    expect(translationService['translations']['es']['testComponent.key2']).toBe('Spanish translation 2');
  });

  it('should load translations with empty componentKey (root-level translations)', () => {
    const translationsToAdd = {
      en: {
        'root.key1': 'Root English 1',
      },
      de: {
        'root.key1': 'Root Deutsch 1',
      },
    };

    translationService.loadTranslationsForComponent('', translationsToAdd);

    expect(translationService['translations']['en']['root.key1']).toBe('Root English 1');
    expect(translationService['translations']['de']['root.key1']).toBe('Root Deutsch 1');
  });

  it('should translate a key using default English', () => {
    translationService.loadTranslationsForComponent('testComponent', {
      en: {
        greeting: 'Hello, {0}!',
      },
      es: {
        greeting: 'Hola, {0}!',
      },
    });

    const englishTranslation = translationService.translate('testComponent.greeting', 'John');

    expect(englishTranslation).toBe('Hello, John!');
  });

  it('should translate a key with arguments', () => {
    translationService.loadTranslationsForComponent('testComponent', {
      en: {
        greeting: 'Hello, {0}!',
      },
      es: {
        greeting: 'Hola, {0}!',
      },
    });

    translationService['language'] = 'es';

    const spanishTranslation = translationService.translate('testComponent.greeting', 'Juan');

    expect(spanishTranslation).toBe('Hola, Juan!');
  });

  it('should handle unsupported language gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Mock implementation
    });

    translationService.translate('someKey');

    expect(consoleWarnSpy).toHaveBeenCalledWith('en is not supported yet.');
    consoleWarnSpy.mockRestore();
  });

  it('should handle missing translation gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Mock implementation
    });

    translationService.loadTranslationsForComponent('testComponent', {
      es: {
        key1: 'Spanish translation 1',
      },
    });

    const missingTranslation = translationService.translate('testComponent.key2');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'testComponent.key2 is not translated in en yet. Will fallback to English to see if translation is available.',
    );
    expect(missingTranslation).toBe('!! Key testComponent.key2 not found !!');
    consoleWarnSpy.mockRestore();
  });

  it('should handle missing translation in default language', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Mock implementation
    });

    const missingTranslation = translationService.translate('someKey');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'someKey is not translated in en yet. Will fallback to English to see if translation is available.',
    );
    expect(missingTranslation).toBe('!! Key someKey not found !!');
    consoleWarnSpy.mockRestore();
  });

  it('should format translation with arguments', () => {
    translationService.loadTranslationsForComponent('testComponent', {
      en: {
        greeting: 'Hello, {0}!',
      },
    });

    const formattedTranslation = translationService.translate('testComponent.greeting', 'John');

    expect(formattedTranslation).toBe('Hello, John!');
  });
  it('falls back from a regional browser locale to its supported base language', () => {
    translationService.loadTranslationsForComponent('example', {
      en: {greeting: 'Hello'},
      es: {greeting: 'Hola'},
    });
    translationService['language'] = 'es-MX';

    expect(translationService.translate('example.greeting')).toBe('Hola');
  });

  it('preserves intentionally empty translations', () => {
    translationService.loadTranslationsForComponent('example', {
      en: {greeting: 'Hello'},
      es: {greeting: ''},
    });
    translationService['language'] = 'es';

    expect(translationService.translate('example.greeting')).toBe('');
  });

  it('updates language reactively with setLanguage and currentLanguage signal', () => {
    translationService.loadTranslationsForComponent('example', {
      en: {greeting: 'Hello'},
      'zh-CN': {greeting: '你好'},
    });

    translationService.setLanguage('zh-CN', false);

    expect(translationService.currentLanguage()).toBe('zh-CN');
    expect(translationService.getLanguage()).toBe('zh-CN');
    expect(translationService.translate('example.greeting')).toBe('你好');
  });

  it('supports explicit target language with translateWithLanguage', () => {
    translationService.loadTranslationsForComponent('example', {
      en: {greeting: 'Hello'},
      es: {greeting: 'Hola'},
      fr: {greeting: 'Bonjour'},
    });

    translationService.setLanguage('en', false);

    expect(translationService.translateWithLanguage('example.greeting', 'fr')).toBe('Bonjour');
    expect(translationService.translateWithLanguage('example.greeting', 'es')).toBe('Hola');
  });
});
