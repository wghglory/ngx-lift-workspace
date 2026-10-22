import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {
  CalloutComponent,
  KeyValueFormGroup,
  KeyValueInputsComponent,
  PageContainerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {KeyValueRecipesComponent} from './key-value-recipes.component';
import {KeyValueControlExampleComponent} from './key-value-control-example.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-key-value-inputs-demo',
  imports: [
    CommonModule,
    KeyValueControlExampleComponent,
    KeyValueRecipesComponent,
    DemoPlaygroundComponent,
    CalloutComponent,
    RouterLink,
    KeyValueInputsComponent,
    CodeBlockComponent,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './key-value-inputs-demo.component.html',
  styleUrl: './key-value-inputs-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueInputsDemoComponent {
  private readonly translationService = inject(TranslationService);

  readonly modelCode = highlight(`import {Component} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {KeyValueControlComponent, KeyValueEntry} from 'clr-lift';
@Component({
  imports: [FormsModule, KeyValueControlComponent],
  template: \`<form #form="ngForm" (ngSubmit)="save(form)">
    <cll-key-value-control name="labels" [(ngModel)]="labels" label="Labels" required [maxRows]="3" />
    <button class="btn btn-primary" type="submit">Submit</button>
    <button class="btn" type="button" (click)="form.resetForm({labels: initial})">Reset</button>
  </form>\`,
})
export class LabelsExample {
  readonly initial: KeyValueEntry[] = [{key: 'team', value: 'data'}];
  labels: KeyValueEntry[] = this.initial;
  payload: unknown;
  save(form: NgForm) {
    form.control.markAllAsTouched();
    if (form.valid) this.payload = form.value;
  }
}`);
  readonly reactiveCode = highlight(`import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {KeyValueControlComponent, KeyValueEntry} from 'clr-lift';
@Component({
  imports: [ReactiveFormsModule, KeyValueControlComponent],
  template: \`<form [formGroup]="form" (ngSubmit)="save()">
    <cll-key-value-control formControlName="labels" label="Labels" [minRows]="1" [maxRows]="3" />
    <button class="btn btn-primary" type="submit">Submit</button>
    <button class="btn" type="button" (click)="form.reset()">Reset</button>
    <button class="btn" type="button" (click)="form.controls.labels.disable()">Disable labels</button>
    <button class="btn" type="button" (click)="form.controls.labels.enable()">Enable labels</button>
  </form>\`,
})
export class LabelsExample {
  readonly form = new FormGroup({
    labels: new FormControl<KeyValueEntry[]>([{key: 'team', value: 'data'}], {
      nonNullable: true,
      updateOn: 'blur',
      validators: Validators.required,
    }),
  });
  payload: unknown;
  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) this.payload = this.form.value;
  }
}`);
  readonly facadeCode = highlight(`import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {KeyValueControlComponent, KeyValueEntry} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';
@Component({
  imports: [ReactiveFormsModule, KeyValueControlComponent],
  template: \`<form [formGroup]="form" (ngSubmit)="save()">
      <cll-key-value-control formControlName="labels" label="Labels" [minRows]="1" [maxRows]="3" />
      <button class="btn btn-primary" type="submit">Submit</button>
      <button class="btn" type="button" (click)="form.reset()">Reset</button>
      <button class="btn" type="button" (click)="form.controls.labels.disable()">Disable labels</button>
      <button class="btn" type="button" (click)="form.controls.labels.enable()">Enable labels</button>
    </form>
    <output>{{ sf.fields.labels.value() }} / {{ sf.status() }}</output>\`,
})
export class LabelsExample {
  readonly form = new FormGroup({
    labels: new FormControl<KeyValueEntry[]>([{key: 'team', value: 'data'}], {
      nonNullable: true,
      updateOn: 'submit',
      validators: Validators.required,
    }),
  });
  readonly sf = toSignalForm(this.form, {includeDisabled: false});
  payload: unknown;
  save() {
    this.sf.markAllAsTouched();
    if (this.form.valid) this.payload = this.sf.submitValue();
  }
}`);

  form = new FormGroup({
    appProperties: new FormArray<KeyValueFormGroup>([]),
  });

  data = [
    {key: 'key1', value: 'value1'},
    {key: 'key2', value: 'value2'},
  ];

  exampleCode = highlight(`import {KeyValueFormGroup, KeyValueInputsComponent} from 'clr-lift';
import {Component} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [KeyValueInputsComponent, ReactiveFormsModule],
  templateUrl: './key-value-inputs-example.component.html',
})
export class KeyValueInputsExampleComponent {
  form = new FormGroup({
    appProperties: new FormArray<KeyValueFormGroup>([]),
  });

  data = [
    {key: 'key1', value: 'value1'},
    {key: 'key2', value: 'value2'},
  ];
}`);

  readonly exampleHtmlCode = highlight(
    `<form [formGroup]="form">
  <cll-key-value-inputs
    [formArray]="form.controls.appProperties"
    [inputSize]="30"
    [data]="data"
    [keyPattern]="{
      regex: '^\\\\w+\\\\d+$',
      message: 'custom error message: key must start with a letter and end with a number',
    }"
    [valuePattern]="{regex: '^\\\\w+\\\\d+$'}"
    [smartMode]="true"
    [uniqueKey]="true"
    buttonClass="btn-sm btn-link"
    keyHelper="run time property key"
    valueHelper="run time property value"
    addText="add key value"
  />
</form>`,
    'html',
  );

  readonly editorInputs = computed<ApiProperty[]>(() => [
    {
      name: 'keyConfig',
      type: 'KeyValueKeyConfig',
      defaultValue: '{}',
      description: this.translationService.translate('keyValueRecipes.keySelectHelp'),
    },
    {
      name: 'valueConfig',
      type: 'KeyValueValueConfig',
      defaultValue: '{}',
      description: this.translationService.translate('keyValueRecipes.schemaHelp'),
    },
    {
      name: 'resetValueOnKeyChange',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('keyValueRecipes.dependentHelp'),
    },
    {
      name: 'uniquePairs',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('keyValueRecipes.tagsHelp'),
    },
    {
      name: 'excludeSelectedKeys',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('keyValueRecipes.schemaHelp'),
    },
    {
      name: 'addText',
      type: 'string',
      defaultValue: "''",
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.addText'),
    },
  ]);

  readonly fieldConfigCode = highlight(`interface KeyValueFieldConfig {
  type?: 'input' | 'select' | 'combobox' | 'number' | 'boolean' | 'array';
  options?: readonly {value: string; label: string; disabled?: boolean}[];
  placeholder?: string;
  helper?: string;
  required?: boolean; // true by default; false is a valid boolean value
  disabled?: boolean; // preserves the entry value
  min?: number;
  max?: number;
  validators?: readonly {validator: ValidatorFn; errorKey: string; message: string}[];
  messages?: Readonly<Record<string, string>>;
}
type KeyValueKeyConfig = Omit<KeyValueFieldConfig, 'type'> & {
  type?: 'input' | 'select' | 'combobox';
};
type KeyValueValueConfig = KeyValueFieldConfig | ((key: string) => KeyValueFieldConfig);
type KeyValueValue = string | number | boolean | string[] | null;
interface KeyValueEntry<T extends KeyValueValue = string> {
  key: string;
  value: T;
}`);

  readonly inputs = computed<ApiProperty[]>(() => [
    {
      name: 'formArray',
      type: 'FormArray<KeyValueFormGroup>',
      required: true,
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.formArray'),
    },
    {
      name: 'data',
      type: 'Array<{key: string; value: string}>',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.data'),
    },
    {
      name: 'uniqueKey',
      type: 'boolean',
      defaultValue: 'true',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.uniqueKey'),
    },
    {
      name: 'keyHelper',
      type: 'string',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.keyHelper'),
    },
    {
      name: 'valueHelper',
      type: 'string',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.valueHelper'),
    },
    {
      name: 'addText',
      type: 'string',
      defaultValue: "'Add Key-Value Pair'",
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.addText'),
    },
    {
      name: 'inputSize',
      type: 'number',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.inputSize'),
    },
    {
      name: 'buttonClass',
      type: 'string',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.buttonClass'),
    },
    {
      name: 'smartMode',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.smartMode'),
    },
    {
      name: 'keyPattern',
      type: '{regex: string; message?: string}',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.keyPattern'),
    },
    {
      name: 'valuePattern',
      type: '{regex: string; message?: string}',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.valuePattern'),
    },
  ]);

  readonly outputs = computed<ApiProperty[]>(() => [
    {
      name: 'removeKeyValue',
      type: 'EventEmitter<number>',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.outputs.removeKeyValue'),
    },
    {
      name: 'addKeyValue',
      type: 'EventEmitter<void>',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.outputs.addKeyValue'),
    },
  ]);
}
