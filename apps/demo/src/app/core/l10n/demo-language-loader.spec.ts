import {TestBed} from '@angular/core/testing';
import {TranslationService} from 'clr-lift';
import {
  initialDemoTranslations,
  loadDemoLanguage,
  resolveDemoLanguage,
  supportedDemoLanguages,
} from './demo-language-loader';

describe('Lazy demo dictionaries', () => {
  it.each(supportedDemoLanguages)('loads %s without changing a newer selection', async (language) => {
    const service = TestBed.inject(TranslationService);
    service.loadTranslationsForComponent('', initialDemoTranslations);
    service.setLanguage('en', false);
    await loadDemoLanguage(service, language);
    expect(service.currentLanguage()).toBe('en');
    expect(service.translateWithLanguage('header.selectLanguage', language)).not.toContain('not found');
  });
  it('chooses known dictionaries for regional and invalid tags', () => {
    expect(resolveDemoLanguage('zh-Hant-HK')).toBe('zh-TW');
    expect(resolveDemoLanguage('zh-Hans-SG')).toBe('zh-CN');
    expect(resolveDemoLanguage('pt-PT')).toBe('pt-BR');
    expect(resolveDemoLanguage('bad_locale')).toBe('en');
    expect(resolveDemoLanguage('unknown')).toBe('en');
  });
});
