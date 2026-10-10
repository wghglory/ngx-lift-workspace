import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {composeValidators, noSpaceAllowed} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-compose-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './compose-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposeValidatorComponent {
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      composeValidators('usernameError', [
        {validate: Validators.minLength(3), message: 'Username must be at least 3 characters'},
        {validate: Validators.maxLength(15), message: 'Username cannot exceed 15 characters'},
        {validate: noSpaceAllowed, message: 'Spaces are not allowed in username'},
      ]),
    ]),
  });

  exampleCode = highlight(`
import {composeValidators, noSpaceAllowed} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Username</label>
        <input type="text" formControlName="username" />
        @if (form.controls.username.errors?.['required']) {
          <div>Username is required</div>
        }
        @if (form.controls.username.errors?.['usernameError']; as errorMsg) {
          <div>{{ errorMsg }}</div>
        }
      </div>
    </form>
  \`
})
export class ComposeValidatorExampleComponent {
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      composeValidators('usernameError', [
        {validate: Validators.minLength(3), message: 'Username must be at least 3 characters'},
        {validate: Validators.maxLength(15), message: 'Username cannot exceed 15 characters'},
        {validate: noSpaceAllowed, message: 'Spaces are not allowed in username'},
      ]),
    ]),
  });
}
  `);

  signatureCode = highlight(`
interface ValidationRule {
  validate: ValidatorFn;
  message: string;
}

function composeValidators(errorKey: string, rules: ValidationRule[]): ValidatorFn
  `);
}
