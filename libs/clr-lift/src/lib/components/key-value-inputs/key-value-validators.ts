import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

import {KeyValueFieldConfig} from './key-value-field-config';
import {KeyValueFormGroup} from './key-value-form-group.type';

/** Pure field validation avoids mutating sibling errors from an array validator. */
export function keyValueFieldErrors(
  control: AbstractControl,
  field: 'key' | 'value',
  config: KeyValueFieldConfig,
  patterns: readonly ValidatorFn[],
  row: KeyValueFormGroup,
  rows: readonly KeyValueFormGroup[],
  uniqueKey: boolean,
  uniquePair: boolean,
): ValidationErrors | null {
  const validators = [
    ...(config.required === false ? [] : [Validators.required]),
    ...patterns,
    ...(config.validators ?? []).map((validation) => validation.validator),
  ];
  const errors: ValidationErrors = {};
  for (const validate of validators) Object.assign(errors, validate(control));
  if (
    config.mode === 'select' &&
    control.value !== '' &&
    !config.options.some((option) => option.value === control.value)
  )
    errors['selection'] = true;

  const key = row.controls.key.value;
  const value = row.controls.value.value;
  const others = rows.filter((other) => other !== row && other.enabled);
  if (
    field === 'key' &&
    uniqueKey &&
    key !== '' &&
    others.some((other) => other.controls.key.enabled && other.controls.key.value === key)
  )
    errors['notUnique'] = true;
  if (
    uniquePair &&
    key !== '' &&
    value !== '' &&
    row.controls.key.enabled &&
    row.controls.value.enabled &&
    others.some(
      (other) =>
        other.controls.key.enabled &&
        other.controls.value.enabled &&
        other.controls.key.value === key &&
        other.controls.value.value === value,
    )
  )
    errors['duplicatePair'] = true;
  return Object.keys(errors).length ? errors : null;
}
