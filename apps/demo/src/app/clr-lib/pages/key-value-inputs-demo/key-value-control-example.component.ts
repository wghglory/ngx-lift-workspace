import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {KeyValueControlComponent, KeyValueEntry, TranslatePipe} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';

const initial: KeyValueEntry[] = [{key: 'team', value: 'data'}];

@Component({
  selector: 'app-key-value-control-example',
  imports: [JsonPipe, FormsModule, ReactiveFormsModule, KeyValueControlComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './key-value-control-example.component.html',
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    form > label {
      display: block;
      margin-block: 0.4rem;
    }
    form > .clr-input {
      max-inline-size: 100%;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  `,
})
export class KeyValueControlExampleComponent {
  readonly mode = input<'model' | 'reactive' | 'facade'>('reactive');
  readonly initial = initial;
  readonly readonly = signal(false);
  readonly modelDisabled = signal(false);
  readonly payload = signal<unknown>(null);
  modelRows: KeyValueEntry[] = initial;
  readonly reactiveForm = this.createForm('blur');
  readonly facadeForm = this.createForm('submit');
  readonly sf = toSignalForm(this.facadeForm, {includeDisabled: false});

  form() {
    return this.mode() === 'facade' ? this.facadeForm : this.reactiveForm;
  }

  toggleDisabled() {
    const labels = this.form().controls.labels;
    if (labels.disabled) labels.enable();
    else labels.disable();
  }

  saveModel(form: NgForm) {
    form.control.markAllAsTouched();
    if (form.valid) this.payload.set(form.value);
  }

  saveReactive() {
    this.form().markAllAsTouched();
    if (this.form().valid) this.payload.set(this.mode() === 'facade' ? this.sf.submitValue() : this.form().value);
  }

  private createForm(updateOn: 'blur' | 'submit') {
    return new FormGroup({
      labels: new FormControl<KeyValueEntry[]>(initial, {
        nonNullable: true,
        updateOn,
        validators: Validators.required,
      }),
    });
  }
}
