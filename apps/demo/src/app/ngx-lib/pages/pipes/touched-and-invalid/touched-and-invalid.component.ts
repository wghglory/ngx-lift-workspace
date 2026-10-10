import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {TouchedAndInvalidPipe} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-touched-and-invalid',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, TouchedAndInvalidPipe, CodeBlockComponent],
  templateUrl: './touched-and-invalid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TouchedAndInvalidComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  exampleCode = highlight(`
import {TouchedAndInvalidPipe} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, TouchedAndInvalidPipe],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Email</label>
        <input type="email" formControlName="email" />

        @if (form.controls.email | touchedAndInvalid:'required') {
          <div class="error">Email address is required.</div>
        }
        @if (form.controls.email | touchedAndInvalid:'email') {
          <div class="error">Please provide a valid email format.</div>
        }
      </div>
    </form>
  \`
})
export class TouchedAndInvalidExampleComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}
  `);

  signatureCode = highlight(`
@Pipe({
  name: 'touchedAndInvalid',
  pure: false,
})
export class TouchedAndInvalidPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined, errorKey?: string): boolean
}
  `);
}
