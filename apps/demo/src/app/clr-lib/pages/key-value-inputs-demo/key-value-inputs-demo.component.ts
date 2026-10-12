import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {
  CalloutComponent,
  KeyValueFormGroup,
  KeyValueInputsComponent,
  PageContainerComponent,
  TranslatePipe,
} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-key-value-inputs-demo',
  imports: [
    CommonModule,
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
  form = new FormGroup({
    appProperties: new FormArray<KeyValueFormGroup>([]),
  });

  data = [
    {key: 'key1', value: 'value1'},
    {key: 'key2', value: 'value2'},
  ];

  exampleCode = highlight(`
import {KeyValueFormGroup, KeyValueInputsComponent} from 'clr-lift';
import {Component} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [KeyValueInputsComponent, ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
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
    </form>
  \`
})
export class KeyValueInputsExampleComponent {
  form = new FormGroup({
    appProperties: new FormArray<KeyValueFormGroup>([]),
  });

  data = [
    {key: 'key1', value: 'value1'},
    {key: 'key2', value: 'value2'},
  ];
}
  `);

  readonly inputs: ApiProperty[] = [
    {
      name: 'formArray',
      type: 'FormArray<KeyValueFormGroup>',
      required: true,
      description: 'The FormArray instance from the parent component used to manage the key-value pairs.',
    },
    {
      name: 'data',
      type: 'Array<{key: string; value: string}>',
      description: 'Initial data to pre-populate the form with existing key-value pairs.',
    },
    {
      name: 'uniqueKey',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Set to <code>true</code> to enable unique key validation. Uses <code>UniqueValidator</code> from ngx-lift.',
    },
    {
      name: 'keyHelper',
      type: 'string',
      description: 'Helper text for the key input field.',
    },
    {
      name: 'valueHelper',
      type: 'string',
      description: 'Helper text for the value input field.',
    },
    {
      name: 'addText',
      type: 'string',
      defaultValue: "'Add Key-Value Pair'",
      description: 'Text for the "Add Key-Value Pair" button.',
    },
    {
      name: 'inputSize',
      type: 'number',
      description: 'Size of the input fields.',
    },
    {
      name: 'buttonClass',
      type: 'string',
      description: 'Custom class to apply to "Add Key-Value Pair" button.',
    },
    {
      name: 'smartMode',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'If set to <code>true</code>, the component will automatically create one key-value pair when there are no key-value inputs.',
    },
    {
      name: 'keyPattern',
      type: '{regex: string; message?: string}',
      description:
        'If key control needs to pass a custom regex pattern. You can pass an object with two keys: <code>regex</code> and <code>message</code>. The message property is optional.',
    },
    {
      name: 'valuePattern',
      type: '{regex: string; message?: string}',
      description: 'Similar to <code>keyPattern</code>, but used for value control validation.',
    },
  ];

  readonly outputs: ApiProperty[] = [
    {
      name: 'removeKeyValue',
      type: 'EventEmitter<number>',
      description: 'Event emitted when a key-value pair is removed. Provides the index of the removed pair.',
    },
    {
      name: 'addKeyValue',
      type: 'EventEmitter<void>',
      description: 'Event emitted when a new key-value pair is added.',
    },
  ];
}
