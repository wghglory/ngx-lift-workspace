import {TestBed} from '@angular/core/testing';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {UniqueValidator} from './unique.validator';

describe('UniqueValidator', () => {
  it('should validate uniqueness for FormControl in FormArray', () => {
    const fb: FormBuilder = TestBed.inject(FormBuilder);
    const formArray = fb.array(
      [fb.control(1), fb.control(2), fb.control(3), fb.control(''), fb.control(null)],
      [UniqueValidator.unique()],
    );

    expect(formArray.valid).toBeTruthy();
    for (const control of formArray.controls) {
      expect(control.errors).toBeNull();
    }

    // Duplicate value
    formArray.push(fb.control(2));
    expect(formArray.valid).toBeFalse();
    expect(formArray.errors).toEqual({notUnique: true});

    // One pair of duplicate values
    const duplicatedControlIndex = [1, 5];
    for (let i = 0; i < formArray.length; i++) {
      if (duplicatedControlIndex.includes(i)) {
        expect(formArray.at(i).errors).toEqual({notUnique: true});
      } else {
        expect(formArray.at(i).errors).toBeNull();
      }
    }
  });

  it('should validate uniqueness for multiple duplications in FormArray', () => {
    const fb: FormBuilder = TestBed.inject(FormBuilder);
    const formArray = fb.array(
      [fb.control(1), fb.control(2), fb.control(3), fb.control(''), fb.control(''), fb.control(null)],
      [UniqueValidator.unique()],
    );

    const setChildValue = (i: number, value = i + 1) => {
      formArray.at(i).setValue(value);
    };

    // More than one pair of duplicate values
    setChildValue(0, 1);
    setChildValue(1, 1);

    setChildValue(2, 2);
    setChildValue(3, 2);

    setChildValue(4, 3);
    setChildValue(5, 3);

    expect(formArray.valid).toBeFalse();

    for (const control of formArray.controls) {
      expect(control.errors).toEqual({notUnique: true});
    }

    // No duplicate value by changing one of the duplicate values
    for (let i = 0; i < formArray.length; i++) {
      setChildValue(i);
    }
    expect(formArray.valid).toBeTrue();
    for (const control of formArray.controls) {
      expect(control.errors).toBeNull();
    }
  });

  it('should validate uniqueness for nested controls in FormArray', () => {
    const fb: FormBuilder = TestBed.inject(FormBuilder);
    const formArray = fb.array(
      [
        fb.group({key: fb.control(1), value: fb.control(1)}),
        fb.group({key: fb.control(''), value: fb.control('')}),
        fb.group({key: fb.control(''), value: fb.control('')}),
        fb.group({key: fb.control(NaN), value: fb.control(NaN)}),
        fb.group({key: fb.control(NaN), value: fb.control(NaN)}),
      ],
      [UniqueValidator.unique((c) => c.get('key')!)],
    );

    expect(formArray.valid).toBeTrue();

    formArray.controls[1].get('key')?.setValue(1);

    expect(formArray.valid).toBeFalse();
    expect(formArray.controls[1].get('key')?.errors).toEqual({notUnique: true});
  });

  it('should validate uniqueness for FormGroup in FormArray', () => {
    const fb: FormBuilder = TestBed.inject(FormBuilder);
    const formArray = fb.array(
      [fb.group({key: fb.control(''), value: fb.control('')})],
      [UniqueValidator.unique((control) => (control as FormGroup<{key: FormControl<string>}>).controls.key)],
    );

    expect(formArray.valid).toBeTruthy();

    // Duplicate value
    formArray.push(fb.group({key: fb.control('duplicate'), value: fb.control('v')}));
    formArray.push(fb.group({key: fb.control('duplicate'), value: fb.control('v')}));

    expect(formArray.valid).toBeFalsy();
    expect(formArray.errors).toEqual({notUnique: true});

    // Unique value
    formArray.at(1).controls.key.setValue('unique');
    expect(formArray.errors).toBeNull();
  });
});
