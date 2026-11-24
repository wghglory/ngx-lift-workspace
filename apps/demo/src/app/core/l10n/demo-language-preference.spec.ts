import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {readDemoLanguagePreference, storeDemoLanguagePreference} from './demo-language-preference';

describe('demo language preference', () => {
  beforeEach(() => {
    localStorage.removeItem('demo-lang');
    localStorage.removeItem('clr-lift-lang');
  });

  afterEach(() => {
    localStorage.removeItem('demo-lang');
    localStorage.removeItem('clr-lift-lang');
  });

  it('prefers the demo key over the legacy library key', () => {
    localStorage.setItem('demo-lang', 'fr');
    localStorage.setItem('clr-lift-lang', 'de');
    expect(readDemoLanguagePreference()).toBe('fr');
  });

  it('reads the legacy key once for returning visitors', () => {
    localStorage.setItem('clr-lift-lang', 'de');
    expect(readDemoLanguagePreference()).toBe('de');
    storeDemoLanguagePreference('ja');
    expect(readDemoLanguagePreference()).toBe('ja');
  });

  it('returns undefined without a stored preference', () => {
    expect(readDemoLanguagePreference()).toBeUndefined();
  });

  it('returns undefined when the storage getter throws', () => {
    const getter = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    try {
      expect(readDemoLanguagePreference()).toBeUndefined();
      expect(() => storeDemoLanguagePreference('fr')).not.toThrow();
    } finally {
      getter.mockRestore();
    }
  });
});
