import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {ifValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-if-validator',
  standalone: true,
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

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
}
