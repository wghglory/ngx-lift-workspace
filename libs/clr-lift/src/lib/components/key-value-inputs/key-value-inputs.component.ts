import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ValueChangeEvent,
} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {Subscription} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {KeyValueFieldConfig, KeyValueValueConfig} from './key-value-field-config';
import {KeyValueFieldComponent} from './key-value-field.component';
import {KeyValueFormGroup} from './key-value-form-group.type';
import {keyValueFieldErrors} from './key-value-validators';
import {keyValueTranslations} from './key-value.l10n';

let nextControlId = 0;

interface RowBinding {
  keyValidator: ValidatorFn;
  valueValidator: ValidatorFn;
  keyChanges: Subscription;
  keyDependencies?: readonly unknown[];
  valueDependencies?: readonly unknown[];
}

/** Dynamic string key/value rows backed by the caller's Reactive Forms controls. */
@Component({
  selector: 'cll-key-value-inputs',
  imports: [TranslatePipe, ClarityModule, KeyValueFieldComponent],
  templateUrl: './key-value-inputs.component.html',
  styleUrls: ['./key-value-inputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueInputsComponent implements OnChanges, OnDestroy {
  private readonly translationService = inject(TranslationService);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly initialized = new WeakSet<FormArray<KeyValueFormGroup>>();
  private readonly bindings = new Map<KeyValueFormGroup, RowBinding>();
  private activeArray?: FormArray<KeyValueFormGroup>;
  private arrayChanges?: Subscription;
  private focusTimer?: ReturnType<typeof setTimeout>;
  private refreshing = false;
  private readonly uniquenessValidator: ValidatorFn = () => {
    const errors: ValidationErrors = {};
    for (const row of this.activeArray?.controls ?? []) {
      if (row.disabled) continue;
      if (row.controls.key.hasError('notUnique')) errors['notUnique'] = true;
      if (row.controls.key.hasError('duplicatePair') || row.controls.value.hasError('duplicatePair')) {
        errors['duplicatePair'] = true;
      }
    }
    return Object.keys(errors).length ? errors : null;
  };
  readonly controlIdPrefix = `cll-key-value-${nextControlId++}`;

  readonly formArray = input.required<FormArray<KeyValueFormGroup>>();
  /** Seeds an empty array once per array instance. Existing rows always take precedence. */
  readonly data = input<{key: string; value: string}[]>([]);
  readonly keyConfig = input<KeyValueFieldConfig>({});
  readonly valueConfig = input<KeyValueValueConfig>({});
  /** Opt in for dependent values; default false preserves free-text editing behavior. */
  readonly resetValueOnKeyChange = input(false);
  readonly uniqueKey = input(true);
  readonly uniqueKeyValuePair = input(false);
  readonly keyPattern = input<{regex: string | RegExp; message?: string}>();
  readonly valuePattern = input<{regex: string | RegExp; message?: string}>();
  readonly keyHelper = input('');
  readonly valueHelper = input('');
  readonly inputSize = input(40);
  readonly buttonClass = input('');
  readonly smartMode = input(false);
  readonly addText = input('');
  readonly computedAddText = computed(() => this.addText() || this.translationService.translate('key-value.add'));
  readonly removeKeyValue = output<number>();
  readonly addKeyValue = output<void>();

  readonly keyValidators = computed(() => this.patternValidators(this.keyPattern()));
  readonly valueValidators = computed(() => this.patternValidators(this.valuePattern()));

  constructor() {
    this.translationService.loadTranslationsForComponent('key-value', keyValueTranslations);
    inject(DestroyRef).onDestroy(() => clearTimeout(this.focusTimer));
  }

  ngOnChanges(): void {
    const array = this.formArray();
    if (this.activeArray !== array) {
      this.detachArray();
      this.activeArray = array;
      array.addValidators(this.uniquenessValidator);
      if (!this.initialized.has(array)) {
        this.initialized.add(array);
        if (array.length === 0) {
          const initial = this.data().length ? this.data() : this.smartMode() ? [{key: '', value: ''}] : [];
          initial.forEach(({key, value}) => array.push(this.createRow(key, value), {emitEvent: false}));
        }
      }
      this.arrayChanges = array.events.subscribe((event) => {
        if (event instanceof ValueChangeEvent) this.refreshRows();
        this.cdr.markForCheck();
      });
    }
    this.refreshRows();
  }

  ngOnDestroy(): void {
    this.detachArray();
  }

  resolveValueConfig(key: string): KeyValueFieldConfig {
    const config = this.valueConfig();
    return typeof config === 'function' ? config(key) : config;
  }

  resolveKeyConfig(row: KeyValueFormGroup): KeyValueFieldConfig {
    const config = this.keyConfig();
    if (config.mode !== 'select' || !this.uniqueKey()) return config;
    const selected = new Set(
      this.formArray()
        .controls.filter((other) => other !== row && other.enabled && other.controls.key.enabled)
        .map((other) => other.controls.key.value),
    );
    return {
      ...config,
      options: config.options.map((option) => ({
        ...option,
        disabled: option.disabled || (option.value !== row.controls.key.value && selected.has(option.value)),
      })),
    };
  }

  canAdd(): boolean {
    const array = this.formArray();
    if (array.disabled || array.pending || (array.invalid && array.length > 0)) return false;
    const config = this.keyConfig();
    if (config.mode !== 'select') return true;
    const selected = new Set(
      array.controls.filter((row) => row.enabled && row.controls.key.enabled).map((row) => row.controls.key.value),
    );
    return config.options.some(
      (option) => option.value !== '' && !option.disabled && (!this.uniqueKey() || !selected.has(option.value)),
    );
  }

  addKeyValuePair(): void {
    if (!this.canAdd()) return;
    const row = this.createRow('', '');
    this.formArray().push(row);
    this.formArray().markAsDirty();
    this.addKeyValue.emit();
    this.focusRow(row);
  }

  removeKeyValuePair(index: number): void {
    const array = this.formArray();
    if (array.disabled || !array.at(index) || index < 0 || array.at(index).disabled) return;
    array.removeAt(index);
    array.markAsDirty();
    this.removeKeyValue.emit(index);
    this.focusRow(array.at(Math.min(index, array.length - 1)));
  }

  /** Retained for callers that explicitly revalidate on blur. */
  validateKeyControl(control: AbstractControl): void {
    control.updateValueAndValidity();
  }

  _validateKeyControl(index: number): void {
    this.formArray().at(index)?.controls.key.updateValueAndValidity();
  }

  private patternValidators(pattern: {regex: string | RegExp} | undefined): ValidatorFn[] {
    return pattern ? [Validators.pattern(pattern.regex)] : [];
  }

  private createRow(key: string, value: string): KeyValueFormGroup {
    const row = new FormGroup({
      key: new FormControl(key, {nonNullable: true}),
      value: new FormControl(value, {nonNullable: true}),
    });
    if (this.formArray().disabled) row.disable({emitEvent: false});
    return row;
  }

  private bindRow(row: KeyValueFormGroup): void {
    if (this.bindings.has(row)) return;
    const validator =
      (field: 'key' | 'value'): ValidatorFn =>
      (control) =>
        keyValueFieldErrors(
          control,
          field,
          field === 'key' ? this.keyConfig() : this.resolveValueConfig(row.controls.key.value),
          field === 'key' ? this.keyValidators() : this.valueValidators(),
          row,
          this.formArray().controls,
          this.uniqueKey(),
          this.uniqueKeyValuePair(),
        );
    const keyValidator = validator('key');
    const valueValidator = validator('value');
    row.controls.key.addValidators(keyValidator);
    row.controls.value.addValidators(valueValidator);
    let previousKey = row.controls.key.value;
    const keyChanges = row.controls.key.valueChanges.subscribe((key) => {
      const changed = key !== previousKey;
      previousKey = key;
      if (changed && this.resetValueOnKeyChange()) row.controls.value.reset('', {onlySelf: true});
    });
    this.bindings.set(row, {keyValidator, valueValidator, keyChanges});
  }

  private unbindRow(row: KeyValueFormGroup, binding: RowBinding): void {
    binding.keyChanges.unsubscribe();
    row.controls.key.removeValidators(binding.keyValidator);
    row.controls.value.removeValidators(binding.valueValidator);
    this.revalidateRow(row);
    this.bindings.delete(row);
  }

  private revalidateRow(row: KeyValueFormGroup, emitEvent = true): void {
    row.controls.key.updateValueAndValidity({onlySelf: true, emitEvent});
    row.controls.value.updateValueAndValidity({onlySelf: true, emitEvent});
    row.updateValueAndValidity({onlySelf: true, emitEvent});
  }

  private refreshRows(): void {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const array = this.formArray();
      for (const [row, binding] of this.bindings) {
        if (!array.controls.includes(row)) this.unbindRow(row, binding);
      }
      array.controls.forEach((row) => this.bindRow(row));
      const keys = array.controls.flatMap((row) => [
        row,
        row.enabled,
        row.controls.key.enabled,
        row.controls.key.value,
      ]);
      const pairs = array.controls.flatMap((row) => [
        row,
        row.enabled,
        row.controls.key.enabled,
        row.controls.value.enabled,
        row.controls.key.value,
        row.controls.value.value,
      ]);
      let changed = false;
      // Revalidate only fields whose validation inputs changed, preserving unrelated async work.
      for (const row of array.controls) {
        const binding = this.bindings.get(row);
        if (!binding) continue;
        const pairDependencies = this.uniqueKeyValuePair() ? pairs : [];
        const keyDependencies = [
          this.keyConfig(),
          this.keyPattern(),
          this.uniqueKey(),
          this.uniqueKeyValuePair(),
          row.controls.key.enabled,
          ...(this.uniqueKey() ? keys : []),
          ...pairDependencies,
        ];
        const valueDependencies = [
          this.valueConfig(),
          this.valuePattern(),
          this.uniqueKeyValuePair(),
          row.controls.value.enabled,
          typeof this.valueConfig() === 'function' ? row.controls.key.value : undefined,
          ...pairDependencies,
        ];
        const keyChanged = this.dependenciesChanged(binding.keyDependencies, keyDependencies);
        const valueChanged = this.dependenciesChanged(binding.valueDependencies, valueDependencies);
        binding.keyDependencies = keyDependencies;
        binding.valueDependencies = valueDependencies;
        if (keyChanged) row.controls.key.updateValueAndValidity({onlySelf: true});
        if (valueChanged) row.controls.value.updateValueAndValidity({onlySelf: true});
        if (keyChanged || valueChanged) {
          row.updateValueAndValidity({onlySelf: true});
          changed = true;
        }
      }
      if (changed) array.updateValueAndValidity();
    } finally {
      this.refreshing = false;
    }
  }

  private dependenciesChanged(previous: readonly unknown[] | undefined, next: readonly unknown[]): boolean {
    return (
      !previous || previous.length !== next.length || next.some((value, index) => !Object.is(value, previous[index]))
    );
  }

  private detachArray(): void {
    this.arrayChanges?.unsubscribe();
    for (const [row, binding] of this.bindings) this.unbindRow(row, binding);
    this.activeArray?.removeValidators(this.uniquenessValidator);
    this.activeArray?.updateValueAndValidity();
  }

  private focusRow(row?: KeyValueFormGroup): void {
    clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      const index = row ? this.formArray().controls.indexOf(row) : -1;
      const element =
        index < 0
          ? this.hostElement.querySelector<HTMLElement>('[data-add-key-value]')
          : this.hostElement.querySelector<HTMLElement>(
              `[data-key-value-row="${index}"] [data-key-field] input, [data-key-value-row="${index}"] [data-key-field] select`,
            );
      element?.focus();
    });
  }
}
