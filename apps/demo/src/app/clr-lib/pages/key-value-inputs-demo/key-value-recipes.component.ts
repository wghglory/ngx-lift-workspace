import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  KeyValueControlComponent,
  KeyValueEntry,
  KeyValueFieldConfig,
  KeyValueKeyConfig,
  KeyValueValue,
  KeyValueValueConfig,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';

import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';

const tagCatalog: Record<string, string[]> = {
  environment: ['production', 'staging', 'development'],
  'cost-center': ['engineering', 'operations', 'finance'],
};
const keyOptions = Object.keys(tagCatalog).map((value) => ({value, label: value}));
const tagValues: KeyValueValueConfig = (key) => ({
  type: 'select',
  disabled: !tagCatalog[key],
  options: (tagCatalog[key] ?? []).map((value) => ({value, label: value})),
});
const schema: Record<string, KeyValueFieldConfig> = {
  hostname: {type: 'input'},
  retries: {type: 'number', min: 1, max: 10},
  enabled: {type: 'boolean'},
  hosts: {type: 'array'},
};

interface Recipe {
  id: string;
  control: FormControl<KeyValueEntry<KeyValueValue>[]>;
  keyConfig: KeyValueKeyConfig;
  valueConfig: KeyValueValueConfig;
  resetValue?: boolean;
  uniquePairs?: boolean;
  excludeSelected?: boolean;
  code: string;
}

@Component({
  selector: 'app-key-value-recipes',
  imports: [JsonPipe, ReactiveFormsModule, KeyValueControlComponent, DemoPlaygroundComponent, TranslatePipe],
  templateUrl: './key-value-recipes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueRecipesComponent {
  private readonly translations = inject(TranslationService);
  private readonly controls = {
    keySelect: this.control([{key: 'environment', value: 'production'}]),
    valueSelect: this.control([{key: 'environment', value: 'production'}]),
    bothSelect: this.control([{key: 'environment', value: 'production'}]),
    dependent: this.control([{key: 'environment', value: 'production'}]),
    tags: this.control([
      {key: 'category', value: 'alpha'},
      {key: 'category', value: 'beta'},
    ]),
    schema: this.control([
      {key: 'retries', value: 3},
      {key: 'enabled', value: false},
      {key: 'hosts', value: ['one.example', 'two.example']},
    ]),
  };
  readonly recipes = computed<Recipe[]>(() => {
    const message = this.translations.translate('keyValueRecipes.tagError');
    const arrayHelp = this.translations.translate('keyValueRecipes.arrayHelp');
    const keySelect: KeyValueKeyConfig = {type: 'select', options: keyOptions};
    const rules = {validators: [{validator: Validators.pattern(/^\S(?:.*\S)?$/), errorKey: 'pattern', message}]};
    const configs: Omit<Recipe, 'control' | 'code'>[] = [
      {id: 'keySelect', keyConfig: keySelect, valueConfig: {}},
      {id: 'valueSelect', keyConfig: {}, valueConfig: tagValues, resetValue: true},
      {id: 'bothSelect', keyConfig: keySelect, valueConfig: tagValues, resetValue: true},
      {
        id: 'dependent',
        keyConfig: keySelect,
        valueConfig: tagValues,
        resetValue: true,
      },
      {id: 'tags', keyConfig: rules, valueConfig: rules, uniquePairs: true},
      {
        id: 'schema',
        keyConfig: {type: 'combobox', options: Object.keys(schema).map((key) => ({value: key, label: key}))},
        valueConfig: (key) => ({...(schema[key] ?? {disabled: true}), ...(key === 'hosts' ? {helper: arrayHelp} : {})}),
        resetValue: true,
        excludeSelected: true,
      },
    ];
    return configs.map((recipe) => ({
      ...recipe,
      control: this.controls[recipe.id as keyof typeof this.controls],
      code: this.source(recipe.id),
    }));
  });

  /** Demonstrate saved data that requires explicit correction without normalizing it on load. */
  loadIncompatibleValues(): void {
    this.controls.schema.setValue([
      {key: 'retries', value: false},
      {key: 'enabled', value: 3},
      {key: 'hosts', value: ['one\ntwo']},
    ]);
    this.controls.schema.markAllAsTouched();
  }

  private control(entries: KeyValueEntry<KeyValueValue>[]) {
    return new FormControl(entries, {nonNullable: true});
  }

  private source(id: string) {
    const keys = JSON.stringify(keyOptions);
    const catalog = JSON.stringify(tagCatalog);
    const keyConfig =
      id === 'schema'
        ? `{type: 'combobox', options: Object.keys(schema).map(key => ({value: key, label: key}))}`
        : id === 'tags'
          ? 'rules'
          : id === 'valueSelect'
            ? '{}'
            : `{type: 'select', options: ${keys}}`;
    const valueConfig =
      id === 'schema'
        ? `(key: string) => ({...(schema[key] ?? {disabled: true}), ...(key === 'hosts' ? {helper: 'One item per line'} : {})})`
        : id === 'tags'
          ? 'rules'
          : id === 'keySelect'
            ? '{}'
            : `(key: string) => ({type: 'select', disabled: !tagCatalog[key], options: (tagCatalog[key] ?? []).map(value => ({value, label: value}))})`;
    const bindings = [
      id === 'tags' ? '[uniqueKeys]="false" [uniquePairs]="true"' : '',
      ['schema', 'dependent', 'bothSelect', 'valueSelect'].includes(id) ? '[resetValueOnKeyChange]="true"' : '',
      id === 'schema' ? '[excludeSelectedKeys]="true"' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const source = `import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule${id === 'tags' ? ', Validators' : ''}} from '@angular/forms';
import {KeyValueControlComponent, KeyValueEntry, KeyValueValue, ${id === 'schema' ? 'KeyValueFieldConfig, ' : ''}KeyValueKeyConfig, KeyValueValueConfig} from 'clr-lift';
${!['schema', 'tags', 'keySelect'].includes(id) ? `const tagCatalog: Record<string, string[]> = ${catalog};` : ''}
${id === 'schema' ? `const schema: Record<string, KeyValueFieldConfig> = ${JSON.stringify(schema)};` : ''}
${id === 'tags' ? `const rules: KeyValueKeyConfig = {validators: [{validator: Validators.pattern(/^\\S(?:.*\\S)?$/), errorKey: 'pattern', message: 'Do not start or end with whitespace'}]};` : ''}
@Component({
  imports: [ReactiveFormsModule, KeyValueControlComponent],
  template: \`<cll-key-value-control [formControl]="entries" [keyConfig]="keyConfig" [valueConfig]="valueConfig"
    ${bindings} />
    ${id === 'schema' ? '<button class="btn" type="button" (click)="loadIncompatibleValues()">Load incompatible saved values</button>' : ''}
    <button class="btn" type="button" (click)="entries.reset()">Reset</button>\`,
})
export class Example {
  readonly entries = new FormControl<KeyValueEntry<KeyValueValue>[]>(${JSON.stringify(this.controls[id as keyof typeof this.controls].defaultValue)}, {nonNullable: true});
  readonly keyConfig: KeyValueKeyConfig = ${keyConfig};
  readonly valueConfig: KeyValueValueConfig = ${valueConfig};
  ${
    id === 'schema'
      ? `loadIncompatibleValues(): void {
    this.entries.setValue([{key: 'retries', value: false}, {key: 'enabled', value: 3}, {key: 'hosts', value: ['one\\ntwo']}]);
    this.entries.markAllAsTouched();
  }`
      : ''
  }
}`;
    return highlight(source.replace(/^[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n'));
  }
}
