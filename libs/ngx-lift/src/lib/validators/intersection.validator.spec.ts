import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

import {intersectionValidator} from './intersection.validator';

describe('intersectionValidator', () => {
  let formGroup: FormGroup;
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = intersectionValidator('field1', 'field2');

    formGroup = new FormGroup(
      {
        field1: new FormControl([]),
        field2: new FormControl([]),
      },
      {validators: validator},
    );
  });

  it('should return null when no intersection exists', () => {
    const field1 = formGroup.get('field1');
    const field2 = formGroup.get('field2');
    if (field1 && field2) {
      field1.setValue(['apple', 'banana']);
      field2.setValue(['orange', 'grape']);
    }

    formGroup.updateValueAndValidity();

    expect(formGroup.errors).toBeNull();
  });

  it('should return an error when an intersection exists', () => {
    const field1 = formGroup.get('field1');
    const field2 = formGroup.get('field2');
    if (field1 && field2) {
      field1.setValue(['apple', 'banana']);
      field2.setValue(['banana', 'orange']);
    }

    formGroup.updateValueAndValidity();

    expect(formGroup.errors).toEqual({intersection: true});
  });

  it('should return null when one of the controls is missing', () => {
    formGroup = new FormGroup(
      {
        field1: new FormControl(['apple', 'banana']),
      },
      {validators: validator},
    );

    formGroup.updateValueAndValidity();

    expect(formGroup.errors).toBeNull();
  });

  it('should return null when one of the controls is not an array', () => {
    formGroup = new FormGroup(
      {
        field1: new FormControl('apple'),
        field2: new FormControl(['orange', 'grape']),
      },
      {validators: validator},
    );

    formGroup.updateValueAndValidity();

    expect(formGroup.errors).toBeNull();
  });

  it('preserves unrelated control errors while adding and removing intersection errors', () => {
    const field1 = new FormControl(['shared']);
    const field2 = new FormControl(['shared']);
    const group = new FormGroup({field1, field2}, {validators: validator});
    field1.setErrors({...field1.errors, server: true});
    group.updateValueAndValidity();
    expect(field1.errors).toEqual({server: true, intersection: true});

    field2.setValue(['different']);
    expect(field1.errors).toEqual({server: true});
    expect(field2.errors).toBeNull();
  });

  it('does not clear a required error when both selections are empty', () => {
    const field1 = new FormControl([], Validators.required);
    const field2 = new FormControl([]);
    new FormGroup({field1, field2}, {validators: validator});

    expect(field1.errors).toEqual({required: true});
  });

  it('clears stale intersection errors when a control changes to a non-array value', () => {
    const field1 = new FormControl<unknown>(['shared']);
    const field2 = new FormControl<unknown>(['shared']);
    const group = new FormGroup({field1, field2}, {validators: validator});
    field2.setValue(null);

    expect(group.errors).toBeNull();
    expect(field1.errors).toBeNull();
  });
});
