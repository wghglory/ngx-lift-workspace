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

@Component({
  selector: 'cll-key-value-inputs',
  standalone: true,
  imports: [TranslatePipe, ClarityModule, ReactiveFormsModule],
  templateUrl: './key-value-inputs.component.html',
  styleUrls: ['./key-value-inputs.component.scss'],
})
export class KeyValueInputsComponent implements OnInit {
  private translationService = inject(TranslationService);
  private fb = inject(NonNullableFormBuilder);
  private hostElement = inject(ElementRef).nativeElement;

  formArray = input.required<FormArray<KeyValueFormGroup>>();
  data = input<{key: string; value: string}[]>([]);
  uniqueKey = input(true);
  keyPattern = input<{regex: string | RegExp; message?: string}>();
  valuePattern = input<{regex: string | RegExp; message?: string}>();
  keyHelper = input('');
  valueHelper = input('');
  inputSize = input(40);
  buttonClass = input('');
  smartMode = input(false);
  _addText = input('', {alias: 'addText'});

  addText = computed(() => this._addText() || this.translationService.translate('key-value.add'));

  removeKeyValue = output<number>();
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
    if (this.data().length > 0) {
      this.data().forEach((prop) => {
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
