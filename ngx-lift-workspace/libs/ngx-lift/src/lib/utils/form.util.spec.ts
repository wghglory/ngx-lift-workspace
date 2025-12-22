import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {firstValueFrom, Observable, of, switchMap, timer} from 'rxjs';
import {vi} from 'vitest';

import {ifAsyncValidator, ifValidator} from './form.util';

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="testControl" />
    </form>
  `,
  standalone: true,
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

  it('should apply the async validator when the condition is met', async () => {
    const control = fixture.componentInstance.form.controls.testControl;
    control.setValue('valid value');

    const asyncValidatorFnMock = vi
      .fn()
      .mockReturnValue(timer(500).pipe(switchMap(() => of({yourCustomAsyncError: true}))));

    const conditionalAsyncValidator = ifAsyncValidator((ctrl) => ctrl.value === 'valid value', asyncValidatorFnMock);

    const result = await firstValueFrom(conditionalAsyncValidator(control) as Observable<AsyncValidatorFn>);
    expect(result).toEqual({yourCustomAsyncError: true});
    expect(asyncValidatorFnMock).toHaveBeenCalledWith(control);
  });

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
