import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {noSpaceAllowed, onlyAsciiCharsAllowed} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-text-pattern-validator',
  imports: [PageContainerComponent, ClarityModule, ReactiveFormsModule, CodeBlockComponent],
  templateUrl: './text-pattern-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextPatternValidatorComponent {
  form = new FormGroup({
    identifier: new FormControl('system_admin', [noSpaceAllowed]),
    asciiOnly: new FormControl('StandardText123', [onlyAsciiCharsAllowed]),
  });

  exampleCode = highlight(`
import {noSpaceAllowed, onlyAsciiCharsAllowed} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div>
        <label>Identifier (No spaces)</label>
        <input type="text" formControlName="identifier" />
        @if (form.controls.identifier.errors?.['noSpaceAllowed']) {
          <div>Spaces are not allowed</div>
        }
      </div>

      <div>
        <label>ASCII Only</label>
        <input type="text" formControlName="asciiOnly" />
        @if (form.controls.asciiOnly.errors?.['onlyAsciiCharsAllowed']) {
          <div>Only ASCII characters are permitted</div>
        }
      </div>
    </form>
  \`
})
export class TextPatternExampleComponent {
  form = new FormGroup({
    identifier: new FormControl('', [noSpaceAllowed]),
    asciiOnly: new FormControl('', [onlyAsciiCharsAllowed]),
  });
}
  `);

  signatureCode = highlight(`
function noSpaceAllowed(control: AbstractControl): ValidationErrors | null

function onlyAsciiCharsAllowed(control: AbstractControl): ValidationErrors | null
  `);
}
