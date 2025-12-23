import {ClrDatagridStateInterface} from '@clr/angular';
import {isEqual} from 'ngx-lift';
import {debounce, distinctUntilChanged, map, Observable, pairwise, pipe, startWith, timer, UnaryFunction} from 'rxjs';

/**
 * RxJS operator for handling Clarity Datagrid state transformations.
 * Designed for managing Clarity Datagrid filters with debouncing and optional distinctUntilChanged behavior.
 *
 * This operator:
 * - Adds a 500ms debounce when filters change (to avoid excessive API calls)
 * - Optionally filters out duplicate consecutive states
 * - Starts with a null state to handle initial load scenarios
 *
 * @param enableDistinctUntilChanged - Whether to enable distinctUntilChanged filtering. Defaults to `true`.
 * @returns A RxJS pipe function that transforms an observable of `ClrDatagridStateInterface | null`
 *   into an observable of `ClrDatagridStateInterface | null`
 *
 * @example
 * ```typescript
 * export class UserDatagridComponent {
 *   private dgSource = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
 *
 *   usersState$ = this.dgSource.pipe(
 *     dgState(), // Debounces filter changes and filters duplicates
 *     switchMap((state) => {
 *       const params = convertToHttpParams(state);
 *       return this.userService.getUsers(params);
 *     })
 *   );
 * }
 * ```
 */
export function dgState(
  enableDistinctUntilChanged = true,
): UnaryFunction<Observable<ClrDatagridStateInterface | null>, Observable<ClrDatagridStateInterface | null>> {
  return pipe(
    startWith(null),
    // Prepare old and new states filters to enable delay.
    pairwise(),
    // Delay emission only when the filter changes.
    debounce(([prev, curr]) => (isEqual(prev?.filters, curr?.filters) ? timer(0) : timer(500))),
    map(([, curr]) => curr),
    // Optionally include distinctUntilChanged based on the parameter.
    enableDistinctUntilChanged ? distinctUntilChanged(isEqual) : map((curr) => curr),
  );
}
