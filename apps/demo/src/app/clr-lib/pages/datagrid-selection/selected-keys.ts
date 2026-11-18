import {Signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {FormControl} from '@angular/forms';
import {DatagridSelectionValue} from 'clr-lift';
import {startWith, switchMap} from 'rxjs';

/**
 * Follows the page-owned control's selected keys across edits, reset and control replacement.
 *
 * @param control The control bound directly to the inner `cll-datagrid-selection`.
 * @returns A signal of the current selected keys for the picker's `keys` model.
 *
 * @example
 * ```typescript
 * private readonly selectedKeys = toSelectedKeys(this.control);
 * effect(() => this.keys.set(this.selectedKeys()));
 * ```
 */
export function toSelectedKeys(control: Signal<FormControl>): Signal<DatagridSelectionValue> {
  return toSignal(
    toObservable(control).pipe(switchMap((current) => current.valueChanges.pipe(startWith(current.value)))),
    {initialValue: null as DatagridSelectionValue},
  );
}
