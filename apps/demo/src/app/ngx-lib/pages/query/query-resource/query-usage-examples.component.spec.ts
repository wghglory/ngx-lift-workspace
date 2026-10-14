import {ComponentFixture, TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryUsageExamplesComponent} from './query-usage-examples.component';

describe('Observable query usage examples', () => {
  let fixture: ComponentFixture<QueryUsageExamplesComponent>;
  let component: QueryUsageExamplesComponent;

  async function advance() {
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    TestBed.tick();
    for (let i = 0; i < 8; i++) await Promise.resolve();
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({imports: [QueryUsageExamplesComponent]});
    fixture = TestBed.createComponent(QueryUsageExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  it('runs independent reads in parallel and gates the database read on the tenant', async () => {
    expect(component.tenantQuery.isInitialLoading()).toBe(true);
    expect(component.databasesQuery.status()).toBe('idle');
    expect(component.backend.requests()['GET /query-demo/tenants/a']).toBe(1);
    expect(component.backend.requests()['GET /query-demo/tenants/a/health']).toBe(1);
    expect(component.backend.requests()['GET /query-demo/tenants/a/databases']).toBeUndefined();
    await advance();
    expect(component.tenantQuery.isInitialLoading()).toBe(false);
    expect(component.backend.requests()['GET /query-demo/tenants/a/databases']).toBe(1);
    await advance();
    expect(component.databasesQuery.value()?.[0].name).toBe('Tenant A database');
  });

  it('coalesces three service subscribers and one shared refresh', async () => {
    component.widgetsShown.set(true);
    fixture.detectChanges();
    expect(component.backend.requests()['GET /query-demo/tenants/a/preferences']).toBe(1);
    await advance();
    expect(fixture.nativeElement.querySelectorAll('[data-testid="query-demo-widget"]').length).toBe(3);
    component.refreshWidgets();
    fixture.detectChanges();
    expect(component.backend.requests()['GET /query-demo/tenants/a/preferences']).toBe(2);
    await advance();
  });

  it('invalidates scoped databases after a mutation and hides old tenant data on scope changes', async () => {
    await advance();
    await advance();
    component.databaseName.set('Created in A');
    component.createDatabase();
    await advance();
    expect(component.databasesQuery.isRefreshing()).toBe(true);
    await advance();
    expect(component.databasesQuery.value()?.map((value) => value.name)).toContain('Created in A');
    component.tenantId.set('b');
    expect(component.databasesQuery.value()).toBeUndefined();
    fixture.detectChanges();
    await advance();
    await advance();
    expect(component.databasesQuery.value()?.map((value) => value.name)).toEqual(['Tenant B database']);
  });

  it('shows refresh errors with retained data and supports recovery', async () => {
    await advance();
    component.failTenant();
    expect(component.tenantQuery.isRefreshing()).toBe(true);
    await advance();
    expect(component.tenantQuery.status()).toBe('error');
    expect(component.tenantQuery.value()?.id).toBe('a');
    component.tenantQuery.reload();
    await advance();
    expect(component.tenantQuery.status()).toBe('resolved');
    expect(component.tenantQuery.error()).toBeNull();
  });
});
