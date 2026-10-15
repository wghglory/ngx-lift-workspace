import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';
import {QUERY_CLIENT} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {QueryResourcesDemoComponent} from './query-resources.component';

describe('queryResources guide', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [QueryResourcesDemoComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    });
    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en', false);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });
  it('preserves displayed refs on reorder and cancels removed pending reads', async () => {
    const fixture = TestBed.createComponent(QueryResourcesDemoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.selectedTenants.set(['a', 'b']);
    fixture.detectChanges();
    const [a, b] = component.tenantQueries();
    component.selectedTenants.set(['b', 'a']);
    expect(component.tenantQueries()).toEqual([b, a]);
    component.selectedTenants.set([]);
    expect(component.tenantQueries()).toEqual([]);
    fixture.detectChanges();
    // Prove cancellation before the 300 ms transport could finish naturally.
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    const entries = fixture.debugElement.injector.get(QUERY_CLIENT).getDiagnostics().entries;
    const removed = entries.filter((entry) => entry.key[2] === 'tenant');
    expect(removed).toHaveLength(2);
    expect(removed.every((entry) => entry.observerCount === 0 && !entry.isPending && entry.requestCount === 0)).toBe(
      true,
    );
    await expect(a.execute()).rejects.toThrow('destroyed');
  });
  it('recovers a failed row without reloading a successful sibling', async () => {
    const fixture = TestBed.createComponent(QueryResourcesDemoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    const [a, b] = component.rowQueries();
    expect(a.value()?.value).toBe(42);
    expect(b.isInitialError()).toBe(true);
    b.reload();
    await vi.advanceTimersByTimeAsync(250);
    fixture.detectChanges();
    expect(b.value()?.value).toBe(42);
    expect(component.failureBackend.requests()['GET rows/a']).toBe(1);
    expect(component.failureBackend.requests()['GET rows/b']).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('[data-testid="failure-row"] .label-success')).toHaveLength(2);
  });

  it('manages Kubernetes fleet bulk vs granular query flows', async () => {
    const fixture = TestBed.createComponent(QueryResourcesDemoComponent);
    const component = fixture.componentInstance;
    // Trigger initial observation of both queries
    expect(component.clustersBulkQuery.status()).toBe('loading');
    expect(component.clustersListQuery.status()).toBe('loading');
    fixture.detectChanges();

    // Advance 150ms: parent list resolves, but metrics and bulk are still in flight
    await vi.advanceTimersByTimeAsync(150);
    fixture.detectChanges();

    expect(component.clustersListQuery.hasValue()).toBe(true);
    expect(component.clustersListQuery.value()?.length).toBe(3);
    expect(component.clusterItemQueries().length).toBe(3);
    expect(component.clustersBulkQuery.hasValue()).toBe(false);

    // Advance another 1500ms (total 1650ms): all child item queries and bulk query finish
    await vi.advanceTimersByTimeAsync(1500);
    fixture.detectChanges();

    expect(component.clustersBulkQuery.hasValue()).toBe(true);
    expect(component.clustersBulkQuery.value()?.length).toBe(3);
    expect(component.clusterItemQueries().every((q) => q.hasValue())).toBe(true);
    expect(component.isFleetRefreshing()).toBe(false);

    // Test individual cluster item reload
    const eastCluster = component.clusterItemQueries().find((q) => q.item().id === 'cluster-us-east');
    expect(eastCluster?.isRefreshing()).toBe(false);
    component.reloadClusterItem('cluster-us-east');
    fixture.detectChanges();
    expect(eastCluster?.isRefreshing()).toBe(true);
    expect(component.isFleetRefreshing()).toBe(true);
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();
    expect(eastCluster?.isRefreshing()).toBe(false);

    // Test bulk fleet reload
    component.reloadBulkFleet();
    fixture.detectChanges();
    expect(component.clustersBulkQuery.isRefreshing()).toBe(true);
    await vi.advanceTimersByTimeAsync(1500);
    fixture.detectChanges();
    expect(component.clustersBulkQuery.isRefreshing()).toBe(false);

    // Test granular fleet reload
    component.reloadGranularFleet();
    fixture.detectChanges();
    expect(component.isFleetRefreshing()).toBe(true);
    await vi.advanceTimersByTimeAsync(1500);
    fixture.detectChanges();
    expect(component.isFleetRefreshing()).toBe(false);
  });
});
