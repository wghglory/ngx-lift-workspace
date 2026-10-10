import {Directive, effect, inject, input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';

/**
 * Directive that automatically selects an option when exactly one item is present in the provided list.
 *
 * Works with:
 * - Elements bound to an Angular `NgControl` (`formControl`, `formControlName`, `ngModel`)
 * - Components implementing `ControlValueAccessor` (CVA)
 *
 * @example
 * ```html
 * <!-- With Reactive Form Control -->
 * <select [formControl]="regionControl" [ngxAutoSelect]="availableRegions()">
 *   <option *ngFor="let region of availableRegions()" [value]="region.id">{{ region.name }}</option>
 * </select>
 *
 * <!-- Inside a custom ControlValueAccessor component -->
 * <app-custom-picker [ngxAutoSelect]="items()"></app-custom-picker>
 * ```
 */
@Directive({
  selector: '[ngxAutoSelect]',
})
export class AutoSelectDirective<T = unknown> {
  /** The list of options. Auto-selects when exactly one item exists. */
  ngxAutoSelect = input.required<T[]>();

  /** Optional equality comparator for non-primitive options. */
  compareWith = input<(a: T, b: T) => boolean>();

  private ngControl = inject(NgControl, {optional: true, self: true});
  private cva = inject(NG_VALUE_ACCESSOR, {optional: true}) as ControlValueAccessor[] | null;

  constructor() {
    effect(() => {
      const options = this.ngxAutoSelect();

      if (options && options.length === 1) {
        this.selectValue(options[0]);
      }
    });
  }

  private isSame(current: unknown, target: T): boolean {
    const comparator = this.compareWith();
    if (comparator && current !== undefined && current !== null) {
      return comparator(current as T, target);
    }
    return current === target;
  }

  private selectValue(value: T): void {
    // Priority 1: NgControl on the host element
    if (this.ngControl?.control) {
      if (!this.isSame(this.ngControl.value, value)) {
        this.ngControl.control.setValue(value);
      }
      return;
    }

    // Priority 2: Host ControlValueAccessor
    if (this.cva?.length) {
      const accessor = this.cva[0];
      accessor.writeValue(value);

      if ('onChange' in accessor && typeof accessor.onChange === 'function') {
        (accessor as ControlValueAccessor & {onChange: (v: T) => void}).onChange(value);
      }
    }
  }
}
