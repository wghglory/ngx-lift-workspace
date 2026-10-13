import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {K8sRetryBackoffInterceptorComponent} from './k8s-retry-backoff-interceptor.component';

describe('K8sRetryBackoffInterceptorComponent', () => {
  let component: K8sRetryBackoffInterceptorComponent;
  let fixture: ComponentFixture<K8sRetryBackoffInterceptorComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
      imports: [K8sRetryBackoffInterceptorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(K8sRetryBackoffInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default mode and empty logs', () => {
    expect(component.selectedMode()).toBe('default');
    expect(component.isLoading()).toBe(false);
    expect(component.logs()).toEqual([]);
    expect(component.simulationResult()).toBeNull();
  });

  it('should automatically retry 429 in default mode and succeed on attempt 2', async () => {
    component.selectedMode.set('default');
    component.executeRequest();
    expect(component.isLoading()).toBe(true);

    // Initial 429 response has Retry-After: 1 (1000ms delay)
    await vi.advanceTimersByTimeAsync(1000);

    expect(component.isLoading()).toBe(false);
    expect(component.simulationResult()?.success).toBe(true);
    expect(component.simulationResult()?.totalAttempts).toBe(2);
    expect(component.simulationResult()?.statusCode).toBe(200);
    expect(component.logs().some((l) => l.includes('HTTP 200 OK'))).toBe(true);
  });

  it('should apply custom fallback delay in custom mode', async () => {
    component.selectedMode.set('custom');
    component.executeRequest();
    expect(component.isLoading()).toBe(true);

    // A 400ms base with equal jitter and random=0 waits 200ms
    await vi.advanceTimersByTimeAsync(200);

    expect(component.isLoading()).toBe(false);
    expect(component.simulationResult()?.success).toBe(true);
    expect(component.simulationResult()?.totalAttempts).toBe(2);
  });

  it('should immediately fail on 429 when disabled via HttpContext', () => {
    component.selectedMode.set('disabled');
    component.executeRequest();

    expect(component.isLoading()).toBe(false);
    expect(component.simulationResult()?.success).toBe(false);
    expect(component.simulationResult()?.statusCode).toBe(429);
    expect(component.simulationResult()?.totalAttempts).toBe(1);
    expect(component.simulationResult()?.message).toContain('disabled via HttpContext');
  });

  it('should clear logs and result', () => {
    component.logs.set(['sample log']);
    component.simulationResult.set({
      success: true,
      message: 'done',
      totalAttempts: 1,
      statusCode: 200,
    });

    component.clearLogs();

    expect(component.logs()).toEqual([]);
    expect(component.simulationResult()).toBeNull();
  });

  it('runs the probe through the interceptor and fails immediately without retry', () => {
    component.testProbeOptOut();
    expect(component.isTestingOverride()).toBe(false);
    expect(component.overrideResult()?.bypassed).toBe(true);
    expect(component.overrideResult()?.statusCode).toBe(429);
    expect(component.overrideResult()?.attempts).toBe(1);
  });

  it('retries the custom workload read twice with its configured fallback delay', async () => {
    component.testWorkloadCustom();
    expect(component.isTestingOverride()).toBe(true);
    expect(component.activeOverrideTest()).toBe('workload');
    await vi.advanceTimersByTimeAsync(299);
    expect(component.overrideResult()).toBeNull();
    expect(component.isTestingOverride()).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(component.isTestingOverride()).toBe(false);
    expect(component.activeOverrideTest()).toBeNull();
    expect(component.overrideResult()?.bypassed).toBe(false);
    expect(component.overrideResult()?.statusCode).toBe(200);
    expect(component.overrideResult()?.attempts).toBe(3);
  });

  it('cancels pending intercepted requests and override retries when leaving the page', async () => {
    component.executeRequest();
    component.testWorkloadCustom();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(2000);
    expect(component.simulationResult()).toBeNull();
    expect(component.overrideResult()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.isTestingOverride()).toBe(false);
    expect(component.logs().filter((line) => line.includes('Attempt'))).toHaveLength(1);
  });
});
