import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {integerValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-integer-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './integer-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegerValidatorComponent {
  form = new FormGroup({
    replicas: new FormControl<number | string>(3, [integerValidator]),
  });

  exampleCode = highlight(`
import {integerValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Replicas</label>
        <input type="number" formControlName="replicas" />
        @if (form.controls.replicas.errors?.['integer']) {
          <div>Must be an integer (no decimals allowed)</div>
        }
      </div>
    </form>
  \`
})
export class IntegerValidatorExampleComponent {
  form = new FormGroup({
    replicas: new FormControl<number | string>(3, [integerValidator]),
  });
}
  `);

  signatureCode = highlight(`
function integerValidator(control: AbstractControl): ValidationErrors | null
  `);
}
