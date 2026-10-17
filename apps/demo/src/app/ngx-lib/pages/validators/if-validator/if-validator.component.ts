import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {ifValidator, revalidateOnChange} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-if-validator',
  imports: [
    DemoPlaygroundComponent,
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './if-validator.component.html',
  styleUrl: './if-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IfValidatorComponent {
  readonly firstTaskCode = highlight(
    "import {ChangeDetectionStrategy, Component, inject} from '@angular/core';\nimport {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';\nimport {ClarityModule} from '@clr/angular';\nimport {ifValidator, revalidateOnChange} from 'ngx-lift';\n\n@Component({\n  selector: 'app-form-example',\n  imports: [ClarityModule, ReactiveFormsModule],\n  templateUrl: './form-example.html',\n  changeDetection: ChangeDetectionStrategy.OnPush,\n})\nexport class FormExampleComponent {\n  validator = ifValidator(\n    () => this.form?.controls.choice.value === 'UNLIKE',\n    [Validators.required],\n    // add mismatch validation functions if needed\n  );\n\n  form = new FormGroup({\n    choice: new FormControl('', Validators.required),\n    email: new FormControl('', [this.validator, Validators.email]),\n    reason: new FormControl('', this.validator),\n  });\n\n  constructor() {\n    // Automatically revalidate email & reason whenever choice changes!\n    // Eliminates the need for manual (change)=\"changeChoice()\" template handlers.\n    revalidateOnChange([this.form.controls.email, this.form.controls.reason], this.form.controls.choice);\n  }\n\n  changeChoice() {\n    this.form.controls.email.updateValueAndValidity();\n    this.form.controls.reason.updateValueAndValidity();\n  }\n}",
  );
  readonly firstTaskHtml = highlight(
    `<form clrForm [formGroup]="form">
  <clr-radio-container>
    <label for="if-choice">Do you like this tool?</label>
    <clr-radio-wrapper>
      <input
        type="radio"
        id="if-choice-like"
        clrRadio
        name="choice"
        value="LIKE"
        [formControl]="form.controls.choice"
        (change)="changeChoice()"
      />
      <label for="if-choice-like">Of course 😜</label>
    </clr-radio-wrapper>
    <clr-radio-wrapper>
      <input
        type="radio"
        id="if-choice-unlike"
        clrRadio
        name="choice"
        value="UNLIKE"
        [formControl]="form.controls.choice"
        (change)="changeChoice()"
      />
      <label for="if-choice-unlike">Sorry 😅</label>
    </clr-radio-wrapper>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
  </clr-radio-container>

  <clr-input-container>
    <label for="if-email">Email</label>
    <input id="if-email" clrInput type="text" [formControl]="form.controls.email" size="30" />
    <clr-control-helper>Field required only when you choose Sorry</clr-control-helper>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'email'">Invalid email</clr-control-error>
  </clr-input-container>

  <clr-input-container>
    <label for="if-reason">ifValidator.reasonLabel</label>
    <input id="if-reason" clrInput type="text" [formControl]="form.controls.reason" size="30" />
    <clr-control-helper>Field required only when you choose Sorry</clr-control-helper>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
  </clr-input-container>

  <button type="submit" class="btn-primary btn" [disabled]="form.invalid">Submit</button>
  <button type="button" class="btn btn-sm btn-outline" (click)="form.reset()">Clear</button>
  <output aria-live="polite">{{ form.status }}</output>
</form>`,
  );
  private translationService = inject(TranslationService);

  ifValidatorParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'condition',
        type: '() => boolean',
        description: this.translationService.translate('ifValidator.paramCondition'),
      },
      {
        name: 'trueValidatorFn',
        type: 'ValidatorFn | ValidatorFn[]',
        description: this.translationService.translate('ifValidator.paramTrueValidatorFn'),
      },
      {
        name: 'falseValidatorFn',
        type: 'ValidatorFn | ValidatorFn[]',
        description: this.translationService.translate('ifValidator.paramFalseValidatorFn'),
      },
    ];
  });

  ifAsyncValidatorParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'condition',
        type: '() => boolean',
        description: this.translationService.translate('ifAsyncValidator.paramCondition'),
      },
      {
        name: 'asyncValidatorFn',
        type: 'AsyncValidatorFn',
        description: this.translationService.translate('ifAsyncValidator.paramAsyncValidatorFn'),
      },
    ];
  });
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

  constructor() {
    // Automatically revalidate email & reason whenever choice changes!
    // Eliminates the need for manual (change)="changeChoice()" template handlers.
    revalidateOnChange([this.form.controls.email, this.form.controls.reason], this.form.controls.choice);
  }

  // Optional manual trigger (kept for legacy reference)
  changeChoice() {
    this.form.controls.email.updateValueAndValidity();
    this.form.controls.reason.updateValueAndValidity();
  }

  ifValidatorCode = highlight(`import {ifValidator, revalidateOnChange} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <clr-radio-container>
        <label>Do you like this tool?</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="choice" value="LIKE" [formControl]="form.controls.choice" />
          <label>Of course 😜</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="choice" value="UNLIKE" [formControl]="form.controls.choice" />
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
  \`,
})
export class IfValidatorComponent {
  validator = ifValidator(() => this.form?.controls.choice.value === 'UNLIKE', [Validators.required]);

  form = new FormGroup({
    choice: new FormControl('', Validators.required),
    email: new FormControl('', [this.validator, Validators.email]),
    reason: new FormControl('', this.validator),
  });

  constructor() {
    // Automatically revalidate dependent fields when choice changes
    revalidateOnChange([this.form.controls.email, this.form.controls.reason], this.form.controls.choice);
  }
}`);

  ifAsyncValidatorCode = highlight(`import {ifAsyncValidator} from 'ngx-lift';
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
    },
  );

  form = new FormGroup({
    enableAsync: new FormControl(false),
    asyncField: new FormControl('', null, this.asyncValidator),
  });

  toggleAsync() {
    this.form.controls.asyncField.updateValueAndValidity();
  }
}`);

  ifValidatorSignatureCode = highlight(`ifValidator(
  condition: () => boolean,
  trueValidatorFn: ValidatorFn | ValidatorFn[],
  falseValidatorFn?: ValidatorFn | ValidatorFn[],
): ValidatorFn;`);

  ifAsyncValidatorSignatureCode = highlight(
    `ifAsyncValidator(condition: () => boolean, asyncValidatorFn: AsyncValidatorFn): AsyncValidatorFn;`,
  );
}
