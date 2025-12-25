import {Component} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {firstValueFrom, Observable, of, switchMap, timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {vi} from 'vitest';

import {ifAsyncValidator, ifValidator} from './form.util';

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="testControl" />
    </form>
  `,
  imports: [ReactiveFormsModule],
})
class TestComponent {
  form = new FormGroup({
    testControl: new FormControl(''),
  });
}

describe('ifValidator', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should apply the validator when the condition is met', () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('valid value');

    const trueValidatorFnMock = vi.fn().mockReturnValue({yourCustomError: true});
    const falseValidatorFnMock = vi.fn().mockReturnValue({yourCustomError: false});

    const conditionalValidator = ifValidator(
      (ctrl) => ctrl.value === 'valid value',
      trueValidatorFnMock,
      falseValidatorFnMock,
    );

    const result = conditionalValidator(control);

    expect(result).toEqual({yourCustomError: true});
    expect(trueValidatorFnMock).toHaveBeenCalledWith(control);
    expect(falseValidatorFnMock).not.toHaveBeenCalled();
  });

  it('should apply the falseValidatorFn when the condition is not met', () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('invalid value');

    const trueValidatorFnMock = vi.fn().mockReturnValue({yourCustomError: true});
    const falseValidatorFnMock = vi.fn().mockReturnValue({yourCustomError: false});

    const conditionalValidator = ifValidator(
      (ctrl) => ctrl.value === 'valid value',
      trueValidatorFnMock,
      falseValidatorFnMock,
    );

    const result = conditionalValidator(control);

    expect(result).toEqual({yourCustomError: false});
    expect(trueValidatorFnMock).not.toHaveBeenCalled();
    expect(falseValidatorFnMock).toHaveBeenCalledWith(control);
  });
});

describe('ifAsyncValidator', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should apply the async validator when the condition is met', fakeAsync(() => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('valid value');

    const asyncValidatorFnMock = vi
      .fn()
      .mockReturnValue(timer(500).pipe(switchMap(() => of({yourCustomAsyncError: true}))));

    const conditionalAsyncValidator = ifAsyncValidator((ctrl) => ctrl.value === 'valid value', asyncValidatorFnMock);

    let result: ReturnType<AsyncValidatorFn> | null = null;
    (conditionalAsyncValidator(control) as Observable<ReturnType<AsyncValidatorFn>>)
      .pipe(take(1))
      .subscribe((value) => {
        result = value;
      });

    tick(500);
    expect(result).toEqual({yourCustomAsyncError: true});
    expect(asyncValidatorFnMock).toHaveBeenCalledWith(control);
  }));

  it('should not apply the async validator when the condition is not met', async () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('invalid value');

    const asyncValidatorFnMock = vi.fn().mockReturnValue(of({yourCustomAsyncError: true}));

    const conditionalAsyncValidator = ifAsyncValidator((ctrl) => ctrl.value === 'valid value', asyncValidatorFnMock);

    const result = await firstValueFrom(conditionalAsyncValidator(control) as Observable<AsyncValidatorFn>);
    expect(result).toBeNull();
    expect(asyncValidatorFnMock).not.toHaveBeenCalled();
  });
});

describe('ifValidator edge cases', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should handle array of validators in trueValidatorFn', () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('valid value');

    const validator1 = vi.fn().mockReturnValue({error1: true});
    const validator2 = vi.fn().mockReturnValue({error2: true});

    const conditionalValidator = ifValidator((ctrl) => ctrl.value === 'valid value', [validator1, validator2]);

    const result = conditionalValidator(control);
    expect(result).not.toBeNull();
    expect(validator1).toHaveBeenCalledWith(control);
    expect(validator2).toHaveBeenCalledWith(control);
  });

  it('should handle array of validators in falseValidatorFn', () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('invalid value');

    const validator1 = vi.fn().mockReturnValue({error1: true});
    const validator2 = vi.fn().mockReturnValue({error2: true});

    const conditionalValidator = ifValidator(
      (ctrl) => ctrl.value === 'valid value',
      vi.fn().mockReturnValue({error: true}),
      [validator1, validator2],
    );

    const result = conditionalValidator(control);
    expect(result).not.toBeNull();
    expect(validator1).toHaveBeenCalledWith(control);
    expect(validator2).toHaveBeenCalledWith(control);
  });

  it('should return null when falseValidatorFn is not provided and condition is false', () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('invalid value');

    const conditionalValidator = ifValidator(
      (ctrl) => ctrl.value === 'valid value',
      vi.fn().mockReturnValue({error: true}),
    );

    const result = conditionalValidator(control);
    expect(result).toBeNull();
  });
});
