import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';
import {describe, expect, it, beforeEach, vi} from 'vitest';

import {demoTranslations} from '../../../../core/l10n/demo.l10n';
import {loadDemoLanguage} from '../../../../core/l10n/demo-language-loader';
import {QueryResourceDemoComponent} from './query-resource.component';

describe('QueryResourceDemoComponent', () => {
  let component: QueryResourceDemoComponent;
  let fixture: ComponentFixture<QueryResourceDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryResourceDemoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    const translationService = TestBed.inject(TranslationService);
    translationService.loadTranslationsForComponent('', demoTranslations);

    fixture = TestBed.createComponent(QueryResourceDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles metric refresh and widget toggle', () => {
    expect(component.metricsQueryA).toBeDefined();
    expect(component.metricsQueryB).toBeDefined();
    component.refreshMetrics();
    expect(component.widgetAShown()).toBe(true);
    component.widgetAShown.set(false);
    expect(component.widgetAShown()).toBe(false);
  });

  it('handles polling toggle', () => {
    expect(component.pollingEnabled()).toBe(false);
    component.togglePolling();
    expect(component.pollingEnabled()).toBe(true);
    component.togglePolling();
    expect(component.pollingEnabled()).toBe(false);
  });

  it('handles user mutation', async () => {
    component.newUserName.set('Test User');
    component.newUserRole.set('Developer');
    component.submitNewUser();
    expect(component.newUserName()).toBe('');
  });

  it('refreshes diagnostics automatically and stops the inspector timer on destroy', async () => {
    vi.useFakeTimers();
    const liveFixture = TestBed.createComponent(QueryResourceDemoComponent);
    const refresh = vi.spyOn(liveFixture.componentInstance, 'refreshDiagnostics');
    try {
      await vi.advanceTimersByTimeAsync(1000);
      expect(refresh).toHaveBeenCalledTimes(1);
      liveFixture.destroy();
      await vi.advanceTimersByTimeAsync(2000);
      expect(refresh).toHaveBeenCalledTimes(1);
    } finally {
      if (!liveFixture.componentRef.hostView.destroyed) liveFixture.destroy();
      vi.useRealTimers();
    }
  });

  it('updates live diagnostics snapshot', () => {
    expect(component.diagnostics()).toBeDefined();
    expect(component.diagnostics().entryCount).toBeGreaterThanOrEqual(0);
    component.refreshDiagnostics();
    expect(component.diagnostics().isVisible).toBe(true);
  });
  it('updates an already mounted API table when its lazy dictionary arrives', async () => {
    const translations = TestBed.inject(TranslationService);
    translations.setLanguage('en', false);
    const english = component.queryResourceApiProps()[0].description;
    translations.setLanguage('de', false);
    await loadDemoLanguage(translations, 'de');
    fixture.detectChanges();
    const german = component.queryResourceApiProps()[0].description;
    expect(german).not.toBe(english);
    expect(german).not.toContain('!! Key');
    expect(fixture.nativeElement.textContent).toContain(german);
  });
});
