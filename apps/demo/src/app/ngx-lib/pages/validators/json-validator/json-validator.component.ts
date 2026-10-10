import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {jsonValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-json-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './json-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonValidatorComponent {
  form = new FormGroup({
    config: new FormControl('{\n  "version": "1.0",\n  "enabled": true\n}', [jsonValidator]),
  });

  exampleCode = highlight(`
import {jsonValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>JSON Configuration</label>
        <textarea formControlName="config" rows="5"></textarea>
        @if (form.controls.config.errors?.['invalidJson']) {
          <div>Must be valid JSON syntax</div>
        }
      </div>
    </form>
  \`
})
export class JsonValidatorExampleComponent {
  form = new FormGroup({
    config: new FormControl('', [jsonValidator]),
  });
}
  `);

  signatureCode = highlight(`
function jsonValidator(control: AbstractControl): ValidationErrors | null
  `);
}
