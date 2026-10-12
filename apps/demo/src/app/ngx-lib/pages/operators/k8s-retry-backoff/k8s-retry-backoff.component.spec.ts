import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {K8sRetryBackoffComponent} from './k8s-retry-backoff.component';

describe('K8sRetryBackoffComponent', () => {
  let component: K8sRetryBackoffComponent;
  let fixture: ComponentFixture<K8sRetryBackoffComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
      imports: [K8sRetryBackoffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(K8sRetryBackoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state and empty logs', () => {
    expect(component.selectedScenario()).toBe('header');
    expect(component.isLoading()).toBe(false);
    expect(component.logs()).toEqual([]);
    expect(component.simulationResult()).toBeNull();
  });

  it('should simulate immediate failure for non429 scenario without retry', () => {
    component.selectedScenario.set('non429');
    component.executeSimulation();

    expect(component.isLoading()).toBe(false);
    expect(component.simulationResult()?.success).toBe(false);
    expect(component.simulationResult()?.statusCode).toBe(500);
    expect(component.simulationResult()?.totalAttempts).toBe(1);
    expect(component.logs().some((l) => l.includes('HTTP 500 Internal Server Error'))).toBe(true);
  });

  it('should simulate retry backoff for header scenario and succeed on attempt 2', async () => {
    component.selectedScenario.set('header');
    component.executeSimulation();
    expect(component.isLoading()).toBe(true);

    // Scenario has Retry-After: 1 (1000ms delay)
    await vi.advanceTimersByTimeAsync(1000);

    expect(component.isLoading()).toBe(false);
    expect(component.simulationResult()?.success).toBe(true);
    expect(component.simulationResult()?.totalAttempts).toBe(2);
    expect(component.simulationResult()?.statusCode).toBe(200);
    expect(component.logs().some((l) => l.includes('HTTP 200 OK'))).toBe(true);
  });

  it('should clear simulation logs and result', () => {
    component.logs.set(['test log 1']);
    component.simulationResult.set({
      success: true,
      message: 'All good',
      totalAttempts: 1,
      statusCode: 200,
    });

    component.clearLogs();

    expect(component.logs()).toEqual([]);
    expect(component.simulationResult()).toBeNull();
  });

  it('should extract delay for header scenario and non429 scenario', () => {
    component.helperScenario.set('header');
    component.calculateDelay();
    expect(component.extractedDelayResult()).toEqual({delayMs: 3000});

    component.helperScenario.set('non429');
    component.calculateDelay();
    expect(component.extractedDelayResult()).toEqual({delayMs: null});
  });
  it.each([
    ['body', 1500],
    ['fallback', 1000],
  ] as const)('retries the %s scenario after its actual configured delay', async (scenario, delay) => {
    component.selectedScenario.set(scenario);
    component.executeSimulation();
    await vi.advanceTimersByTimeAsync(delay - 1);
    expect(component.simulationResult()).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(component.simulationResult()?.success).toBe(true);
    expect(component.simulationResult()?.totalAttempts).toBe(2);
  });

  it('propagates the last 429 after five total attempts', async () => {
    component.selectedScenario.set('exhausted');
    component.executeSimulation();
    await vi.runAllTimersAsync();
    expect(component.simulationResult()?.success).toBe(false);
    expect(component.simulationResult()?.statusCode).toBe(429);
    expect(component.simulationResult()?.totalAttempts).toBe(5);
  });

  it('cancels a pending retry when leaving the page', async () => {
    component.executeSimulation();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(2000);
    expect(component.simulationResult()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.logs().filter((line) => line.includes('Attempt'))).toHaveLength(1);
  });
});
