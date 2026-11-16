import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe} from 'clr-lift';
import {integerValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-integer-validator',
  imports: [
    ClarityModule,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    DemoPlaygroundComponent,
    CodeBlockComponent,
  ],
  templateUrl: './integer-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegerValidatorComponent {
  readonly form = new FormGroup({
    replicas: new FormControl('', [Validators.required, integerValidator()]),
  });

  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {integerValidator} from 'ngx-lift';

@Component({
  selector: 'app-replicas-form',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './replicas-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplicasFormComponent {
  form = new FormGroup({
    replicas: new FormControl('', [Validators.required, integerValidator()]),
  });
}`);

  readonly firstTaskHtml = highlight(`<form [formGroup]="form" clrForm>
  <clr-input-container>
    <label for="replicas">Replica count</label>
    <input id="replicas" clrInput formControlName="replicas" />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'invalidInteger'">Enter a whole number</clr-control-error>
  </clr-input-container>
</form>`);

  readonly basicUsageCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {integerValidator} from 'ngx-lift';

const form = new FormGroup({
  replicas: new FormControl('', [Validators.required, integerValidator()]),
});

form.controls.replicas.setValue('3'); // valid
form.controls.replicas.setValue('3.5'); // hasError('invalidInteger') === true
form.controls.replicas.setValue(''); // hasError('required') === true`);

  readonly advancedCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {integerValidator} from 'ngx-lift';

const deployment = new FormGroup({
  replicas: new FormControl('3', [Validators.required, integerValidator(), Validators.min(1)]),
  maxSurge: new FormControl('1', [integerValidator()]),
});

// -2, +2 and '  12  ' are integers; '1e3', '0x10', true and 3.5 are not.
// Empty values stay valid so Validators.required can report them separately.`);

  readonly signatureCode = highlight(`integerValidator(): ValidatorFn;`);

  get isDisabled(): boolean {
    return this.form.disabled;
  }

  reset(): void {
    this.form.reset({replicas: ''});
  }

  toggleDisabled(): void {
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
