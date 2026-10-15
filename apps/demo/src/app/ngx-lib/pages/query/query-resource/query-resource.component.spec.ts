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
    expect(component.metricsAQuery).toBeDefined();
    expect(component.metricsBQuery).toBeDefined();
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

  it('manages demo auth user state and cycles names via mutation', async () => {
    expect(component.demoAuthUser().name).toBe('Alex Rivera');
    component.cycleDemoUserName();
    expect(component.demoAuthMutation.isLoading()).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    expect(component.demoAuthUser().name).toBe('Jordan Lee');
  });

  it('selects demo database and updates details query', () => {
    expect(component.demoSelectedDbId()).toBe('db-pg-01');
    component.selectDemoDb('db-ch-02');
    expect(component.demoSelectedDbId()).toBe('db-ch-02');
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

  it('renders the inspector table and refresh control through the playground projection', () => {
    const inspector = fixture.nativeElement.querySelector('[data-testid="query-diagnostics"]');
    expect(inspector.querySelector('table')).not.toBeNull();
    const refresh = Array.from(inspector.querySelectorAll('button')) as HTMLButtonElement[];
    expect(refresh.some((button) => button.textContent?.includes('Refresh Diagnostics'))).toBe(true);
  });

  it('introduces the tool before examples and uses Clarity controls and status labels', () => {
    const root: HTMLElement = fixture.nativeElement;
    const intro = root.querySelector('[data-testid="query-introduction"]');
    const coalesce = root.querySelector('[data-testid="query-demo-coalesce"]');
    if (!intro || !coalesce) throw new Error('Missing guide introduction or coalesce demo');
    expect(intro.compareDocumentPosition(coalesce) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(root.querySelector('clr-select-container select[clrSelect]')).not.toBeNull();
    expect(root.querySelector('[data-testid="query-demo-dynamic"]')).toBeNull();
    expect(root.querySelector('[data-testid="query-failure-examples"] .card')).toBeNull();
    expect(root.querySelector('[data-testid="query-demo-coalesce"] .label')).not.toBeNull();
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
