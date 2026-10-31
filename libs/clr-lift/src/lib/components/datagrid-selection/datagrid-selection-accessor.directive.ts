import {AfterViewInit, DestroyRef, Directive, forwardRef, inject, Injector, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';

import {DatagridSelectionComponent, DatagridSelectionValue} from './datagrid-selection.component';

/**
 * Compose onto a business picker's hostDirectives. Pair with exactly one inner cllDatagridSelectionBinding.
 * Angular keeps the original control, validators and updateOn pipeline; no inner control is allocated.
 */
@Directive({
  selector: '[cllDatagridSelectionAccessor]',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatagridSelectionAccessorDirective), multi: true},
  ],
})
export class DatagridSelectionAccessorDirective implements ControlValueAccessor, AfterViewInit {
  private readonly injector = inject(Injector);
  private field?: DatagridSelectionComponent;
  private value: unknown;
  private disabled = false;
  private change: (value: DatagridSelectionValue) => void = () => {
    /* Angular callback */
  };
  private touched: () => void = () => {
    /* Angular callback */
  };

  writeValue(value: unknown): void {
    this.value = value;
    this.field?.writeValue(value);
  }
  registerOnChange(callback: (value: DatagridSelectionValue) => void): void {
    this.change = callback;
  }
  registerOnTouched(callback: () => void): void {
    this.touched = callback;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.field?.setDisabledState(disabled);
  }

  ngAfterViewInit(): void {
    if (!this.field)
      throw new Error('cllDatagridSelectionAccessor: exactly one inner cllDatagridSelectionBinding is required.');
    const accessors = this.injector.get(NG_VALUE_ACCESSOR, [], {self: true});
    if (accessors.length !== 1)
      throw new Error('cllDatagridSelectionAccessor: conflicting value accessors on picker host.');
  }

  /** @internal Connection owned by DatagridSelectionBindingDirective. */
  ɵconnect(field: DatagridSelectionComponent): () => void {
    if (this.field) throw new Error('cllDatagridSelectionAccessor: multiple inner bindings.');
    this.field = field;
    field.ɵowner = () => this.injector.get(NgControl, null, {self: true});
    field.registerOnChange((value) => {
      this.value = value;
      this.change(value);
    });
    field.registerOnTouched(() => this.touched());
    field.writeValue(this.value);
    field.setDisabledState(this.disabled);
    return () => {
      field.ɵowner = undefined;
      field.registerOnChange(() => {
        /* Disconnected */
      });
      field.registerOnTouched(() => {
        /* Disconnected */
      });
      if (this.field === field) this.field = undefined;
    };
  }
}

/** Explicitly connect this inner field to its business picker's library-owned host accessor. */
@Directive({selector: 'cll-datagrid-selection[cllDatagridSelectionBinding]'})
export class DatagridSelectionBindingDirective implements OnInit {
  private readonly accessor = inject(DatagridSelectionAccessorDirective, {skipSelf: true, optional: true});
  private readonly field = inject(DatagridSelectionComponent);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.accessor) throw new Error('cllDatagridSelectionBinding: missing picker host accessor.');
    if (this.injector.get(NgControl, null, {self: true}))
      throw new Error('cllDatagridSelectionBinding: inner field must not have another form binding.');
    this.destroyRef.onDestroy(this.accessor.ɵconnect(this.field));
  }
}
