import {TestBed} from '@angular/core/testing';

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
    spyOn(console, 'warn');

    translationService.translate('someKey');

    expect(console.warn).toHaveBeenCalledWith('en is not supported yet.');
  });

  it('should handle missing translation gracefully', () => {
    spyOn(console, 'warn');

    translationService.loadTranslationsForComponent('testComponent', {
      es: {
        key1: 'Spanish translation 1',
      },
    });

    const missingTranslation = translationService.translate('testComponent.key2');

    expect(console.warn).toHaveBeenCalledWith(
      'testComponent.key2 is not translated in en yet. Will fallback to English to see if translation is available.',
    );
    expect(missingTranslation).toBe('!! Key testComponent.key2 not found !!');
  });

  it('should handle missing translation in default language', () => {
    spyOn(console, 'warn');

    const missingTranslation = translationService.translate('someKey');

    expect(console.warn).toHaveBeenCalledWith(
      'someKey is not translated in en yet. Will fallback to English to see if translation is available.',
    );
    expect(missingTranslation).toBe('!! Key someKey not found !!');
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
});
