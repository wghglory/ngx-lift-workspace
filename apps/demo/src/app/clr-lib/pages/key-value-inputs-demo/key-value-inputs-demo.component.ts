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
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-key-value-inputs-demo',
  imports: [
    CommonModule,
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
