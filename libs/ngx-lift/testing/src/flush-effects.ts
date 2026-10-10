import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

/**
 * Helper to flush Angular zoneless reactive state, effects, and advance Vitest fake timers.
 *
 * In a zoneless or signal-based Angular reactive environment, converting between signals and observables
 * (e.g., via `toObservable` or `toSignal` in `combineFrom` or `resourceAsync`) requires
 * flushing Angular's effect queue and letting the JavaScript microtask loop cycle.
 *
 * This helper encapsulates the standard three-step sequence:
 * 1. Force initial signal changes to effects via `TestBed.tick()`
 * 2. Cycle event loop to let asynchronous microtasks/timers run via `vi.advanceTimersByTimeAsync(delay)`
 * 3. Force downstream reactive conversions to resolve via `TestBed.tick()`
 *
 * @param delay The duration in milliseconds to advance mock timers (default: 0).
 *
 * @example
 * ```typescript
 * import { flushEffects } from 'ngx-lift/testing';
 *
 * it('should update derived signal from observable', async () => {
 *   sourceSubject.next('new value');
 *   await flushEffects();
 *   expect(component.derivedSignal()).toBe('new value');
 * });
 * ```
 */
export async function flushEffects(delay = 0): Promise<void> {
  const zone = (globalThis as unknown as {Zone?: {current: {name: string}}}).Zone;
  if (zone && zone.current.name === 'fakeAsyncZone') {
    throw new Error(
      "flushEffects() was called inside a fakeAsync() block. In fakeAsync blocks, use Angular's built-in tick(delay) instead of flushEffects().",
    );
  }
  TestBed.tick();
  await vi.advanceTimersByTimeAsync(delay);
  TestBed.tick();
}
