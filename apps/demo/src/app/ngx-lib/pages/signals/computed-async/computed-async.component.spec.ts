import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';

import {ComputedAsyncComponent} from './computed-async.component';

describe('ComputedAsyncComponent', () => {
  let component: ComputedAsyncComponent;
  let fixture: ComponentFixture<ComputedAsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedAsyncComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en', false);
    fixture = TestBed.createComponent(ComputedAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle tab switching, survive aborted request, and recover on subsequent tab switch', async () => {
    // Initial tab loads active directory
    expect(component.selectedTab()).toBe('activeDirectory');

    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();
    expect(component.tabState().data?.title).toBe('Active Directory Domains');

    // Switch to simulated aborted request (simulates canceled HTTP request)
    component.selectTab('aborted');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();

    expect(component.tabState().error).toBeTruthy();

    // Verify stream resilience: subsequent tab switch still executes and recovers
    component.selectTab('backupLocations');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();

    expect(component.tabState().error).toBeNull();
    expect(component.tabState().data?.title).toBe('Backup & Storage Locations');
  });
  it('renders a typed fallback on failure and recovers after the source changes', () => {
    const update = () => {
      fixture.detectChanges();
      TestBed.tick();
      fixture.detectChanges();
    };
    const value = () => fixture.nativeElement.querySelector('[data-testid="computed-fallback-value"]').textContent;
    expect(component.fallbackValue()).toBe(42);
    component.fallbackFails.set(true);
    update();
    expect(component.fallbackValue()).toBe(0);
    expect(value()).toContain('0');
    component.fallbackFails.set(false);
    update();
    expect(component.fallbackValue()).toBe(42);
    expect(value()).toContain('42');
  });

  it('catches default errors only when read and shows a successful read after recovery', () => {
    const update = () => {
      fixture.detectChanges();
      TestBed.tick();
      fixture.detectChanges();
    };
    component.readDefaultValue();
    expect(component.lastReadValue()).toBe(42);
    component.sourceFails.set(true);
    expect(update).not.toThrow();
    expect(component.lastReadValue()).toBe(42);
    expect(component.lastReadFailed()).toBe(false);
    expect(() => component.readDefaultValue()).not.toThrow();
    update();
    expect(component.lastReadFailed()).toBe(true);
    expect(component.lastReadValue()).toBeUndefined();
    expect(
      fixture.nativeElement.querySelector('[data-testid="computed-last-read"] cll-alert [role="alert"]').textContent,
    ).toContain('The read threw');
    component.sourceFails.set(false);
    update();
    expect(component.lastReadFailed()).toBe(true);
    component.readDefaultValue();
    update();
    expect(component.lastReadValue()).toBe(42);
    expect(component.lastReadFailed()).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-testid="computed-last-read"]').textContent).toContain('42');
  });
});
