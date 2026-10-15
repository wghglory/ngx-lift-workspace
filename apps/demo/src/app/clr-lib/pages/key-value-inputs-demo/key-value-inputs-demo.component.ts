import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {
  CalloutComponent,
  KeyValueFieldConfig,
  KeyValueFormGroup,
  KeyValueInputsComponent,
  KeyValueValueConfig,
  PageContainerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {StateInspectorComponent} from '../../../shared/components/state-inspector/state-inspector.component';
import {highlight} from '../../../shared/utils/highlight.util';

type ScenarioName = 'tags' | 'parameters' | 'assignments' | 'policy';
interface Scenario {
  name: ScenarioName;
  title: string;
  description: string;
  keyConfig: KeyValueFieldConfig;
  valueConfig: KeyValueValueConfig;
  uniqueKey: boolean;
  uniqueKeyValuePair: boolean;
  resetValueOnKeyChange: boolean;
}

function createPair(key: string, value: string): KeyValueFormGroup {
  return new FormGroup({
    key: new FormControl(key, {nonNullable: true}),
    value: new FormControl(value, {nonNullable: true}),
  });
}

@Component({
  selector: 'app-key-value-inputs-demo',
  imports: [
    JsonPipe,
    ClarityModule,
    CalloutComponent,
    RouterLink,
    KeyValueInputsComponent,
    CodeBlockComponent,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    ApiTableComponent,
    StateInspectorComponent,
  ],
  templateUrl: './key-value-inputs-demo.component.html',
  styleUrl: './key-value-inputs-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueInputsDemoComponent {
  private readonly translationService = inject(TranslationService);
  readonly form = new FormGroup({
    editing: new FormControl(true, {nonNullable: true}),
    tags: new FormArray([createPair('team', 'platform')]),
    parameters: new FormArray([createPair('max_connections', '100')]),
    assignments: new FormArray([createPair('owner', 'platform')]),
    policy: new FormArray([createPair('environment', 'prod')]),
  });
  readonly sf = toSignalForm(this.form, {omit: ['editing']});
  readonly saved = signal<object | null>(null);
  readonly state = computed(() => ({
    status: this.sf.status(),
    dirty: this.sf.dirty(),
    touched: this.sf.touched(),
    valid: this.sf.valid(),
    pending: this.sf.pending(),
  }));

  readonly policyValueConfig = (key: string): KeyValueFieldConfig => ({
    mode: 'select',
    options:
      key === 'environment'
        ? [
            {value: 'prod', label: this.translationService.translate('keyValueInputs.production')},
            {value: 'staging', label: this.translationService.translate('keyValueInputs.staging')},
          ]
        : key === 'region'
          ? [
              {value: 'us-east', label: 'us-east'},
              {value: 'eu-central', label: 'eu-central'},
            ]
          : [],
  });

  readonly scenarios = computed<Scenario[]>(() => {
    const t = (key: string) => this.translationService.translate('keyValueInputs.' + key);
    return [
      {
        name: 'tags',
        title: t('inputInput'),
        description: t('inputInputDesc'),
        keyConfig: {
          label: t('category'),
          placeholder: 'team',
          validators: [
            {validator: Validators.pattern(/^[a-z][a-z0-9-]*$/), errorKey: 'pattern', message: t('tagKeyError')},
          ],
        },
        valueConfig: {label: t('tag'), placeholder: 'platform'},
        uniqueKey: false,
        uniqueKeyValuePair: true,
        resetValueOnKeyChange: false,
      },
      {
        name: 'parameters',
        title: t('selectInput'),
        description: t('selectInputDesc'),
        keyConfig: {
          mode: 'select',
          options: [
            {value: 'max_connections', label: 'max_connections'},
            {value: 'shared_buffers', label: 'shared_buffers'},
            {value: 'log_statement', label: 'log_statement'},
          ],
        },
        valueConfig: {placeholder: '100'},
        uniqueKey: true,
        uniqueKeyValuePair: false,
        resetValueOnKeyChange: false,
      },
      {
        name: 'assignments',
        title: t('inputSelect'),
        description: t('inputSelectDesc'),
        keyConfig: {placeholder: 'owner'},
        valueConfig: {
          mode: 'select',
          options: [
            {value: 'platform', label: 'Platform'},
            {value: 'security', label: 'Security'},
          ],
        },
        uniqueKey: true,
        uniqueKeyValuePair: false,
        resetValueOnKeyChange: false,
      },
      {
        name: 'policy',
        title: t('selectSelect'),
        description: t('selectSelectDesc'),
        keyConfig: {
          mode: 'select',
          options: [
            {value: 'environment', label: 'environment'},
            {value: 'region', label: 'region'},
          ],
        },
        valueConfig: this.policyValueConfig,
        uniqueKey: true,
        uniqueKeyValuePair: false,
        resetValueOnKeyChange: true,
      },
    ];
  });

  constructor() {
    for (const name of ['tags', 'parameters', 'assignments', 'policy'] as const) {
      this.sf.bindDisabled(name, () => !this.sf.fields.editing.value());
    }
  }

  save(): void {
    this.sf.markAllAsTouched();
    if (this.sf.valid() && this.sf.fields.editing.value()) this.saved.set(this.sf.submitValue());
  }

  restore(): void {
    const initial: Record<ScenarioName, [string, string]> = {
      tags: ['team', 'platform'],
      parameters: ['max_connections', '100'],
      assignments: ['owner', 'platform'],
      policy: ['environment', 'prod'],
    };
    this.form.controls.editing.setValue(true);
    for (const name of Object.keys(initial) as ScenarioName[]) {
      this.form.controls[name].clear();
      this.form.controls[name].push(createPair(...initial[name]));
    }
    this.sf.markAsPristine();
    this.sf.markAsUntouched();
    this.saved.set(null);
  }

  readonly exampleCode = highlight(`
import {Component} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {KeyValueFieldConfig, KeyValueInputsComponent} from 'clr-lift';
import {toSignalForm} from 'ngx-lift';

@Component({
  imports: [ReactiveFormsModule, KeyValueInputsComponent],
  template: \`
    <form [formGroup]="form" (ngSubmit)="save()">
      <cll-key-value-inputs
        [formArray]="form.controls.settings"
        [keyConfig]="keyConfig"
        [valueConfig]="valueConfig"
        [resetValueOnKeyChange]="true"
        [smartMode]="true"
      />
      <button type="submit" [disabled]="!sf.valid()">Save</button>
    </form>
  \`
})
export class SettingsEditor {
  readonly form = new FormGroup({
    settings: new FormArray<FormGroup<{
      key: FormControl<string>;
      value: FormControl<string>;
    }>>([]),
  });
  readonly sf = toSignalForm(this.form);
  readonly keyConfig: KeyValueFieldConfig = {
    mode: 'select',
    options: [
      {value: 'environment', label: 'Environment'},
      {value: 'owner', label: 'Owner'},
    ],
  };
  readonly valueConfig = (key: string): KeyValueFieldConfig =>
    key === 'environment'
      ? {mode: 'select', options: [
          {value: 'prod', label: 'Production'},
          {value: 'staging', label: 'Staging'},
        ]}
      : {mode: 'input', placeholder: 'Team name'};

  save() {
    this.sf.markAllAsTouched();
    if (this.sf.valid()) console.log(this.sf.submitValue());
  }
}
  `);

  readonly inputs = computed<ApiProperty[]>(() => [
    ...(
      [
        ['formArray', 'FormArray<KeyValueFormGroup>', undefined],
        ['data', 'Array<{key: string; value: string}>', '[]'],
        ['uniqueKey', 'boolean', 'true'],
        ['keyHelper', 'string', "''"],
        ['valueHelper', 'string', "''"],
        ['addText', 'string', "'Add'"],
        ['inputSize', 'number', '40'],
        ['buttonClass', 'string', "''"],
        ['smartMode', 'boolean', 'false'],
        ['keyPattern', '{regex: string | RegExp; message?: string}', undefined],
        ['valuePattern', '{regex: string | RegExp; message?: string}', undefined],
      ] as const
    ).map(([name, type, defaultValue]) => ({
      name,
      type,
      defaultValue,
      required: name === 'formArray',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.inputs.' + name),
    })),
    ...[
      ['keyConfig', 'KeyValueFieldConfig', '{}'],
      ['valueConfig', 'KeyValueValueConfig', '{}'],
      ['resetValueOnKeyChange', 'boolean', 'false'],
      ['uniqueKeyValuePair', 'boolean', 'false'],
    ].map(([name, type, defaultValue]) => ({
      name,
      type,
      defaultValue,
      description: this.translationService.translate('keyValueInputs.api.' + name),
    })),
  ]);

  readonly outputs = computed<ApiProperty[]>(() => [
    {
      name: 'removeKeyValue',
      type: 'OutputEmitterRef<number>',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.outputs.removeKeyValue'),
    },
    {
      name: 'addKeyValue',
      type: 'OutputEmitterRef<void>',
      description: this.translationService.translate('demoApi.key-value-inputs-demo.outputs.addKeyValue'),
    },
  ]);
}
