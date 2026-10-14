import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslationService} from 'clr-lift';
import {QueryTimeoutError} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {QueryFailureExamplesComponent} from './query-failure-examples.component';

describe('query failure examples', () => {
  let fixture: ComponentFixture<QueryFailureExamplesComponent>;
  let component: QueryFailureExamplesComponent;
  async function advance(ms = 250) {
    await vi.advanceTimersByTimeAsync(ms);
    fixture.detectChanges();
    TestBed.tick();
    for (let i = 0; i < 12; i++) await Promise.resolve();
    fixture.detectChanges();
  }
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    TestBed.configureTestingModule({imports: [QueryFailureExamplesComponent]});
    const translation = TestBed.inject(TranslationService);
    translation.loadTranslationsForComponent('', {en: enTranslations});
    translation.setLanguage('en', false);
    fixture = TestBed.createComponent(QueryFailureExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  it('recovers an initial failure without losing its error state contract', async () => {
    await advance();
    expect(component.initialQuery.isInitialError()).toBe(true);
    component.initialQuery.reload();
    await advance();
    expect(component.initialQuery.isInitialError()).toBe(false);
    expect(component.initialQuery.value()?.value).toBe(42);
    expect(component.backend.requests()['GET initial']).toBe(2);
  });

  it('shows shared retry progress for HttpClient and native Promise reads without terminal errors', async () => {
    component.startRetry();
    component.startPromise();
    fixture.detectChanges();
    await advance();
    expect(component.retryQuery.failureCount()).toBe(1);
    expect(component.retryQuery.nextRetryAt()).not.toBeNull();
    await advance(700);
    expect(component.retryQuery.value()?.value).toBe(42);
    expect(component.retryQuery.failureCount()).toBe(0);
    expect(component.promiseQuery.value()?.value).toBe(42);
    expect(component.backend.requests()['GET retry']).toBe(3);
    expect(component.terminalFailures()).toBe(1);
  });

  it('retains data on refresh failure and separates observer diagnostics from query errors', async () => {
    await advance();
    const updatedAt = component.refreshQuery.updatedAt();
    component.failRefresh();
    await advance();
    expect(component.refreshQuery.isRefreshError()).toBe(true);
    expect(component.refreshQuery.value()?.value).toBe(42);
    expect(component.refreshQuery.updatedAt()).toBe(updatedAt);
    expect(component.terminalFailures()).toBe(2);
    component.failObserver();
    await advance();
    expect(component.refreshQuery.status()).toBe('resolved');
    expect(component.diagnostics()).toBe(1);
    expect(component.terminalFailures()).toBe(2);
  });

  it('bounds a hanging subscription and never automatically repeats a failed write', async () => {
    component.startDeadline();
    fixture.detectChanges();
    await advance(600);
    expect(component.deadlineQuery.error()).toBeInstanceOf(QueryTimeoutError);
    expect(component.backend.canceled()).toBe(1);
    expect(component.backend.requests()['GET deadline']).toBe(1);
    component.name.set('Retained input');
    component.save(true);
    await advance();
    expect(component.saveMutation.status()).toBe('error');
    expect(component.name()).toBe('Retained input');
    expect(component.backend.requests()['POST mutation']).toBe(1);
    component.save();
    await advance();
    await advance();
    expect(component.saveMutation.status()).toBe('resolved');
    expect(component.backend.requests()['POST mutation']).toBe(2);
    expect(component.refreshQuery.value()?.value).toBe(43);
  });
});
