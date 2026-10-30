import {
  afterEveryRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  DestroyRef,
  DoCheck,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
} from '@angular/forms';
import {ClrCommonFormsModule, ClrDatagrid, ClrDatagridRow, SelectionType} from '@clr/angular';
import {Subscription} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {datagridSelectionTranslations} from './datagrid-selection.l10n';
import {SelectionIdService} from './selection-id.service';

/** Stable resource identity within this field's scope. Display names and row positions are not identities. */
export type DatagridSelectionKey = string | number;
/** Native single selection stores a key/null; multi selection stores ordered keys. */
export type DatagridSelectionValue = DatagridSelectionKey | null | readonly DatagridSelectionKey[];
/** Disabled additions need a caller-localized explanation. Already selected items remain removable. */
export interface DatagridItemAvailability {
  disabled: boolean;
  disabledReason?: string;
}

/** A form field around one caller-written native Clarity datagrid and its directly projected label. */
@Component({
  selector: 'cll-datagrid-selection',
  imports: [TranslatePipe, ClrCommonFormsModule],
  templateUrl: './datagrid-selection.component.html',
  styleUrl: './datagrid-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatagridSelectionComponent), multi: true}],
})
export class DatagridSelectionComponent<T = unknown> implements ControlValueAccessor, DoCheck {
  /** Intentionally participates in Angular's RequiredValidator on direct form bindings. */
  readonly required = input(false, {transform: booleanAttribute});
  /** Caller-localized help, associated with the actual grid. */
  readonly helper = input('');
  /** Caller-selected message for any validator on the original owner. */
  readonly error = input('');
  /** Omit to inherit the enclosing Clarity form's layout. */
  readonly layout = input<'horizontal' | 'vertical'>();
  /** Prevent selection changes while retaining browsing and form inclusion. */
  readonly readonly = input(false, {transform: booleanAttribute});
  /** Native row selectability and this policy both apply. Selected unavailable items remain removable. */
  readonly itemAvailability = input<(item: T) => DatagridItemAvailability>(() => ({disabled: false}));
  private readonly grids = contentChildren<ClrDatagrid<T>>(ClrDatagrid);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly subscriptions = new Subscription();
  private readonly rows = new Map<ClrDatagridRow<T>, Subscription>();
  private grid?: ClrDatagrid<T>;
  private value: unknown;
  private keys: DatagridSelectionKey[] = [];
  private disabled = false;
  private lastEditBlocked?: boolean;
  private mode?: SelectionType;
  private identity?: (item: T) => unknown;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private readonly form =
    inject(FormGroupDirective, {optional: true, skipSelf: true}) ?? inject(NgForm, {optional: true, skipSelf: true});
  protected readonly id = inject(SelectionIdService).allocate();
  protected single = false;
  protected empty = true;
  private owner: AbstractControl | null = null;
  private ownerSubscription?: Subscription;
  private focusTimer?: ReturnType<typeof setTimeout>;
  private pointerTimer?: ReturnType<typeof setTimeout>;
  private focusTarget: HTMLElement | null = null;
  private focused = false;
  private label?: HTMLLabelElement;
  private readonly focusLabel = () => this.grid?.datagridTable.nativeElement.focus();
  /** Measured native viewport height in rem, retained while filters/pages hide supplied items. */
  private footprint = 0;
  private footprintDensity = '';
  /** @internal The library picker binding supplies the original host control without creating another control. */
  ɵowner?: () => NgControl | null;
  private readonly reasons = new Map<ClrDatagridRow<T>, HTMLElement>();
  private nextReason = 0;
  private allInScopeSelected = false;
  private onChange: (value: DatagridSelectionValue) => void = () => {
    /* Angular callback */
  };
  private onTouched: () => void = () => {
    /* Angular callback */
  };

  constructor() {
    inject(TranslationService).loadTranslationsForComponent('datagrid-selection', datagridSelectionTranslations);
    const guard = (event: Event) => {
      const target = event.target as HTMLElement;
      const selectionCell = target.closest('.datagrid-select');
      const row = this.grid?.rows.find((row) => row.el.nativeElement.contains(target));
      const rowClick =
        this.grid?.selection.rowSelectionMode && !!row && !target.closest('a, button, input, select, textarea');
      if (!selectionCell && !rowClick) return;
      if (event instanceof KeyboardEvent && ![' ', 'Enter'].includes(event.key)) return;
      const blocked = this.blocked() || (!!row && !this.keys.includes(this.key(row.item)) && !this.eligible(row.item));
      const headerSpace =
        this.mode === SelectionType.Multi && !row && event instanceof KeyboardEvent && event.key === ' ';
      if (!blocked && !headerSpace) return;
      // Capture before Clarity handles a focused checkbox/header, including under its loading overlay.
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!blocked && headerSpace) this.selectAll(!this.allInScopeSelected);
    };
    for (const name of ['click', 'keydown', 'change']) this.host.addEventListener(name, guard, true);
    // Native single radios update Selection directly, without the row's selectedChanged output.
    const radioChange = (event: Event) => {
      if (this.single && (event.target as HTMLElement).matches('.datagrid-select input[type=radio]')) this.edit();
    };
    const rowClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        this.single &&
        this.grid?.selection.rowSelectionMode &&
        !target.closest('.datagrid-select') &&
        this.grid.rows.some((row) => row.el.nativeElement.contains(target))
      )
        this.edit();
    };
    this.host.addEventListener('change', radioChange);
    this.host.addEventListener('click', rowClick);
    const focusIn = (event: FocusEvent) => {
      if (this.ownsFocus(event.target as Node)) {
        this.focused = true;
        clearTimeout(this.focusTimer);
        this.focusTimer = undefined;
        this.focusTarget = event.target as HTMLElement;
      } else this.deferDeparture();
    };
    let pointerInside = false;
    const pointerDown = (event: Event) => {
      pointerInside = this.ownsFocus(event.target as Node);
      if (pointerInside) this.focused = true;
      else this.depart();
      // Safari may leave activeElement on body when a button is clicked. That is an internal pointer move,
      // not departure. A later outside pointer/focus transition still commits a blur-buffered edit.
      clearTimeout(this.pointerTimer);
      this.pointerTimer = setTimeout(() => {
        pointerInside = false;
      });
    };
    const focusOut = (event: FocusEvent) => {
      if (!this.ownsFocus(event.target as Node) || this.disabled) return;
      if (event.relatedTarget && this.ownsFocus(event.relatedTarget as Node)) return;
      if (!event.relatedTarget && pointerInside) return;
      this.deferDeparture();
    };
    this.host.ownerDocument.addEventListener('focusin', focusIn);
    this.host.ownerDocument.addEventListener('focusout', focusOut);
    this.host.ownerDocument.addEventListener('pointerdown', pointerDown, true);
    this.subscriptions.add(this.form?.ngSubmit.subscribe(() => this.cdr.markForCheck()));
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.focusTimer);
      clearTimeout(this.pointerTimer);
      this.label?.removeEventListener('click', this.focusLabel);
      this.host.removeEventListener('change', radioChange);
      this.host.removeEventListener('click', rowClick);
      this.ownerSubscription?.unsubscribe();
      this.host.ownerDocument.removeEventListener('focusin', focusIn);
      this.host.ownerDocument.removeEventListener('focusout', focusOut);
      this.host.ownerDocument.removeEventListener('pointerdown', pointerDown, true);
      for (const name of ['click', 'keydown', 'change']) this.host.removeEventListener(name, guard, true);
      this.subscriptions.unsubscribe();
      for (const subscription of this.rows.values()) subscription.unsubscribe();
    });
    afterEveryRender(() => this.synchronize());
  }

  writeValue(value: unknown): void {
    clearTimeout(this.focusTimer);
    this.value = value;
    this.readValue();
    this.cdr.markForCheck();
  }
  registerOnChange(callback: (value: DatagridSelectionValue) => void): void {
    this.onChange = callback;
  }
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }
  setDisabledState(disabled: boolean): void {
    clearTimeout(this.focusTimer);
    if (disabled) this.focused = false;
    this.disabled = disabled;
    this.cdr.markForCheck();
  }
  protected blocked(): boolean {
    return this.disabled || this.readonly() || !!this.grid?.loading;
  }
  ngDoCheck(): void {
    const owner = (this.ɵowner?.() ?? this.injector.get(NgControl, null, {self: true}))?.control ?? null;
    if (owner === this.owner) return;
    this.ownerSubscription?.unsubscribe();
    this.owner = owner;
    this.ownerSubscription = owner?.events.subscribe(() => this.cdr.markForCheck());
  }
  protected showError(): boolean {
    return !!this.owner?.invalid && (!!this.owner.touched || !!this.form?.submitted);
  }
  protected clear(): void {
    if (!this.blocked()) this.commit([]);
  }
  private depart(): void {
    if (!this.focused || this.disabled || this.destroyRef.destroyed) return;
    this.focused = false;
    this.focusTarget = null;
    clearTimeout(this.focusTimer);
    this.onTouched();
    this.cdr.markForCheck();
  }
  private deferDeparture(): void {
    if (!this.focused || this.disabled || this.destroyRef.destroyed) return;
    clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      this.focusTimer = undefined;
      // Clarity can move focus before attaching a portal's aria-controls target to the document.
      if (!this.ownsFocus(this.host.ownerDocument.activeElement)) this.depart();
    });
  }
  private ownsFocus(target: Node | null): boolean {
    if (!target) return false;
    if (this.host.contains(target)) return true;
    return Array.from(this.host.querySelectorAll<HTMLElement>('[aria-controls], [aria-owns]')).some((element) =>
      `${element.getAttribute('aria-controls') ?? ''} ${element.getAttribute('aria-owns') ?? ''}`
        .split(/\s+/)
        .some((id) => id && this.host.ownerDocument.getElementById(id)?.contains(target)),
    );
  }

  private readValue(): void {
    if (!this.grid) return;
    const value = this.value;
    if (this.grid.selectionType === SelectionType.Multi) {
      if (value != null && (!Array.isArray(value) || !Array.from(value).every(isKey)))
        throw new Error('cll-datagrid-selection: multi value must be an array of string/finite-number keys.');
      this.keys = value == null ? [] : [...(value as DatagridSelectionKey[])];
    } else {
      if (value != null && !isKey(value))
        throw new Error('cll-datagrid-selection: single value must be a string/finite-number key or null.');
      this.keys = value == null ? [] : [value as DatagridSelectionKey];
    }
    if (new Set(this.keys).size !== this.keys.length) throw new Error('cll-datagrid-selection: duplicate value keys.');
  }

  private key(item: T): DatagridSelectionKey {
    const key: unknown = this.grid!.items.identifyBy(item);
    if (!isKey(key))
      throw new Error('cll-datagrid-selection: clrDgItemsIdentityFn must return a stable string/finite-number key.');
    return key;
  }

  private synchronize(): void {
    const grids = this.grids();
    if (grids.length !== 1) throw new Error('cll-datagrid-selection: project exactly one direct clr-datagrid.');
    const grid = grids[0];
    if (!this.grid) {
      this.grid = grid;
      this.single = grid.selectionType === SelectionType.Single;
      this.cdr.markForCheck();
      if (grid.selectionType !== SelectionType.Multi && grid.selectionType !== SelectionType.Single)
        throw new Error('cll-datagrid-selection: declare native single or multi selection.');
      grid.clrDgPreserveSelection = true;
      this.mode = grid.selectionType;
      this.identity = grid.items.identifyBy;
      this.subscriptions.add(grid.customSelectAll.subscribe((selected) => this.selectAll(selected)));
      grid.customSelectAllEnabled = true;
      this.readValue();
    }
    if (this.grid !== grid || grid.selectionType !== this.mode || grid.items.identifyBy !== this.identity)
      throw new Error('cll-datagrid-selection: grid, mode and identity must stay fixed while mounted.');
    const all = grid.items.all ?? [];
    const unique = new Set<DatagridSelectionKey>();
    for (const item of all) {
      const key = this.key(item);
      if (unique.has(key)) throw new Error('cll-datagrid-selection: duplicate inventory keys.');
      unique.add(key);
    }
    const nativeRows = new Set(grid.rows.toArray());
    for (const [row, subscription] of this.rows) {
      if (!nativeRows.has(row)) {
        subscription.unsubscribe();
        this.rows.delete(row);
        this.reasons.get(row)?.remove();
        this.reasons.delete(row);
      }
    }
    for (const row of grid.rows) {
      if (!this.rows.has(row))
        this.rows.set(
          row,
          row.selectedChanged.subscribe(() => this.edit()),
        );
    }
    this.renderSelection();
    this.synchronizeAvailability();
    const editBlocked = this.blocked();
    if (this.lastEditBlocked !== editBlocked) {
      this.lastEditBlocked = editBlocked;
      this.cdr.markForCheck();
    }
    this.present();
  }

  private present(): void {
    const labels = this.host.querySelectorAll<HTMLLabelElement>(':scope > .selection-field > .field-label > label');
    if (labels.length !== 1) throw new Error('cll-datagrid-selection: project exactly one direct plain label.');
    const label = labels[0];
    if (this.label !== label) {
      this.label?.removeEventListener('click', this.focusLabel);
      this.label = label;
      label.addEventListener('click', this.focusLabel);
    }
    label.id ||= `${this.id}-label`;
    label.classList.toggle('clr-required-mark', this.required());
    const grid = this.grid!.datagridTable.nativeElement;
    const nativeHost = this.grid!.el.nativeElement;
    const explicitName = nativeHost.getAttribute('aria-labelledby');
    if (explicitName) grid.setAttribute('aria-labelledby', explicitName);
    else if (nativeHost.getAttribute('aria-label'))
      grid.setAttribute('aria-label', nativeHost.getAttribute('aria-label')!);
    else grid.setAttribute('aria-labelledby', label.id);
    const feedback = this.showError() && this.error() ? `${this.id}-error` : this.helper() ? `${this.id}-help` : '';
    const description =
      `${nativeHost.getAttribute('aria-describedby') ?? ''} ${feedback} ${this.required() ? `${this.id}-required` : ''}`.trim();
    if (description) grid.setAttribute('aria-describedby', description);
    else grid.removeAttribute('aria-describedby');
    grid.setAttribute('aria-invalid', String(this.showError()));
    // role=grid does not support aria-required. Describe the field requirement explicitly instead.
    grid.setAttribute('aria-disabled', String(this.disabled));
    grid.setAttribute('aria-readonly', String(this.readonly()));
    grid.setAttribute('aria-busy', String(this.grid!.loading));
    if (
      this.focused &&
      this.focusTarget &&
      !this.focusTarget.isConnected &&
      this.host.ownerDocument.activeElement === this.host.ownerDocument.body
    ) {
      grid.focus();
      this.focusTarget = grid;
    }
    const empty = this.keys.length === 0;
    if (empty !== this.empty) {
      this.empty = empty;
      this.cdr.markForCheck();
    }
    // contentWrapper is display: contents in Clarity 18: it has no box to measure or constrain.
    // The native datagrid owns scrolling and its sticky header; the footer is outside this box.
    const viewport = this.grid!.datagrid.nativeElement;
    const source = this.grid!.items.all;
    const density = `${!!nativeHost.closest('.datagrid-compact')}|${nativeHost.closest('[cds-density]')?.getAttribute('cds-density') ?? ''}`;
    if (
      density !== this.footprintDensity ||
      !source?.length ||
      (source?.length > 0 && source.length === this.grid!.items.displayed?.length)
    ) {
      this.footprintDensity = density;
      this.footprint = 0;
      viewport.style.minBlockSize = '';
    }
    const rem =
      Number.parseFloat(
        this.host.ownerDocument.defaultView?.getComputedStyle(this.host.ownerDocument.documentElement).fontSize ?? '',
      ) || 16;
    this.footprint = Math.max(this.footprint, viewport.getBoundingClientRect().height / rem);
    if (this.footprint > 0) viewport.style.minBlockSize = `${this.footprint}rem`;
  }

  private synchronizeAvailability(): void {
    const grid = this.grid!;
    for (const row of grid.rows) {
      const availability = this.itemAvailability()(row.item);
      if (availability.disabled && !availability.disabledReason?.trim())
        throw new Error('cll-datagrid-selection: unavailable items need a readable disabledReason.');
      const selected = this.keys.includes(this.key(row.item));
      const enabled = !this.blocked() && (selected || this.eligible(row.item));
      const input = row.el.nativeElement.querySelector<HTMLInputElement>('.datagrid-select input');
      if (input) {
        input.disabled = !enabled;
        input.setAttribute('aria-disabled', String(!enabled));
        row.el.nativeElement.querySelector('.datagrid-select')?.classList.toggle('clr-form-control-disabled', !enabled);
        let reason = this.reasons.get(row);
        if (availability.disabled && availability.disabledReason) {
          if (!reason || !reason.isConnected) {
            reason = this.host.ownerDocument.createElement('span');
            reason.className = 'selection-availability-reason';
            reason.id = `${this.id}-availability-${this.nextReason++}`;
            (row.el.nativeElement.querySelector('clr-dg-cell') ?? input.closest('.datagrid-select'))?.append(reason);
            this.reasons.set(row, reason);
          }
          reason.textContent = availability.disabledReason;
          const ids = new Set((input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
          ids.add(reason.id);
          input.setAttribute('aria-describedby', [...ids].join(' '));
        } else if (reason) {
          const reasonId = reason.id;
          input.setAttribute(
            'aria-describedby',
            (input.getAttribute('aria-describedby') ?? '')
              .split(/\s+/)
              .filter((id) => id !== reasonId)
              .join(' '),
          );
          reason.remove();
          this.reasons.delete(row);
        }
      }
    }
    const actionable = (grid.items.displayed ?? []).filter(
      (item) => this.keys.includes(this.key(item)) || this.eligible(item),
    );
    this.allInScopeSelected = actionable.length > 0 && actionable.every((item) => this.keys.includes(this.key(item)));
    const headerDisabled = this.blocked() || actionable.length === 0;
    if (grid.selectAllDisabled !== headerDisabled) {
      grid.selectAllDisabled = headerDisabled;
      this.cdr.markForCheck();
    }
    const header = grid.datagridHeader.nativeElement.querySelector<HTMLInputElement>('input[type=checkbox]');
    if (header) {
      header.disabled = headerDisabled;
      header.checked = this.allInScopeSelected;
      header.indeterminate = !this.allInScopeSelected && actionable.some((item) => this.keys.includes(this.key(item)));
    }
  }

  private eligible(item: T): boolean {
    // Native inputs keep ownership of their locks; field loading/readonly never overwrites caller permissions.
    return !this.itemAvailability()(item).disabled && !this.grid!.selection.isLocked(item);
  }

  private selectAll(selected: boolean): void {
    if (this.mode !== SelectionType.Multi) return;
    if (this.blocked()) {
      this.renderSelection();
      return;
    }
    const scope = this.grid!.items.displayed ?? [];
    const scopedKeys = new Set(scope.map((item) => this.key(item)));
    const keys = selected
      ? [
          ...this.keys,
          ...scope
            .filter((item) => this.eligible(item) && !this.keys.includes(this.key(item)))
            .map((item) => this.key(item)),
        ]
      : this.keys.filter((key) => !scopedKeys.has(key));
    this.commit(keys);
  }

  private renderSelection(): void {
    if (!this.grid) return;
    const keys = new Set(this.keys);
    const selected = (this.grid.items.all ?? []).filter((item) => keys.has(this.key(item)));
    const current = this.grid.selection.current ?? [];
    if (current.length !== selected.length || current.some((item, index) => item !== selected[index])) {
      this.grid.selected = selected;
      this.cdr.markForCheck();
    }
  }

  private edit(): void {
    const grid = this.grid!;
    if (this.blocked()) {
      this.renderSelection();
      return;
    }
    const selected = (grid.selection.current ?? []).map((item) => this.key(item));
    const allowed = (grid.selection.current ?? [])
      .filter((item) => this.keys.includes(this.key(item)) || this.eligible(item))
      .map((item) => this.key(item));
    if (grid.selectionType === SelectionType.Single && selected.length > 0 && allowed.length === 0) {
      this.renderSelection();
      return;
    }
    let keys: DatagridSelectionKey[];
    if (grid.selectionType === SelectionType.Single) keys = allowed.slice(0, 1);
    else {
      const supplied = new Set((grid.items.all ?? []).map((item) => this.key(item)));
      keys = [
        ...this.keys.filter((key) => !supplied.has(key) || selected.includes(key)),
        ...allowed.filter((key) => !this.keys.includes(key)),
      ];
    }
    this.commit(keys);
  }

  private commit(keys: DatagridSelectionKey[]): void {
    if (keys.length === this.keys.length && keys.every((key, index) => key === this.keys[index])) {
      this.renderSelection();
      return;
    }
    this.keys = keys;
    this.value = this.grid!.selectionType === SelectionType.Multi ? [...keys] : (keys[0] ?? null);
    this.onChange(this.value as DatagridSelectionValue);
    this.renderSelection();
    this.cdr.markForCheck();
  }
}

function isKey(value: unknown): value is DatagridSelectionKey {
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
}
