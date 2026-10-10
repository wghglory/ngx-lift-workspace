import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {numberRangeValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-number-range-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './number-range-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberRangeValidatorComponent {
  form = new FormGroup(
    {
      min: new FormControl<number | null>(10),
      max: new FormControl<number | null>(5),
    },
    {validators: [numberRangeValidator('min', 'max')]},
  );

  exampleCode = highlight(`
import {numberRangeValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Minimum Value</label>
        <input type="number" formControlName="min" />
        @if (form.controls.min.errors?.['minGreaterThanMax']) {
          <div>Minimum value cannot be greater than maximum value</div>
        }
      </div>

      <div>
        <label>Maximum Value</label>
        <input type="number" formControlName="max" />
        @if (form.controls.max.errors?.['minGreaterThanMax']) {
          <div>Maximum value cannot be less than minimum value</div>
        }
      </div>
    </form>
  \`
})
export class NumberRangeExampleComponent {
  form = new FormGroup(
    {
      min: new FormControl<number | null>(10),
      max: new FormControl<number | null>(5),
    },
    {validators: [numberRangeValidator('min', 'max')]},
  );
}
  `);

  signatureCode = highlight(`
function numberRangeValidator(minControlName = 'min', maxControlName = 'max'): ValidatorFn
  `);
}
