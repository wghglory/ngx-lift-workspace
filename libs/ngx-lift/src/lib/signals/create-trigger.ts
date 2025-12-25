import {signal} from '@angular/core';

/**
 * Creates a trigger signal that can be used to manually trigger updates or side effects.
 * The trigger maintains an internal counter that increments each time `next()` is called.
 *
 * @returns An object containing:
 *   - `next()`: A function to trigger an update (increments the internal counter)
 *   - `value`: A readonly signal that emits the current counter value
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private refreshTrigger = createTrigger();
 *
 *   // Use the trigger to refresh data
 *   refreshData() {
 *     this.refreshTrigger.next();
 *   }
 *
 *   // React to trigger changes
 *   data$ = toObservable(this.refreshTrigger.value).pipe(
 *     switchMap(() => this.dataService.getData())
 *   );
 * }
 * ```
 */
export function createTrigger() {
  const sourceSignal = signal(0);

  return {
    /**
     * Triggers an update by incrementing the internal counter.
     */
    next: () => {
      sourceSignal.update((v) => v + 1);
    },
    /**
     * A readonly signal that emits the current counter value.
     */
    value: sourceSignal.asReadonly(),
  };
}
