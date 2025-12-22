import {ClrDatagridStateInterface} from '@clr/angular';
import {isEqual} from 'ngx-lift';
import {debounce, distinctUntilChanged, map, Observable, pairwise, pipe, startWith, timer, UnaryFunction} from 'rxjs';

/**
 * operator for handling Clarity Datagrid state transformations.
 * It is designed for managing Clarity Datagrid filters and supports optional distinctUntilChanged behavior.
 * @param enableDistinctUntilChanged Whether to enable distinctUntilChanged. Defaults to true.
 * @returns A RxJS pipe that takes an observable of ClrDatagridStateInterface or null and returns an observable of ClrDatagridStateInterface.
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
