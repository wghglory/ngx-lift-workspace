import {Component, computed, ElementRef, inject, input, OnInit, output} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {UniqueValidator} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {keyValueTranslations} from './key-value.l10n';
import {KeyValueFormGroup} from './key-value-form-group.type';

/**
 * A component for managing dynamic key-value pair inputs in a form.
 * Supports validation, uniqueness checking, pattern matching, and smart mode for automatic key-value management.
 *
 * @example
 * ```html
 * <cll-key-value-inputs
 *   [formArray]="keyValueFormArray"
 *   [uniqueKey]="true"
 *   [keyPattern]="{ regex: '^[A-Z_]+$', message: 'Keys must be uppercase' }"
 *   (addKeyValue)="onAdd()"
 *   (removeKeyValue)="onRemove($event)"
 * />
 * ```
 */
@Component({
  selector: 'cll-key-value-inputs',
  imports: [TranslatePipe, ClarityModule, ReactiveFormsModule],
  templateUrl: './key-value-inputs.component.html',
  styleUrls: ['./key-value-inputs.component.scss'],
})
export class KeyValueInputsComponent implements OnInit {
  private translationService = inject(TranslationService);
  private fb = inject(NonNullableFormBuilder);
  private hostElement = inject(ElementRef).nativeElement;

  /**
   * The FormArray containing key-value form groups.
   * Required input for managing the key-value pairs.
   */
  formArray = input.required<FormArray<KeyValueFormGroup>>();

  /**
   * Initial data to populate the form array.
   * Array of objects with `key` and `value` properties.
   */
  data = input<{key: string; value: string}[]>([]);

  /**
   * Whether keys must be unique across all key-value pairs.
   * If `true`, the UniqueValidator is applied to ensure no duplicate keys.
   * Defaults to `true`.
   */
  uniqueKey = input(true);

  /**
   * Optional pattern validator configuration for keys.
   * Contains a regex pattern and optional error message.
   */
  keyPattern = input<{regex: string | RegExp; message?: string}>();

  /**
   * Optional pattern validator configuration for values.
   * Contains a regex pattern and optional error message.
   */
  valuePattern = input<{regex: string | RegExp; message?: string}>();

  /**
   * Helper text to display for the key input field.
   */
  keyHelper = input('');

  /**
   * Helper text to display for the value input field.
   */
  valueHelper = input('');

  /**
   * The size (width) of the input fields in characters.
   * Defaults to 40.
   */
  inputSize = input(40);

  /**
   * Additional CSS classes to apply to action buttons.
   */
  buttonClass = input('');

  /**
   * Whether smart mode is enabled.
   * In smart mode, the component provides enhanced UX features.
   * Defaults to `false`.
   */
  smartMode = input(false);

  /**
   * Custom text for the "Add" button.
   * If not provided, uses the default translation key 'key-value.add'.
   */
  addText = input('');

  /**
   * Computed text for the "Add" button.
   * Uses custom text if provided, otherwise falls back to translation.
   */
  computedAddText = computed(() => this.addText() || this.translationService.translate('key-value.add'));

  /**
   * Event emitted when a key-value pair is removed.
   * Emits the index of the removed pair.
   */
  removeKeyValue = output<number>();

  /**
   * Event emitted when a new key-value pair is added.
   */
  addKeyValue = output<void>();

  keyValidators = computed(() => {
    const keyPattern = this.keyPattern();
    const keyPatternValidator = keyPattern && Validators.pattern(keyPattern.regex);
    return [Validators.required, keyPatternValidator].filter((item) => item !== undefined);
  });

  valueValidators = computed(() => {
    const valuePattern = this.valuePattern();
    const valuePatternValidator = valuePattern && Validators.pattern(valuePattern.regex);
    return [Validators.required, valuePatternValidator].filter((item) => item !== undefined);
  });

  constructor() {
    this.translationService.loadTranslationsForComponent('key-value', keyValueTranslations);
  }

  removeKeyValuePair(index: number) {
    this.formArray().removeAt(index);
    this.validateAllKeyControls();
    this.removeKeyValue.emit(index);
  }

  addKeyValuePair() {
    const group = this.fb.group({
      key: ['', this.keyValidators()],
      value: ['', this.valueValidators()],
    });
    this.formArray().push(group);
    this.addKeyValue.emit();

    this.focusOnLastKeyControl();
  }

  _validateKeyControl(index: number) {
    this.formArray().controls[index].controls.key.updateValueAndValidity();
  }
  validateKeyControl(control: AbstractControl) {
    control.updateValueAndValidity();
  }

  ngOnInit() {
    this.addUniqueKeyValidator();

    this.initializeFormData();
  }

  private validateAllKeyControls() {
    this.formArray().controls.forEach((group) => {
      group.controls.key.updateValueAndValidity();
    });
  }

  private addUniqueKeyValidator() {
    if (this.uniqueKey()) {
      const selector = (control: AbstractControl): AbstractControl =>
        (control as FormGroup<{key: FormControl<string>}>).controls.key;

      this.formArray().addValidators(UniqueValidator.unique(selector));

      this.formArray().updateValueAndValidity();
    }
  }

  private initializeFormData() {
    const data = this.data();
    if (data && data.length > 0) {
      data.forEach((prop) => {
        this.formArray().push(
          this.fb.group({
            key: [prop.key || '', this.keyValidators()],
            value: [prop.value || '', this.valueValidators()],
          }),
        );
      });
    } else {
      this.addPairForSmartMode();
    }
  }

  private addPairForSmartMode() {
    if (this.smartMode()) {
      this.addKeyValuePair();
    }
  }

  private focusOnLastKeyControl() {
    setTimeout(() => {
      const inputs = this.hostElement.getElementsByTagName('input');
      const lastKeyControl = inputs[inputs.length - 2];
      lastKeyControl.focus();
    });
  }
}
