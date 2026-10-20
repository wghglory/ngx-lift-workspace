import {TestBed} from '@angular/core/testing';
import {ClrHeader} from '@clr/angular';
import {vi} from 'vitest';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the shared favicon as the named home link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const home = compiled.querySelector('.branding a');
    expect(home?.getAttribute('aria-label')).toBe('ngx-lift and clr-lift home');
    expect(home?.querySelector('img')?.getAttribute('src')).toBe('favicon.svg');
    expect(home?.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(home?.textContent?.trim()).toBe('');
  });
  it.each([
    [1, '.header-hamburger-trigger'],
    [2, '.header-overflow-trigger'],
  ] as const)('closes navigation level %s and restores trigger focus', (level, selector) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const header = {openNavLevel: level, closeOpenNav: vi.fn()} as unknown as ClrHeader;
    const focus = vi.spyOn(fixture.nativeElement.querySelector(selector), 'focus');
    fixture.componentInstance.closeNavigation(header);
    expect(header.closeOpenNav).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledOnce();
  });

  it('leaves closed navigation and focus unchanged', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const header = {openNavLevel: null, closeOpenNav: vi.fn()} as unknown as ClrHeader;
    const query = vi.spyOn(fixture.nativeElement, 'querySelector');
    fixture.componentInstance.closeNavigation(header);
    expect(header.closeOpenNav).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
  });

  it.each([
    [1, true, true],
    [2, true, true],
    [null, true, false],
    [1, false, false],
    [2, false, false],
  ])('resets level %s on desktop=%s only when open', (level, desktop, shouldClose) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const matchMedia = vi.fn().mockReturnValue({matches: desktop} as MediaQueryList);
    vi.stubGlobal('matchMedia', matchMedia);
    const header = {openNavLevel: level, closeOpenNav: vi.fn()} as unknown as ClrHeader;
    try {
      fixture.componentInstance.resetDesktopNavigation(header);
      expect(matchMedia).toHaveBeenCalledWith('(min-width: 993px)');
      expect(header.closeOpenNav).toHaveBeenCalledTimes(shouldClose ? 1 : 0);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
