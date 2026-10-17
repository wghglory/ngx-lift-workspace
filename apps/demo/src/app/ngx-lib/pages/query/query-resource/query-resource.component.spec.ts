import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';
import {describe, expect, it, beforeEach, vi} from 'vitest';

import {demoTranslations} from '../../../../core/l10n/demo.l10n';
import {loadDemoLanguage} from '../../../../core/l10n/demo-language-loader';
import {AuthStateService} from './query-placement-state';
import {MetricsWidgetComponent} from './metrics-widget.component';
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

  it('mounts independent metric widgets that share their request and refresh', () => {
    const widgets = fixture.debugElement.queryAll(By.directive(MetricsWidgetComponent));
    expect(widgets).toHaveLength(2);
    expect(widgets[0].componentInstance.metricsQuery).not.toBe(widgets[1].componentInstance.metricsQuery);
    const reload = vi.spyOn(widgets[0].componentInstance.metricsQuery, 'reload');
    component.refreshMetrics();
    expect(reload).toHaveBeenCalledTimes(1);
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

  it('ignores a profile update until the initial user is available', () => {
    const authStateService = TestBed.inject(AuthStateService);
    const mutate = vi.spyOn(authStateService.updateProfileMutation, 'mutate');
    authStateService.updateName();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('keeps the cached topbar user visible while a mutation revalidates the query', async () => {
    await TestBed.inject(AuthStateService).currentUserQuery.execute();
    fixture.detectChanges();
    const topbar = fixture.nativeElement.querySelector('#tab-content-service-pattern-a .card');
    expect(topbar.querySelector('strong')?.textContent).toBe('Alex Rivera');

    vi.useFakeTimers();
    try {
      TestBed.inject(AuthStateService).updateName();
      expect(TestBed.inject(AuthStateService).updateProfileMutation.isLoading()).toBe(true);
      await vi.advanceTimersByTimeAsync(400);
      fixture.detectChanges();

      expect(TestBed.inject(AuthStateService).currentUserQuery.isRefreshing()).toBe(true);
      expect(topbar.querySelector('strong')?.textContent).toBe('Alex Rivera');
      expect(topbar.querySelector('cll-spinner')).not.toBeNull();
      const mutate = vi.spyOn(TestBed.inject(AuthStateService).updateProfileMutation, 'mutate');
      TestBed.inject(AuthStateService).updateName();
      expect(mutate).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(300);
      fixture.detectChanges();
      expect(TestBed.inject(AuthStateService).currentUserQuery.isRefreshing()).toBe(false);
      expect(topbar.querySelector('strong')?.textContent).toBe('Jordan Lee');
      expect(topbar.querySelector('cll-spinner')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('selects demo database and updates details query', () => {
    expect(component.databaseStateService.activeDatabaseId()).toBe('db-pg-01');
    component.databaseStateService.selectDatabase('db-ch-02');
    expect(component.databaseStateService.activeDatabaseId()).toBe('db-ch-02');
  });

  it('renders the reusable diagnostics trigger through the playground preview', () => {
    const inspector = fixture.nativeElement.querySelector('[data-testid="query-diagnostics"]');
    expect(inspector.querySelector('cll-query-devtools')).not.toBeNull();
    expect(inspector.textContent).toContain('Query devtools');
    expect(inspector.querySelector('clr-datagrid')).toBeNull();
  });

  it('teaches a working read before advanced examples and lifecycle reference', () => {
    const root: HTMLElement = fixture.nativeElement;
    const intro = root.querySelector('[data-testid="query-starter"]');
    const reference = root.querySelector('[data-testid="query-introduction"]');
    const coalesce = root.querySelector('[data-testid="query-demo-coalesce"]');
    if (!intro || !coalesce) throw new Error('Missing guide introduction or coalesce demo');
    expect(intro.compareDocumentPosition(coalesce) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    if (!reference) throw new Error('Missing lifecycle reference');
    expect(coalesce.compareDocumentPosition(reference) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(root.querySelector('clr-select-container select[clrSelect]')).not.toBeNull();
    expect(root.querySelector('[data-testid="query-demo-dynamic"]')).toBeNull();
    expect(root.querySelector('[data-testid="query-failure-examples"] .card')).toBeNull();
    expect(root.querySelector('[data-testid="query-demo-coalesce"] .label')).not.toBeNull();
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
