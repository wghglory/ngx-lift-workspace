import {DOCUMENT} from '@angular/common';
import {LOCALE_ID, PLATFORM_ID} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ClrCommonStringsService} from '@clr/angular/utils';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {provideClrLiftI18n, resolveInitialLanguage} from './i18n-providers';
import {ClrLiftI18nService} from './clr-lift-i18n.service';

describe('provideClrLiftI18n', () => {
  const browserLanguage = 'de-DE';

  function configure(providers: Parameters<typeof TestBed.configureTestingModule>[0]['providers']): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({providers: [{provide: PLATFORM_ID, useValue: 'browser'}, ...providers]});
  }

  beforeEach(() => {
    vi.stubGlobal('navigator', {language: browserLanguage});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    TestBed.inject(DOCUMENT).documentElement.setAttribute('dir', 'ltr');
  });

  it('uses an explicit preference over the Angular and browser locale', () => {
    configure([provideClrLiftI18n({locale: 'fr'}), {provide: LOCALE_ID, useValue: 'ja'}]);
    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('fr');
  });

  it('favors LOCALE_ID over the browser locale', () => {
    configure([provideClrLiftI18n(), {provide: LOCALE_ID, useValue: 'ja'}]);
    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('ja');
  });

  it('uses the browser locale only as a fallback when no Angular locale is configured', () => {
    expect(resolveInitialLanguage({}, null, browserLanguage)).toBe(browserLanguage);
  });

  it('ignores the server navigator and uses LOCALE_ID on the server', () => {
    configure([provideClrLiftI18n(), {provide: PLATFORM_ID, useValue: 'server'}, {provide: LOCALE_ID, useValue: 'ja'}]);
    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('ja');
  });

  it('uses LOCALE_ID on the server when navigator is absent', () => {
    vi.stubGlobal('navigator', undefined);
    configure([provideClrLiftI18n(), {provide: PLATFORM_ID, useValue: 'server'}, {provide: LOCALE_ID, useValue: 'ja'}]);
    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('ja');
  });

  it('ignores the server navigator even without an Angular locale', () => {
    configure([provideClrLiftI18n(), {provide: PLATFORM_ID, useValue: 'server'}, {provide: LOCALE_ID, useValue: ''}]);
    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('en');
  });

  it('falls back to English when no locale source exists', () => {
    expect(resolveInitialLanguage({}, null)).toBe('en');
    expect(resolveInitialLanguage({locale: '  '}, null, '   ')).toBe('en');
  });

  it('ignores an empty explicit locale', () => {
    configure([provideClrLiftI18n({locale: '  '}), {provide: LOCALE_ID, useValue: 'ja'}]);
    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('ja');
  });

  it('uses English dictionary fallback for an invalid locale tag', () => {
    configure([provideClrLiftI18n({locale: '!!bad!!'})]);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const translation = TestBed.inject(ClrLiftI18nService);
    translation.loadTranslationsForComponent('provider-test', {en: {label: 'Fallback label'}});
    expect(translation.translate('provider-test.label')).toBe('Fallback label');
  });

  it('does not read or write a stored language', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    configure([provideClrLiftI18n({locale: 'fr'})]);

    expect(TestBed.inject(ClrLiftI18nService).getLanguage()).toBe('fr');
    expect(getItem).not.toHaveBeenCalledWith('clr-lift-lang');
    expect(setItem).not.toHaveBeenCalledWith('clr-lift-lang', 'fr');
  });

  it('applies Clarity strings and document language before first render', () => {
    configure([provideClrLiftI18n({locale: 'de'})]);
    TestBed.inject(ClrLiftI18nService);
    TestBed.flushEffects();
    expect(TestBed.inject(ClrCommonStringsService).keys.previousPage).toBe('Vorherige Seite');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('de');
    expect(TestBed.inject(DOCUMENT).documentElement.dir).toBe('ltr');
  });

  it('sets right-to-left direction for an RTL locale', () => {
    configure([provideClrLiftI18n({locale: 'ar'})]);
    TestBed.inject(ClrLiftI18nService);
    TestBed.flushEffects();
    expect(TestBed.inject(DOCUMENT).documentElement.dir).toBe('rtl');
  });

  it('keeps runtime switching and Clarity synchronization available after bootstrap', () => {
    configure([provideClrLiftI18n({locale: 'fr'})]);
    const translation = TestBed.inject(ClrLiftI18nService);
    translation.setLanguage('zh-CN');
    TestBed.flushEffects();
    expect(translation.getLanguage()).toBe('zh-CN');
    expect(translation.currentLanguage()).toBe('zh-CN');
    expect(TestBed.inject(ClrCommonStringsService).keys.previousPage).toBe('上一页');
  });
});
