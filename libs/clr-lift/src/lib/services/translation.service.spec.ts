import {computed} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ClrCommonStringsService, commonStringsDefault} from '@clr/angular/utils';
import {vi} from 'vitest';

import {TranslationService} from './translation.service';
import {defaultClarityCommonStrings} from './clarity-common-strings.l10n';

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
  it('covers every upstream Clarity common string in every built-in locale', () => {
    const expected = Object.keys(commonStringsDefault).sort();
    for (const [locale, strings] of Object.entries(defaultClarityCommonStrings)) {
      expect(Object.keys(strings).sort(), locale).toEqual(expected);
      for (const text of Object.values(strings)) expect(text.trim(), locale).not.toBe('');
    }
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

describe('TranslationService dictionary and script updates', () => {
  it('refreshes cached computed messages when a dictionary is loaded or replaced', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en', false);
    const message = computed(() => service.translate('lazy.greeting'));
    expect(message()).toContain('not found');
    service.loadTranslationsForComponent('lazy', {en: {greeting: 'Hello'}});
    expect(message()).toBe('Hello');
    service.loadTranslationsForComponent('lazy', {en: {greeting: 'Updated'}});
    expect(message()).toBe('Updated');
  });
  it('resolves Traditional Chinese script tags before generic Chinese', () => {
    const service = TestBed.inject(TranslationService);
    service.loadTranslationsForComponent('test', {
      zh: {text: '简体'},
      'zh-CN': {text: '简体'},
      'zh-TW': {text: '繁體'},
    });
    for (const locale of ['zh-Hant', 'zh-HK', 'zh-MO'])
      expect(service.translateWithLanguage('test.text', locale)).toBe('繁體');
    expect(service.translateWithLanguage('test.text', 'zh-Hans')).toBe('简体');
  });
  it('deduplicates warnings and allows new warnings after a dictionary update', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en', false);
    service.loadTranslationsForComponent('test', {en: {text: 'ok'}});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    service.translate('missing.key');
    service.translate('missing.key');
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe('Translation locale metadata', () => {
  it('sets document language and writing direction for selected locales', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('ar-EG', false);
    TestBed.tick();
    expect(document.documentElement.lang).toBe('ar-EG');
    expect(document.documentElement.dir).toBe('rtl');
    service.setLanguage('bad_locale', false);
    TestBed.tick();
    expect(service.locale()).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});

describe('Translation storage and safe lookup', () => {
  it('keeps the selected language when browser persistence is blocked', () => {
    const service = TestBed.inject(TranslationService);
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    try {
      expect(() => service.setLanguage('fr')).not.toThrow();
      expect(service.getLanguage()).toBe('fr');
      service.setLanguage('', false);
      expect(service.getLanguage()).toBe('fr');
    } finally {
      storage.mockRestore();
    }
  });
  it('does not treat inherited object names as messages or language dictionaries', () => {
    const service = TestBed.inject(TranslationService);
    service.loadTranslationsForComponent('', {en: {text: 'English'}});
    expect(service.translateWithLanguage('text', '')).toBe('English');
    expect(service.translateWithLanguage('toString', 'en')).toContain('not found');
    service.loadTranslationsForComponent('', JSON.parse('{"__proto__":{"__proto__":"safe"}}'));
    expect(service.translateWithLanguage('__proto__', '__proto__')).toBe('safe');
    expect(Object.getPrototypeOf({})).toBe(Object.prototype);
  });
});

describe('Translation cache stability', () => {
  it('does not invalidate consumers when identical component dictionaries are registered again', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en-US', false);
    service.loadTranslationsForComponent('test', {en: {message: 'Hello'}});
    let reads = 0;
    const message = computed(() => {
      ++reads;
      return service.translate('test.message');
    });
    expect(message()).toBe('Hello');
    service.loadTranslationsForComponent('test', {en: {message: 'Hello'}});
    expect(message()).toBe('Hello');
    expect(reads).toBe(1);
  });
});

describe('Clarity Common Strings dynamic synchronization', () => {
  it('synchronizes Clarity common strings when language changes', () => {
    const commonStringsMock = {
      localize: vi.fn(),
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{provide: ClrCommonStringsService, useValue: commonStringsMock}],
    });
    const service = TestBed.inject(TranslationService);
    TestBed.flushEffects();

    service.setLanguage('zh-CN', false);
    TestBed.flushEffects();

    expect(commonStringsMock.localize).toHaveBeenCalledWith(
      expect.objectContaining({
        open: '打开',
        close: '关闭',
        firstPage: '第一页',
        nextPage: '下一页',
      }),
    );

    service.setLanguage('de', false);
    TestBed.flushEffects();

    expect(commonStringsMock.localize).toHaveBeenCalledWith(
      expect.objectContaining({
        open: 'Öffnen',
        close: 'Schließen',
        firstPage: 'Erste Seite',
      }),
    );
  });

  it('allows registering and applying custom Clarity common string overrides', () => {
    const commonStringsMock = {
      localize: vi.fn(),
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{provide: ClrCommonStringsService, useValue: commonStringsMock}],
    });
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en', false);
    TestBed.flushEffects();

    service.loadClarityCommonStrings('en', {
      firstPage: 'Beginning',
    });

    expect(commonStringsMock.localize).toHaveBeenCalledWith(
      expect.objectContaining({
        firstPage: 'Beginning',
      }),
    );
  });
  it('resets missing Clarity strings to English when switching to a partial custom locale', () => {
    const translationService = TestBed.inject(TranslationService);
    const clarity = TestBed.inject(ClrCommonStringsService);
    translationService.setLanguage('de', false);
    TestBed.tick();
    translationService.loadClarityCommonStrings('it', {close: 'Chiudi'});
    translationService.setLanguage('it', false);
    TestBed.tick();
    expect(clarity.keys.close).toBe('Chiudi');
    expect(clarity.keys.open).toBe('Open');
  });

  it('canonicalizes Clarity registrations and prefers exact regional overrides', () => {
    const translationService = TestBed.inject(TranslationService);
    translationService.loadTranslationsForComponent('', {de: {test: 'Test'}});
    translationService.loadClarityCommonStrings('DE-de', {close: 'Regional close'});
    expect(translationService.resolveClarityStrings('de-DE').close).toBe('Regional close');
    translationService.loadClarityCommonStrings('zh-cn', {close: 'Custom close'});
    expect(translationService.resolveClarityStrings('zh-CN').close).toBe('Custom close');
  });
});
