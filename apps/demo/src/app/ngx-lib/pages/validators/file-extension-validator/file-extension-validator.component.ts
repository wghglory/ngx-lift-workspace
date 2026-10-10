import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {fileExtensionValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-file-extension-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './file-extension-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileExtensionValidatorComponent {
  form = new FormGroup({
    filename: new FormControl('certificate.crt', [fileExtensionValidator(['crt', 'pem', 'key'])]),
  });

  exampleCode = highlight(`
import {fileExtensionValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Certificate Filename</label>
        <input type="text" formControlName="filename" />
        @if (form.controls.filename.errors?.['invalidFileExtension']) {
          <div>Must end in: {{ form.controls.filename.errors?.['invalidFileExtension'].allowedExtensions.join(', ') }}</div>
        }
      </div>
    </form>
  \`
})
export class FileExtensionExampleComponent {
  form = new FormGroup({
    filename: new FormControl('', [fileExtensionValidator(['crt', 'pem', 'key'])]),
  });
}
  `);

  signatureCode = highlight(`
function fileExtensionValidator(allowedExtensions: string[]): ValidatorFn
  `);
}
