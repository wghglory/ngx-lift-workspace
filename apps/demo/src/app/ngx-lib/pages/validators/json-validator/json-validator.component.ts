import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe} from 'clr-lift';
import {jsonValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-json-validator',
  imports: [
    ClarityModule,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    DemoPlaygroundComponent,
    CodeBlockComponent,
  ],
  templateUrl: './json-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonValidatorComponent {
  readonly form = new FormGroup({
    payload: new FormControl('', [Validators.required, jsonValidator()]),
  });

  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {jsonValidator} from 'ngx-lift';

@Component({
  selector: 'app-payload-form',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './payload-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayloadFormComponent {
  form = new FormGroup({
    payload: new FormControl('', [Validators.required, jsonValidator()]),
  });
}`);

  readonly firstTaskHtml = highlight(`<form [formGroup]="form" clrForm>
  <clr-textarea-container>
    <label for="payload">JSON payload</label>
    <textarea id="payload" clrTextarea formControlName="payload"></textarea>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'invalidJson'">Enter valid JSON text</clr-control-error>
  </clr-textarea-container>
</form>`);

  readonly basicUsageCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {jsonValidator} from 'ngx-lift';

const form = new FormGroup({
  payload: new FormControl('', [Validators.required, jsonValidator()]),
});

form.controls.payload.setValue('{"enabled": true}'); // valid
form.controls.payload.setValue('{enabled: true}'); // hasError('invalidJson') === true`);

  readonly advancedCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {jsonValidator} from 'ngx-lift';

const editor = new FormGroup({
  payload: new FormControl('{"enabled": true}', [Validators.required, jsonValidator()]),
});

// jsonValidator checks syntax only. Any JSON value is accepted: objects,
// arrays, strings, numbers, true, false and null. Add a shape check when
// your application needs a specific schema, and read form.getRawValue() on submit.`);

  readonly signatureCode = highlight(`jsonValidator(): ValidatorFn;`);

  get isDisabled(): boolean {
    return this.form.disabled;
  }

  reset(): void {
    this.form.reset({payload: ''});
  }

  toggleDisabled(): void {
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
