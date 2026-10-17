import {pickBy, omitBy} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-pick-by',
  imports: [PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './pick-by.component.html',
  styleUrl: './pick-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickByComponent {
  readonly firstCases = [
    {
      expression: 'pickBy({count: 0, enabled: false, note: null}, value => value != null)',
      result: String(JSON.stringify(pickBy({count: 0, enabled: false, note: null}, (value) => value != null))),
    },
    {
      expression: 'omitBy({count: 0, enabled: false, note: null}, value => value == null)',
      result: String(JSON.stringify(omitBy({count: 0, enabled: false, note: null}, (value) => value == null))),
    },
  ];
  readonly firstTaskCode = highlight(`import {pickBy, omitBy} from 'ngx-lift';

const input = {count: 0, enabled: false, note: null};
const selected = pickBy(input, (value) => value != null);
const omitted = omitBy(input, (value) => value == null);
// Both: {count: 0, enabled: false}
// Boolean as a predicate would also remove 0 and false. Choose the predicate deliberately.
// Both return a new Partial<typeof input>; the input is unchanged and nested values are shared.`);

  private translationService = inject(TranslationService);

  pickByParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'object',
        type: 'Record<string, T>',
        description: this.translationService.translate('pickBy.paramObject'),
      },
      {
        name: 'predicate',
        type: '(value: T, key: string) => boolean',
        description: this.translationService.translate('pickBy.paramPredicate'),
      },
    ];
  });

  omitByParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'object',
        type: 'Record<string, T>',
        description: this.translationService.translate('omitBy.paramObject'),
      },
      {
        name: 'predicate',
        type: '(value: T, key: string) => boolean',
        description: this.translationService.translate('omitBy.paramPredicate'),
      },
    ];
  });
  pickByCode = highlight(`
import {pickBy} from 'ngx-lift';

const inputObject = {
  name: 'John',
  age: 25,
  city: 'New York',
  isActive: true,
};

const predicate = (value: unknown, key: string) => typeof value === 'string' || key === 'isActive';

const result = pickBy(inputObject, predicate);

// Output:
// {
//   name: 'John',
//   city: 'New York',
//   isActive: true,
// }
  `);

  omitByCode = highlight(`
import {omitBy} from 'ngx-lift';

const inputObject = {
  name: 'John',
  age: 25,
  city: 'New York',
  isActive: true,
};

const predicate = (value: unknown, key: string) => typeof value === 'string' || key === 'isActive';

const result = omitBy(inputObject, predicate);

// Output:
// {
//   age: 25,
// }
  `);

  pickBySignatureCode = highlight(
    `pickBy<T>(source: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T>;`,
  );

  omitBySignatureCode = highlight(
    `omitBy<T>(source: T, predicate: (value: T[keyof T], key: string) => boolean): Partial<T>;`,
  );
}
