import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import {setupTestBed} from '@analogjs/vitest-angular/setup-testbed';
import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

setupTestBed();

/**
 * Helper to flush Angular zoneless reactive state/effects and advance Vitest fake timers.
 *
 * In a zoneless Angular reactive environment, converting between signals and observables
 * (e.g., via `toObservable` or `toSignal` in `combineFrom` or `resourceAsync`) requires
 * flushing Angular's effect queue and letting the JavaScript microtask loop cycle.
 *
 * This helper encapsulates the standard three-step sequence:
 * 1. Force initial signal changes to effects via `TestBed.tick()`
 * 2. Cycle event loop to let RxJS microtasks run via `vi.advanceTimersByTimeAsync(delay)`
 * 3. Force downstream reactive conversions to resolve via `TestBed.tick()`
 *
 * @param delay The duration to advance the mock clock (default is 0)
 */
export async function flushEffects(delay = 0): Promise<void> {
  TestBed.tick();
  await vi.advanceTimersByTimeAsync(delay);
  TestBed.tick();
}
