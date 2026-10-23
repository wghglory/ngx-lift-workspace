// Compiled with strict Angular templates against the installed tarballs, without workspace aliases.
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries -- Compiled outside the workspace against installed tarballs.
import {
  KeyValueControlComponent,
  KeyValueEntry,
  KeyValueValue,
  KeyValueValueConfig,
  KeyValueFormGroup,
  KeyValueInputsComponent,
} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';

const initial: readonly KeyValueEntry[] = Object.freeze([Object.freeze({key: 'team', value: 'data'})]);
// @ts-expect-error Entry values are strings, not arbitrary objects.
const invalidEntry: KeyValueEntry = {key: 'team', value: 1};
void invalidEntry;

@Component({
  selector: 'key-value-consumer',
  imports: [FormsModule, ReactiveFormsModule, KeyValueControlComponent, KeyValueInputsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form #modelForm="ngForm" (ngSubmit)="saveModel(modelForm)" data-mode="model">
      <cll-key-value-control name="labels" [(ngModel)]="model" required [disabled]="modelDisabled()" />
      <button type="submit">Save</button>
      <button type="button" data-reset (click)="modelForm.resetForm({labels: initial})">Reset</button>
    </form>
    <form [formGroup]="reactive" (ngSubmit)="saveReactive()" data-mode="reactive">
      <cll-key-value-control formControlName="labels" [readonly]="readonly()" [minRows]="1" [maxRows]="2" />
      <input formControlName="sibling" aria-label="Sibling" />
      <button type="submit">Save</button>
    </form>
    <form [formGroup]="facade" (ngSubmit)="saveFacade()" data-mode="facade">
      <cll-key-value-control formControlName="labels" />
      <input formControlName="sibling" aria-label="Sibling" />
      <button type="submit">Save</button>
    </form>
    <section data-typed>
      <cll-key-value-control
        [formControl]="typed"
        [readonly]="readonly()"
        [valueConfig]="typedConfig"
        [uniquePairs]="true"
      />
    </section>
    <section data-legacy><cll-key-value-inputs [formArray]="legacy" [data]="legacyData" /></section>
  `,
})
export class KeyValueConsumer {
  readonly typed = new FormControl<KeyValueEntry<KeyValueValue>[]>(
    [
      {key: 'count', value: 3},
      {key: 'enabled', value: false},
      {key: 'hosts', value: ['one', 'two']},
    ],
    {nonNullable: true},
  );
  readonly typedConfig: KeyValueValueConfig = (key) =>
    key === 'count' ? {type: 'number', min: 1} : key === 'enabled' ? {type: 'boolean'} : {type: 'array'};
  readonly initial = initial;
  readonly modelDisabled = signal(false);
  readonly readonly = signal(false);
  model: readonly KeyValueEntry[] | null = initial;
  readonly reactive = new FormGroup({
    labels: new FormControl<readonly KeyValueEntry[]>(initial, {
      nonNullable: true,
      updateOn: 'blur',
      validators: Validators.required,
    }),
    sibling: new FormControl('enabled', {nonNullable: true}),
  });
  readonly facade = new FormGroup({
    labels: new FormControl<readonly KeyValueEntry[] | null>(initial, {updateOn: 'submit'}),
    sibling: new FormControl('enabled', {nonNullable: true}),
  });
  readonly sf = toSignalForm(this.facade, {includeDisabled: false});
  readonly legacy = new FormArray<KeyValueFormGroup>([]);
  readonly legacyData = [{key: 'legacy', value: 'preserved'}];
  payload: unknown;
  saveModel(form: NgForm) {
    if (form.valid) this.payload = form.value;
  }
  saveReactive() {
    if (this.reactive.valid) this.payload = this.reactive.value;
  }
  saveFacade() {
    if (this.facade.valid) this.payload = this.sf.submitValue();
  }
}
