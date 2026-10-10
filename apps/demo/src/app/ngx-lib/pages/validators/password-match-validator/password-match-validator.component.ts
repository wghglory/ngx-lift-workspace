import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {passwordMatchValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-password-match-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './password-match-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordMatchValidatorComponent {
  form = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {validators: [passwordMatchValidator('password', 'confirmPassword')]},
  );

  exampleCode = highlight(`
import {passwordMatchValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Password</label>
        <input type="password" formControlName="password" />
      </div>
      <div>
        <label>Confirm Password</label>
        <input type="password" formControlName="confirmPassword" />
        @if (form.controls.confirmPassword.errors?.['passwordMismatch']) {
          <div>Passwords do not match</div>
        }
      </div>
    </form>
  \`
})
export class PasswordMatchExampleComponent {
  form = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {validators: [passwordMatchValidator('password', 'confirmPassword')]},
  );
}
  `);

  signatureCode = highlight(`
function passwordMatchValidator(
  passwordControlName = 'password',
  confirmPasswordControlName = 'confirmPassword',
): ValidatorFn
  `);
}
