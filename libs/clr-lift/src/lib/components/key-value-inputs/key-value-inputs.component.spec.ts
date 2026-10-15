import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {controlValue, toSignalForm} from 'ngx-lift';
import {Subject} from 'rxjs';
import {vi} from 'vitest';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {KeyValueFieldConfig} from './key-value-field-config';
import {KeyValueFormGroup} from './key-value-form-group.type';
import {KeyValueInputsComponent} from './key-value-inputs.component';

describe('KeyValueInputsComponent', () => {
  let component: KeyValueInputsComponent;
  let fixture: ComponentFixture<KeyValueInputsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyValueInputsComponent, ReactiveFormsModule, TranslatePipe],
    });
    fixture = TestBed.createComponent(KeyValueInputsComponent);
    component = fixture.componentInstance;
    TestBed.inject(TranslationService).setLanguage('en', false);

    // Mock the required inputs
    fixture.componentRef.setInput('formArray', new FormArray<KeyValueFormGroup>([]));
    fixture.componentRef.setInput('data', [
      {key: 'key1', value: 'value1'},
      {key: 'key2', value: 'value2'},
    ]);
    fixture.componentRef.setInput('uniqueKey', true);
    fixture.componentRef.setInput('keyHelper', 'Key helper');
    fixture.componentRef.setInput('valueHelper', 'Value helper');
    fixture.componentRef.setInput('addText', 'Add Key-Value Pair');
    fixture.componentRef.setInput('inputSize', 40);
    fixture.componentRef.setInput('smartMode', false);
    fixture.componentRef.setInput('buttonClass', 'btn-sm btn-outline');
    fixture.componentRef.setInput('smartMode', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form data based on input data', () => {
    expect(component.formArray().length).toBe(2);
    expect(component.formArray().at(0).get('key')?.value).toBe('key1');
    expect(component.formArray().at(0).get('value')?.value).toBe('value1');
    expect(component.formArray().at(1).get('key')?.value).toBe('key2');
    expect(component.formArray().at(1).get('value')?.value).toBe('value2');
  });

  it('should add key-value pair on addKeyValuePair', () => {
    const initialLength = component.formArray().length || 0;

    component.addKeyValuePair();

    expect(component.formArray().length).toBe(initialLength + 1);
  });

  it('should remove key-value pair on removeKeyValuePair', () => {
    const initialLength = component.formArray().length || 0;

    component.removeKeyValuePair(0);

    expect(component.formArray().length).toBe(initialLength - 1);
  });
  it('cancels queued focus work when destroyed', () => {
    vi.useFakeTimers();
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    try {
      component.addKeyValuePair();
      fixture.destroy();
      vi.runOnlyPendingTimers();

      expect(focus).not.toHaveBeenCalled();
    } finally {
      focus.mockRestore();
      vi.useRealTimers();
    }
  });

  it('assigns different label targets to separate component instances', () => {
    const otherFixture = TestBed.createComponent(KeyValueInputsComponent);
    otherFixture.componentRef.setInput('formArray', new FormArray<KeyValueFormGroup>([]));
    otherFixture.componentRef.setInput('data', [{key: 'other', value: 'value'}]);
    otherFixture.detectChanges();
    const firstInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const secondInput: HTMLInputElement = otherFixture.nativeElement.querySelector('input');
    const secondLabel: HTMLLabelElement = otherFixture.nativeElement.querySelector('label');

    expect(firstInput.id).not.toBe(secondInput.id);
    expect(secondLabel.htmlFor).toBe(secondInput.id);
  });

  const row = (key: string, value: string): KeyValueFormGroup =>
    new FormGroup({
      key: new FormControl(key, {nonNullable: true}),
      value: new FormControl(value, {nonNullable: true}),
    });
  const options = [
    {value: 'key1', label: 'First key'},
    {value: 'key2', label: 'Second key'},
  ];

  it.each([
    ['input', 'input'],
    ['input', 'select'],
    ['select', 'input'],
    ['select', 'select'],
  ] as const)('edits %s keys and %s values using the original controls', (keyMode, valueMode) => {
    fixture.componentRef.setInput('keyConfig', keyMode === 'select' ? {mode: keyMode, options} : {mode: keyMode});
    fixture.componentRef.setInput(
      'valueConfig',
      valueMode === 'select'
        ? {
            mode: valueMode,
            options: [
              {value: 'value1', label: 'First value'},
              {value: 'value2', label: 'Second value'},
            ],
          }
        : {mode: valueMode},
    );
    fixture.detectChanges();
    const fields = fixture.nativeElement.querySelector('[data-key-value-row="0"]').querySelectorAll('input, select');
    expect(fields[0].tagName).toBe(keyMode === 'select' ? 'SELECT' : 'INPUT');
    expect(fields[1].tagName).toBe(valueMode === 'select' ? 'SELECT' : 'INPUT');
    fields[1].value = 'value2';
    fields[1].dispatchEvent(new Event(valueMode === 'select' ? 'change' : 'input'));
    expect(component.formArray().at(0).controls.value.value).toBe('value2');
    expect(component.formArray().valid).toBe(true);
  });

  it('keeps existing rows instead of appending data or a smart-mode row', () => {
    const existing = new FormArray([row('existing', 'saved')]);
    fixture.componentRef.setInput('formArray', existing);
    fixture.componentRef.setInput('smartMode', true);
    fixture.detectChanges();
    fixture.componentRef.setInput('data', [{key: 'new', value: 'new'}]);
    fixture.detectChanges();
    expect(existing.getRawValue()).toEqual([{key: 'existing', value: 'saved'}]);
    expect(existing.pristine).toBe(true);
  });

  it('seeds smart mode once and does not emit a user add event', () => {
    const added = vi.fn();
    component.addKeyValue.subscribe(added);
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('smartMode', true);
    fixture.componentRef.setInput('formArray', new FormArray<KeyValueFormGroup>([]));
    fixture.detectChanges();
    fixture.componentRef.setInput('keyHelper', 'Changed helper');
    fixture.detectChanges();
    expect(component.formArray().length).toBe(1);
    expect(added).not.toHaveBeenCalled();
    expect(component.formArray().pristine).toBe(true);
  });

  it('marks every duplicate key and clears errors immediately after correction or removal', () => {
    const array = component.formArray();
    array.at(1).controls.key.setValue('key1');
    expect(array.controls.every((group) => group.controls.key.hasError('notUnique'))).toBe(true);
    array.at(1).controls.key.setValue('key3');
    expect(array.valid).toBe(true);
    array.at(1).controls.key.setValue('key1');
    component.removeKeyValuePair(1);
    expect(array.at(0).controls.key.errors).toBeNull();
    expect(array.valid).toBe(true);
    expect(array.dirty).toBe(true);
  });

  it('allows repeated keys with distinct values and rejects only duplicate pairs', () => {
    fixture.componentRef.setInput('uniqueKey', false);
    fixture.componentRef.setInput('uniqueKeyValuePair', true);
    fixture.detectChanges();
    const array = component.formArray();
    array.at(1).controls.key.setValue('key1');
    expect(array.valid).toBe(true);
    array.at(1).controls.value.setValue('value1');
    expect(
      array.controls.every(
        (group) => group.controls.key.hasError('duplicatePair') && group.controls.value.hasError('duplicatePair'),
      ),
    ).toBe(true);
    array.at(1).controls.value.setValue('value3');
    expect(array.valid).toBe(true);
    fixture.componentRef.setInput('uniqueKeyValuePair', false);
    fixture.detectChanges();
    array.at(1).controls.value.setValue('value1');
    expect(array.valid).toBe(true);
  });

  it('compares pairs without delimiter collisions', () => {
    fixture.componentRef.setInput('uniqueKey', false);
    fixture.componentRef.setInput('uniqueKeyValuePair', true);
    fixture.componentRef.setInput('formArray', new FormArray([row('a::b', 'c'), row('a', 'b::c')]));
    fixture.detectChanges();
    expect(component.formArray().valid).toBe(true);
  });

  it('excludes disabled rows from duplicate checks and prevents their removal', () => {
    const array = component.formArray();
    array.at(1).controls.key.setValue('key1');
    array.at(1).disable();
    expect(array.valid).toBe(true);
    component.removeKeyValuePair(1);
    expect(array.length).toBe(2);
    array.at(1).enable();
    expect(array.invalid).toBe(true);
  });

  it('disables occupied key options and stops adding when choices are exhausted', () => {
    fixture.componentRef.setInput('keyConfig', {mode: 'select', options});
    fixture.detectChanges();
    const selects: NodeListOf<HTMLSelectElement> = fixture.nativeElement.querySelectorAll('select');
    expect(selects[0].querySelector<HTMLOptionElement>('option[value="key2"]')?.disabled).toBe(true);
    expect(selects[0].querySelector<HTMLOptionElement>('option[value="key1"]')?.disabled).toBe(false);
    expect(component.canAdd()).toBe(false);
    component.addKeyValuePair();
    expect(component.formArray().length).toBe(2);
    component.removeKeyValuePair(1);
    expect(component.canAdd()).toBe(true);
    component.addKeyValuePair();
    expect(component.formArray().at(1).controls.key.hasError('required')).toBe(true);
    expect(component.formArray().dirty).toBe(true);
  });

  it('renders unavailable saved selections and validates option updates without erasing data', () => {
    fixture.componentRef.setInput('valueConfig', {mode: 'select', options: []});
    fixture.detectChanges();
    const value = component.formArray().at(0).controls.value;
    expect(value.hasError('selection')).toBe(true);
    expect(fixture.nativeElement.querySelector('select').value).toBe('value1');
    value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Select a value from the available options');
    fixture.componentRef.setInput('valueConfig', {mode: 'select', options: [{value: 'value1', label: 'Saved value'}]});
    fixture.detectChanges();
    expect(value.errors).toBeNull();
    expect(value.value).toBe('value1');
  });

  it('switches value editors by key, resetting only when explicitly requested', () => {
    const config = (key: string): KeyValueFieldConfig =>
      key === 'key1' ? {mode: 'select', options: [{value: 'value1', label: 'Value one'}]} : {mode: 'input'};
    fixture.componentRef.setInput('valueConfig', config);
    fixture.detectChanges();
    const group = component.formArray().at(0);
    group.controls.key.setValue('other');
    fixture.detectChanges();
    expect(group.controls.value.value).toBe('value1');
    expect(fixture.nativeElement.querySelector('[data-key-value-row="0"] select')).toBeNull();
    fixture.componentRef.setInput('resetValueOnKeyChange', true);
    fixture.detectChanges();
    group.controls.value.markAsTouched();
    group.controls.key.setValue('key1');
    fixture.detectChanges();
    expect(group.controls.value.value).toBe('');
    expect(group.controls.value.untouched).toBe(true);
    expect(group.controls.value.hasError('required')).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-key-value-row="0"] select')).not.toBeNull();
  });

  it('preserves parent validators while adding and removing configured field validators', () => {
    const value = component.formArray().at(0).controls.value;
    const parentValidator = Validators.maxLength(3);
    value.addValidators(parentValidator);
    fixture.componentRef.setInput('valueConfig', {
      validators: [{validator: Validators.pattern('^x+$'), errorKey: 'pattern', message: 'Use x only'}],
    });
    fixture.detectChanges();
    value.markAsTouched();
    fixture.detectChanges();
    expect(value.hasError('maxlength')).toBe(true);
    expect(value.hasError('pattern')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Use x only');
    fixture.componentRef.setInput('valueConfig', {required: false});
    fixture.detectChanges();
    expect(value.hasError('pattern')).toBe(false);
    expect(value.hasError('maxlength')).toBe(true);
    fixture.destroy();
    expect(value.hasValidator(parentValidator)).toBe(true);
    value.setValue('');
    expect(value.valid).toBe(true);
  });

  it('respects optional values and updates legacy pattern inputs on existing rows', () => {
    fixture.componentRef.setInput('valueConfig', {required: false});
    fixture.componentRef.setInput('keyPattern', {regex: '^key1$'});
    fixture.detectChanges();
    component.formArray().at(0).controls.value.setValue('');
    expect(component.formArray().at(0).valid).toBe(true);
    expect(component.formArray().at(1).controls.key.hasError('pattern')).toBe(true);
  });

  it('notifies value signals when a key change resets a text value, preserving disabled state', () => {
    const group = component.formArray().at(0);
    const value = TestBed.runInInjectionContext(() => controlValue<string>(group.controls.value));
    fixture.componentRef.setInput('resetValueOnKeyChange', true);
    fixture.detectChanges();
    group.controls.value.disable();
    group.controls.key.setValue('changed');
    expect(value()).toBe('');
    expect(group.controls.value.disabled).toBe(true);
  });

  it('refreshes the add button when array-level async validation completes', async () => {
    fixture.autoDetectChanges();
    const array = component.formArray();
    const result = new Subject<null>();
    array.setAsyncValidators(() => result);
    array.updateValueAndValidity();
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-add-key-value]');
    expect(button.disabled).toBe(true);
    result.next(null);
    await fixture.whenStable();
    expect(array.valid).toBe(true);
    expect(button.disabled).toBe(false);
  });

  it('detaches old controls and subscribes to parent-added and replacement rows', () => {
    const previous = component.formArray();
    const replacement = new FormArray([row('fresh', 'value')]);
    fixture.componentRef.setInput('formArray', replacement);
    fixture.componentRef.setInput('resetValueOnKeyChange', true);
    fixture.detectChanges();
    previous.at(0).controls.key.setValue('old');
    expect(previous.at(0).controls.value.value).toBe('value1');
    replacement.push(row('fresh', 'other'));
    expect(replacement.at(1).controls.key.hasError('notUnique')).toBe(true);
    replacement.setControl(1, row('replacement', 'value'));
    expect(replacement.valid).toBe(true);
    replacement.at(1).controls.key.setValue('changed');
    expect(replacement.at(1).controls.value.value).toBe('');
  });

  it('blocks add and delete while the array is disabled', () => {
    const array = component.formArray();
    array.disable();
    fixture.detectChanges();
    component.addKeyValuePair();
    component.removeKeyValuePair(0);
    expect(array.length).toBe(2);
    expect(
      [...fixture.nativeElement.querySelectorAll('input, select, button')].every(
        (element) => (element as HTMLInputElement).disabled,
      ),
    ).toBe(true);
    array.enable();
    expect(component.canAdd()).toBe(true);
  });

  it('keeps toSignalForm values, validation and async completion synchronized', () => {
    const array = component.formArray();
    const form = new FormGroup({pairs: array});
    const sf = TestBed.runInInjectionContext(() => toSignalForm(form));
    const check = new Subject<null>();
    array.at(0).controls.value.setAsyncValidators(() => check);
    array.at(0).controls.value.updateValueAndValidity();
    expect(sf.pending()).toBe(true);
    expect(component.canAdd()).toBe(false);
    check.next(null);
    expect(sf.valid()).toBe(true);
    array.at(1).controls.key.setValue('key1');
    expect(sf.invalid()).toBe(true);
    expect(sf.value().pairs[1].key).toBe('key1');
    array.at(0).controls.value.clearAsyncValidators();
    component.removeKeyValuePair(1);
    expect(sf.valid()).toBe(true);
    expect(sf.submitValue().pairs).toEqual([{key: 'key1', value: 'value1'}]);
  });

  it('focuses the select key after adding and the add button after deleting the last row', () => {
    vi.useFakeTimers();
    try {
      fixture.componentRef.setInput('keyConfig', {
        mode: 'select',
        options: [...options, {value: 'key3', label: 'Third'}],
      });
      fixture.detectChanges();
      component.addKeyValuePair();
      fixture.detectChanges();
      vi.runOnlyPendingTimers();
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('[data-key-value-row="2"] select'));
      component.removeKeyValuePair(2);
      component.removeKeyValuePair(1);
      component.removeKeyValuePair(0);
      fixture.detectChanges();
      vi.runOnlyPendingTimers();
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('[data-add-key-value]'));
    } finally {
      vi.useRealTimers();
    }
  });
});
