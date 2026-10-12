import {DOCUMENT} from '@angular/common';
import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

import {ThemeService} from './theme.service';

describe('ThemeService', () => {
  afterEach(() => {
    localStorage.clear();
    document.body.removeAttribute('cds-theme');
    vi.restoreAllMocks();
  });

  it('rejects invalid stored themes and applies the light default', () => {
    localStorage.setItem('cds-theme', 'invalid');
    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('light');
    expect(document.body.getAttribute('cds-theme')).toBe('light');
  });

  it('continues applying a theme when browser storage is inaccessible', () => {
    const deniedStorage = {
      getItem: vi.fn(() => {
        throw new DOMException('Access denied', 'SecurityError');
      }),
      setItem: vi.fn(() => {
        throw new DOMException('Access denied', 'SecurityError');
      }),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {defaultView: {localStorage: deniedStorage}, body: document.body},
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');

    expect(service.theme()).toBe('dark');
    expect(document.body.getAttribute('cds-theme')).toBe('dark');
    expect(deniedStorage.getItem).toHaveBeenCalled();
    expect(deniedStorage.setItem).toHaveBeenCalledWith('cds-theme', 'dark');
  });

  it('supports a server document without browser storage', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {defaultView: null, body: document.body},
        },
      ],
    });
    const service = TestBed.inject(ThemeService);

    expect(() => service.setTheme('dark')).not.toThrow();
    expect(service.theme()).toBe('dark');
  });
});
