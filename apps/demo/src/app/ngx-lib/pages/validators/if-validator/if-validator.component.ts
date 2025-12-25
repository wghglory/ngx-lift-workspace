import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {ifValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-if-validator',
  imports: [ClarityModule, ReactiveFormsModule, PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './if-validator.component.html',
  styleUrl: './if-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IfValidatorComponent {
  validator = ifValidator(
    () => this.form?.controls.choice.value === 'UNLIKE',
    [Validators.required],
    // add mismatch validation functions if needed
  );

  form = new FormGroup({
    choice: new FormControl('', Validators.required),
    email: new FormControl('', [this.validator, Validators.email]),
    reason: new FormControl('', this.validator),
  });

  // updateValueAndValidity whenever the condition is changed.
  changeChoice() {
    this.form.controls.email.updateValueAndValidity();
    this.form.controls.reason.updateValueAndValidity();
  }

  ifValidatorCode = highlight(`
import {ifValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <clr-radio-container>
        <label>Do you like this tool?</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="choice" value="LIKE" [formControl]="form.controls.choice" (change)="changeChoice()" />
          <label>Of course 😜</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="choice" value="UNLIKE" [formControl]="form.controls.choice" (change)="changeChoice()" />
          <label>Sorry 😅</label>
        </clr-radio-wrapper>
      </clr-radio-container>

      <clr-input-container>
        <label>Email</label>
        <input clrInput type="text" [formControl]="form.controls.email" />
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
        <clr-control-error *clrIfError="'email'">Invalid email</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Reason why you don't like</label>
        <input clrInput type="text" [formControl]="form.controls.reason" />
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-input-container>
    </form>
  \`
})
export class IfValidatorComponent {
  validator = ifValidator(
    () => this.form?.controls.choice.value === 'UNLIKE',
    [Validators.required],
    // add mismatch validation functions if needed
  );

  form = new FormGroup({
    choice: new FormControl('', Validators.required),
    email: new FormControl('', [this.validator, Validators.email]),
    reason: new FormControl('', this.validator),
  });

  // updateValueAndValidity whenever the condition is changed.
  changeChoice() {
    this.form.controls.email.updateValueAndValidity();
    this.form.controls.reason.updateValueAndValidity();
  }
}
  `);

  ifAsyncValidatorCode = highlight(`
import {ifAsyncValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  imports: [ReactiveFormsModule],
})
export class IfAsyncValidatorComponent {
  asyncValidator = ifAsyncValidator(
    () => this.form?.controls.enableAsync.value === true,
    (control) => {
      // Simulate async validation
      return of(null).pipe(delay(1000));
    }
  );

  form = new FormGroup({
    enableAsync: new FormControl(false),
    asyncField: new FormControl('', null, this.asyncValidator),
  });

  toggleAsync() {
    this.form.controls.asyncField.updateValueAndValidity();
  }
}
  `);

  ifValidatorSignatureCode = highlight(`
ifValidator(
  condition: () => boolean,
  trueValidatorFn: ValidatorFn | ValidatorFn[],
  falseValidatorFn?: ValidatorFn | ValidatorFn[]
): ValidatorFn
  `);

  ifAsyncValidatorSignatureCode = highlight(`
ifAsyncValidator(
  condition: () => boolean,
  asyncValidatorFn: AsyncValidatorFn
): AsyncValidatorFn
  `);
}
