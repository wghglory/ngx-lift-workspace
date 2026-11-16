import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent, TranslatePipe} from 'clr-lift';
import {sameValueValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-same-value-validator',
  imports: [
    AlertComponent,
    ClarityModule,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    DemoPlaygroundComponent,
    CodeBlockComponent,
  ],
  templateUrl: './same-value-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SameValueValidatorComponent {
  readonly form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {validators: [sameValueValidator('password', 'confirmPassword')]},
  );

  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent} from 'clr-lift';
import {sameValueValidator} from 'ngx-lift';

@Component({
  selector: 'app-credentials-form',
  imports: [AlertComponent, ClarityModule, ReactiveFormsModule],
  templateUrl: './credentials-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CredentialsFormComponent {
  form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {validators: [sameValueValidator('password', 'confirmPassword')]},
  );
}`);

  readonly firstTaskHtml = highlight(`<form [formGroup]="form" clrForm>
  <clr-password-container>
    <label for="password">Password</label>
    <input id="password" type="password" clrPassword formControlName="password" />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'minlength'">Use at least 8 characters</clr-control-error>
  </clr-password-container>
  <clr-password-container>
    <label for="confirmPassword">Confirm password</label>
    <input
      id="confirmPassword"
      type="password"
      clrPassword
      formControlName="confirmPassword"
      [attr.aria-describedby]="form.hasError('valuesMismatch') ? 'mismatch-error' : null"
    />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
  </clr-password-container>
  <div id="mismatch-error">
    @if (form.hasError('valuesMismatch')) {
      <cll-alert [alertType]="'danger'" [isSmall]="true" [closable]="false"> The two passwords do not match </cll-alert>
    }
  </div>
</form>`);

  readonly basicUsageCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {sameValueValidator} from 'ngx-lift';

const form = new FormGroup(
  {
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  },
  {validators: [sameValueValidator('password', 'confirmPassword')]},
);

form.setValue({password: 'secret123', confirmPassword: 'secret124'});
form.hasError('valuesMismatch'); // true
form.controls.confirmPassword.setValue('secret123');
form.hasError('valuesMismatch'); // false`);

  readonly advancedCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {sameValueValidator} from 'ngx-lift';

const pinForm = new FormGroup(
  {
    pin: new FormControl('', [Validators.required]),
    repeatPin: new FormControl('', [Validators.required]),
  },
  {validators: [sameValueValidator('pin', 'repeatPin')]},
);

// The mismatch error lives on the group. Child controls keep their own
// required and minlength errors because the validator never calls setErrors.`);

  readonly signatureCode = highlight(
    `sameValueValidator(firstControlName: string, secondControlName: string): ValidatorFn;`,
  );

  get isDisabled(): boolean {
    return this.form.disabled;
  }

  reset(): void {
    this.form.reset({password: '', confirmPassword: ''});
  }

  toggleDisabled(): void {
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
