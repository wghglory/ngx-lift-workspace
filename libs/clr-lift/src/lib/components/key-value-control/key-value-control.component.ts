import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DoCheck,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  Injector,
  AfterViewInit,
  signal,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  NgControl,
  NgForm,
  FormGroupDirective,
  TouchedChangeEvent,
} from '@angular/forms';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ClarityModule} from '@clr/angular';
import {Subscription} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {keyValueTranslations} from '../key-value-inputs/key-value.l10n';
import {KeyValueEntry, KeyValueValue, KeyValueKeyConfig, KeyValueValueConfig} from './key-value-entry.type';
import {KeyValueFieldComponent} from './key-value-field.component';
import {
  keyValueErrors,
  resolveValueConfig,
  emptyFieldValue,
  copyFieldValue,
  isKeyValueEntries,
} from './key-value-validation';

interface EditorRow extends KeyValueEntry<KeyValueValue> {
  readonly id: number;
}
let nextId = 0;

/**
 * An ordered array-value editor for Angular 21 ngModel and Reactive Forms, including toSignalForm.
 * Use KeyValueInputsComponent instead when the caller owns individual FormArray row controls.
 *
 * @example
 * ```html
 * <cll-key-value-control label="Labels" [formControl]="labels" [maxRows]="10" />
 * ```
 */
@Component({
  selector: 'cll-key-value-control',
  imports: [TranslatePipe, ClarityModule, KeyValueFieldComponent],
  templateUrl: './key-value-control.component.html',
  styleUrl: './key-value-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KeyValueControlComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => KeyValueControlComponent), multi: true},
  ],
  host: {'(focusout)': 'leave($event)'},
})
export class KeyValueControlComponent implements ControlValueAccessor, Validator, AfterViewInit, DoCheck {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly translations = inject(TranslationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formGroup = inject(FormGroupDirective, {optional: true, skipSelf: true});
  private readonly ngForm = inject(NgForm, {optional: true, skipSelf: true});
  private reportingTouch = false;
  private owner: AbstractControl | null = null;
  private ownerEvents?: Subscription;
  protected readonly touchedFields = signal<ReadonlySet<string>>(new Set());
  private focusTimer?: ReturnType<typeof setTimeout>;
  private generation = 0;
  private onChange: (value: KeyValueEntry<KeyValueValue>[]) => void = () => {
    /* Angular callback */
  };
  private onTouched: () => void = () => {
    /* Angular callback */
  };
  private onValidatorChange: () => void = () => {
    /* Angular callback */
  };

  /** Accessible composite label. Empty uses the localized Labels default. */
  readonly label = input('');
  /** Caller-owned help associated with every text input. */
  readonly helper = input('');
  /** Minimum row count; validates owner values without synthesizing rows. Default: 0. */
  readonly minRows = input(0);
  /** Optional maximum row count. Oversized owner values are retained and invalid. */
  readonly maxRows = input<number>();
  /** Exact, case-sensitive key uniqueness. Default: true. */
  readonly uniqueKeys = input(true);
  /** Blocks all mutations while preserving focus, inspection and form inclusion. */
  readonly readonly = input(false, {transform: booleanAttribute});

  /** Key editor configuration. Defaults to required free text. */
  readonly keyConfig = input<KeyValueKeyConfig>({});
  /** Value editor configuration, optionally resolved from the current key. */
  readonly valueConfig = input<KeyValueValueConfig>({});
  /** Reset to the new editor's empty value after a user key change. */
  readonly resetValueOnKeyChange = input(false);
  /** Reject duplicate pairs independently from key uniqueness. */
  readonly uniquePairs = input(false);
  /** Exclude other rows' keys from the key choices. */
  readonly excludeSelectedKeys = input(false);
  /** Localized caller-owned add button text. */
  readonly addText = input('');

  protected readonly prefix = `cll-key-value-control-${nextId++}`;
  protected readonly rows = signal<readonly EditorRow[]>([]);
  protected readonly disabled = signal(false);
  protected readonly invalidStructure = signal(false);
  protected readonly announcementCount = signal<number | null>(null);
  protected readonly errors = computed(() =>
    keyValueErrors(
      this.rows(),
      this.minRows(),
      this.maxRows(),
      this.uniqueKeys(),
      this.keyConfig(),
      this.valueConfig(),
      this.uniquePairs(),
    ),
  );
  protected readonly rowErrors = computed(
    () => new Map(this.errors()?.keyValue.rows.map((row) => [row.index, row]) ?? []),
  );
  protected readonly editorRows = computed(() => {
    const rows = this.rows();
    const keyConfig = this.keyConfig();
    const valueConfig = this.valueConfig();
    const exclude = this.excludeSelectedKeys();
    const selected = new Set(rows.map((row) => row.key));
    return rows.map((row) => ({
      ...row,
      keyConfig: exclude
        ? {
            ...keyConfig,
            options: keyConfig.options?.filter((option) => option.value === row.key || !selected.has(option.value)),
          }
        : keyConfig,
      valueConfig: resolveValueConfig(valueConfig, row.key),
    }));
  });
  protected readonly blocked = computed(() => this.disabled() || this.readonly() || this.invalidStructure());
  protected readonly addDisabled = computed(
    () =>
      this.blocked() ||
      this.rows().length >= (this.maxRows() ?? Number.POSITIVE_INFINITY) ||
      (this.excludeSelectedKeys() &&
        (this.keyConfig().type === 'select' || this.keyConfig().type === 'combobox') &&
        this.keyConfig().options !== undefined &&
        !this.keyConfig().options?.some(
          (option) => !option.disabled && !this.rows().some((row) => row.key === option.value),
        )),
  );

  protected readonly addDisabledReason = computed(() => {
    if (this.invalidStructure()) return this.translations.translate('key-value.invalidType');
    if (this.disabled()) return this.translations.translate('key-value.addDisabled');
    if (this.readonly()) return this.translations.translate('key-value.addReadonly');
    if (this.rows().length >= (this.maxRows() ?? Number.POSITIVE_INFINITY))
      return this.translations.translate('key-value.maxRows', this.maxRows());
    return this.addDisabled() ? this.translations.translate('key-value.noAvailableKeys') : '';
  });

  constructor() {
    this.translations.loadTranslationsForComponent('key-value', keyValueTranslations);
    effect(() => {
      this.minRows();
      this.maxRows();
      this.uniqueKeys();
      this.uniquePairs();
      this.keyConfig();
      this.valueConfig();
      untracked(() => this.onValidatorChange());
    });
    effect(() => {
      if (this.readonly()) untracked(() => this.cancelFocus());
    });
    inject(DestroyRef).onDestroy(() => this.cancelFocus());
  }

  ngDoCheck(): void {
    const control = this.injector.get(NgControl, null, {self: true})?.control;
    if (control === this.owner) return;
    this.ownerEvents?.unsubscribe();
    this.owner = control ?? null;
    if (control?.touched) this.revealErrors();
    else this.touchedFields.set(new Set());
    this.ownerEvents = control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof TouchedChangeEvent && !this.reportingTouch) {
        if (event.touched) this.revealErrors();
        else this.touchedFields.set(new Set());
      }
    });
  }

  ngAfterViewInit(): void {
    (this.formGroup ?? this.ngForm)?.ngSubmit
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.revealErrors());
  }

  private revealErrors(): void {
    this.touchedFields.set(new Set(this.rows().flatMap((row) => [`${row.id}-key`, `${row.id}-value`])));
  }

  protected touchField(id: number, field: 'key' | 'value'): void {
    if (this.disabled() || !this.rows().some((row) => row.id === id)) return;
    this.touchedFields.update((fields) => new Set([...fields, `${id}-${field}`]));
  }

  private reportTouch(): void {
    this.reportingTouch = true;
    try {
      this.onTouched();
    } finally {
      this.reportingTouch = false;
    }
  }

  writeValue(value: unknown): void {
    this.cancelFocus();
    this.touchedFields.set(new Set());
    const previous = this.rows();
    const entries = value ?? [];
    this.invalidStructure.set(!isKeyValueEntries(entries));
    this.rows.set(
      (isKeyValueEntries(entries) ? entries : []).map((entry, index) => ({
        key: entry.key,
        value: copyFieldValue(entry.value),
        id: previous[index]?.id ?? nextId++,
      })),
    );
    this.announcementCount.set(null);
    if (this.injector.get(NgControl, null, {self: true})?.control?.touched) this.revealErrors();
  }

  registerOnChange(fn: (value: KeyValueEntry<KeyValueValue>[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.cancelFocus();
    this.disabled.set(disabled);
  }

  validate(control: AbstractControl) {
    return keyValueErrors(
      control.value ?? [],
      this.minRows(),
      this.maxRows(),
      this.uniqueKeys(),
      this.keyConfig(),
      this.valueConfig(),
      this.uniquePairs(),
    );
  }

  protected valueEditor(key: string) {
    return resolveValueConfig(this.valueConfig(), key);
  }

  protected edit(id: number, field: 'key' | 'value', value: KeyValueValue): void {
    if (this.blocked()) return;
    const row = this.rows().find((item) => item.id === id);
    if (!row || row[field] === value) return;
    const config = field === 'key' ? this.keyConfig() : this.valueEditor(row.key);
    if (config.disabled) return;
    if (field === 'key' && typeof value !== 'string') return;
    if (field === 'key' && this.resetValueOnKeyChange()) {
      this.touchedFields.update((fields) => new Set([...fields].filter((name) => name !== `${id}-value`)));
    }
    this.commit(
      this.rows().map((item) => {
        if (item.id !== id) return item;
        if (field === 'value') return {...item, value: copyFieldValue(value)};
        const key = value as string;
        return {
          ...item,
          key,
          value: this.resetValueOnKeyChange() ? emptyFieldValue(this.valueEditor(key)) : item.value,
        };
      }),
    );
  }

  protected add(): void {
    if (this.addDisabled()) return;
    const row: EditorRow = {id: nextId++, key: '', value: emptyFieldValue(this.valueEditor(''))};
    this.commit([...this.rows(), row]);
    this.announcementCount.set(this.rows().length);
    this.focus(row.id);
  }

  protected remove(id: number): void {
    const index = this.rows().findIndex((row) => row.id === id);
    if (this.blocked() || index < 0 || this.rows().length <= this.minRows()) return;
    const rows = this.rows().filter((row) => row.id !== id);
    this.commit(rows);
    this.announcementCount.set(rows.length);
    this.focus(rows[Math.min(index, rows.length - 1)]?.id);
  }

  protected leave(event: FocusEvent): void {
    if (this.disabled() || this.focusTimer !== undefined) return;
    if (event.relatedTarget) {
      if (!this.ownsFocus(event.relatedTarget as Node)) this.reportTouch();
      return;
    }
    // Removal and browser focus transitions can temporarily report no destination.
    const generation = this.generation;
    queueMicrotask(() => {
      if (
        generation === this.generation &&
        !this.disabled() &&
        this.focusTimer === undefined &&
        !this.ownsFocus(this.host.ownerDocument.activeElement)
      )
        this.reportTouch();
    });
  }

  private ownsFocus(target: Node | null): boolean {
    if (this.host.contains(target)) return true;
    return Array.from(this.host.querySelectorAll('[aria-controls], [aria-owns]')).some((input) =>
      (input.getAttribute('aria-controls') ?? input.getAttribute('aria-owns'))
        ?.split(' ')
        .some((id) => this.host.ownerDocument.getElementById(id)?.contains(target)),
    );
  }

  private commit(rows: readonly EditorRow[]): void {
    this.rows.set(rows);
    this.onChange(rows.map(({key, value}) => ({key, value: copyFieldValue(value)})));
  }

  private focus(id: number | undefined): void {
    this.cancelFocus();
    this.focusTimer = setTimeout(() => {
      this.focusTimer = undefined;
      if (!this.blocked()) {
        const row = this.host.querySelector<HTMLElement>(`[data-row-id="${id}"]`);
        const target =
          row?.querySelector<HTMLElement>('input:enabled, select:enabled, textarea:enabled') ??
          this.host.querySelector<HTMLElement>('[data-add]:enabled') ??
          this.host.querySelector<HTMLElement>('fieldset');
        target?.focus();
      }
    });
  }

  private cancelFocus(): void {
    this.generation++;
    clearTimeout(this.focusTimer);
    this.focusTimer = undefined;
  }
}
