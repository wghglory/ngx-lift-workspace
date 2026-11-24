import {describe, expect, it} from 'vitest';

import {MockClrLiftI18nService} from './clr-lift-i18n.service.mock';

describe('MockClrLiftI18nService', () => {
  it('exposes a reactive language signal', () => {
    const service = new MockClrLiftI18nService();
    expect(service.currentLanguage()).toBe('en');
    expect(service.locale()).toBe('en');
    expect(service.getLanguage()).toBe('en');
    service.setLanguage('fr');
    expect(service.getLanguage()).toBe('fr');
    expect(service.locale()).toBe('fr');
  });

  it('returns deterministic translations and tolerates registrations', () => {
    const service = new MockClrLiftI18nService();
    expect(service.translate('any.key', 'arg')).toBe('TranslatedText');
    expect(service.translateWithLanguage('any.key', 'fr')).toBe('TranslatedText');
    expect(() => service.loadTranslationsForComponent('component', {en: {}})).not.toThrow();
    expect(service.getLanguage()).toBe('en');
  });
});
