import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe} from 'clr-lift';
import {numberRangeValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-number-range-validator',
  imports: [
    ClarityModule,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    DemoPlaygroundComponent,
    CodeBlockComponent,
  ],
  templateUrl: './number-range-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberRangeValidatorComponent {
  readonly form = new FormGroup(
    {
      min: new FormControl('10', [Validators.required]),
      max: new FormControl('5', [Validators.required]),
    },
    {validators: [numberRangeValidator()]},
  );

  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {numberRangeValidator} from 'ngx-lift';

@Component({
  selector: 'app-bounds-form',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './bounds-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoundsFormComponent {
  form = new FormGroup(
    {
      min: new FormControl('10', [Validators.required]),
      max: new FormControl('5', [Validators.required]),
    },
    {validators: [numberRangeValidator()]},
  );
}`);

  readonly firstTaskHtml = highlight(`<form [formGroup]="form" clrForm>
  <clr-input-container>
    <label for="min">Minimum</label>
    <input id="min" clrInput inputmode="numeric" formControlName="min" />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
  </clr-input-container>
  <clr-input-container>
    <label for="max">Maximum</label>
    <input id="max" clrInput inputmode="numeric" formControlName="max" />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
  </clr-input-container>
  @if (form.hasError('minGreaterThanMax')) {
    <p role="status" aria-live="polite">The minimum must not exceed the maximum</p>
  }
</form>`);

  readonly basicUsageCode = highlight(`import {FormControl, FormGroup} from '@angular/forms';
import {numberRangeValidator} from 'ngx-lift';

const range = new FormGroup(
  {min: new FormControl('10'), max: new FormControl('5')},
  {validators: [numberRangeValidator()]},
);

range.hasError('minGreaterThanMax'); // true
range.controls.max.setValue('20');
range.hasError('minGreaterThanMax'); // false`);

  readonly advancedCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {numberRangeValidator} from 'ngx-lift';

const filters = new FormGroup(
  {
    start: new FormControl('0', [Validators.required]),
    end: new FormControl('100', [Validators.required]),
  },
  {validators: [numberRangeValidator('start', 'end')]},
);

// The error belongs to the group, so child controls keep their own errors.
// Numeric strings, decimal values and empty bounds are handled without
// calling setErrors inside a validator.`);

  readonly signatureCode = highlight(
    `numberRangeValidator(minControlName = 'min', maxControlName = 'max'): ValidatorFn;`,
  );

  get isDisabled(): boolean {
    return this.form.disabled;
  }

  reset(): void {
    this.form.reset({min: '', max: ''});
  }

  toggleDisabled(): void {
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
