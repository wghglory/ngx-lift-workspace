import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {httpsValidator, urlValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-url-validator',
  standalone: true,
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

  exampleCode = highlight(`
import {httpsValidator, urlValidator} from 'ngx-lift';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>
          URL
          <input type="text" formControlName="url" />
        </label>
        <div *ngIf="form.controls.url.hasError('required')">Required</div>
        <div *ngIf="form.controls.url.errors?.['invalidUrl']">Please enter a valid URL</div>
      </div>

      <div>
        <label>
          Https-only URL
          <input type="text" formControlName="https" />
        </label>
        <div *ngIf="form.controls.url.hasError('required')">Required</div>
        <div *ngIf="form.controls.url.hasError('invalidUrl')">Please enter a https URL</div>
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
}
