import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {httpsValidator, urlValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-url-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './url-validator.component.html',
  styleUrl: './url-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlValidatorComponent {
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
    https: new FormControl('', [Validators.required, httpsValidator]),
  });

  urlExampleCode = highlight(`
import {urlValidator} from 'ngx-lift';
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
  \`
})
export class UrlValidatorExampleComponent {
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
  });
}
  `);

  httpsExampleCode = highlight(`
import {httpsValidator} from 'ngx-lift';
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
  \`
})
export class HttpsValidatorExampleComponent {
  form = new FormGroup({
    https: new FormControl('', [Validators.required, httpsValidator]),
  });
}
  `);

  completeExampleCode = highlight(`
import {httpsValidator, urlValidator} from 'ngx-lift';
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
  \`
})
export class UrlValidatorComponent {
  form = new FormGroup({
    url: new FormControl('', [Validators.required, urlValidator]),
    https: new FormControl('', [Validators.required, httpsValidator]),
  });
}
  `);

  urlSignatureCode = highlight(`
urlValidator(control: AbstractControl): ValidationErrors | null
  `);

  httpsSignatureCode = highlight(`
httpsValidator(control: AbstractControl): ValidationErrors | null
  `);
}
