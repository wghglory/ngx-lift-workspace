import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe} from 'clr-lift';
import {httpsValidator, urlValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-url-validator',
  imports: [
    DemoPlaygroundComponent,
    PageContainerComponent,
    ClarityModule,
    ReactiveFormsModule,
    CodeBlockComponent,
    TranslatePipe,
  ],
  templateUrl: './url-validator.component.html',
  styleUrl: './url-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlValidatorComponent {
  readonly firstTaskCode = highlight(
    `import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {httpsValidator, urlValidator} from 'ngx-lift';

@Component({
  selector: 'app-form-example',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './form-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormExampleComponent {
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
  });
}`,
  );
  readonly firstTaskHtml = highlight(
    `<form [formGroup]="form" clrForm>
  <clr-input-container>
    <label for="url-validator-url">URL</label>
    <input id="url-validator-url" clrInput formControlName="url" />
    <clr-control-helper>Provide a valid URL</clr-control-helper>
    @if (form.controls.url.hasError('required')) {
      <clr-control-error>Required</clr-control-error>
    }
    @if (form.controls.url.errors?.['invalidUrl']) {
      <clr-control-error>Please enter a valid URL (starting with https or http)</clr-control-error>
    }
  </clr-input-container>
  <button type="button" class="btn btn-sm btn-outline" (click)="form.reset()">Clear</button>
  <output aria-live="polite">{{ form.status }}</output>
</form>`,
  );
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
  });
  readonly httpsForm = new FormGroup({
    https: new FormControl('', [Validators.required, httpsValidator]),
  });

  urlExampleCode = highlight(`import {urlValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>URL</label>
        <input type="text" formControlName="url" />
        @if (form.controls.url.hasError('required')) {
          <div>Required</div>
        }
        @if (form.controls.url.errors?.['invalidUrl']) {
          <div>Please enter a valid URL</div>
        }
      </div>
    </form>
  \`,
})
export class UrlValidatorExampleComponent {
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
  });
}`);

  httpsExampleCode = highlight(`import {httpsValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Https-only URL</label>
        <input type="text" formControlName="https" />
        @if (form.controls.https.hasError('required')) {
          <div>Required</div>
        }
        @if (form.controls.https.hasError('invalidUrl')) {
          <div>Please enter a https URL</div>
        }
      </div>
    </form>
  \`,
})
export class HttpsValidatorExampleComponent {
  form = new FormGroup({
    https: new FormControl('', [Validators.required, httpsValidator]),
  });
}`);

  completeExampleCode = highlight(`import {httpsValidator, urlValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>URL</label>
        <input type="text" formControlName="url" />
        @if (form.controls.url.hasError('required')) {
          <div>Required</div>
        }
        @if (form.controls.url.errors?.['invalidUrl']) {
          <div>Please enter a valid URL</div>
        }
      </div>

      <div>
        <label>Https-only URL</label>
        <input type="text" formControlName="https" />
        @if (form.controls.https.hasError('required')) {
          <div>Required</div>
        }
        @if (form.controls.https.hasError('invalidUrl')) {
          <div>Please enter a https URL</div>
        }
      </div>
    </form>
  \`,
})
export class UrlValidatorComponent {
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
    https: new FormControl('', [Validators.required, httpsValidator]),
  });
}`);

  urlSignatureCode = highlight(`urlValidator(control: AbstractControl): ValidationErrors | null;`);

  httpsSignatureCode = highlight(`httpsValidator(control: AbstractControl): ValidationErrors | null;`);
}
