import {isEmpty, isNotEmpty} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-empty',
  imports: [PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './is-empty.component.html',
  styleUrl: './is-empty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEmptyComponent {
  readonly firstCases = [
    {expression: 'isEmpty([])', result: String(isEmpty([]))},
    {expression: 'isEmpty([0])', result: String(isEmpty([0]))},
    {expression: 'isEmpty(0)', result: String(isEmpty(0))},
    {expression: 'isEmpty(false)', result: String(isEmpty(false))},
    {expression: 'isNotEmpty([])', result: String(isNotEmpty([]))},
  ];
  readonly firstTaskCode = highlight(`import {isEmpty, isNotEmpty} from 'ngx-lift';

isEmpty([]); // true
isEmpty([0]); // false
isEmpty(0); // true — this helper checks collection content, not general validity.
isEmpty(false); // true
isNotEmpty([]); // false

const items: string[] | null = [];
// isNotEmpty is a boolean check, not a nullability type guard.
if (items != null && isNotEmpty(items)) {
  const count = items.length;
}
// An empty, defined array remains defined. Use value == null for null/undefined checks.`);

  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: 'unknown',
        description: this.translationService.translate('isEmpty.paramValue'),
      },
    ];
  });
  basicExampleCode = highlight(`
import {isEmpty} from 'ngx-lift';

console.log(isEmpty('abc')); // false
console.log(isEmpty('')); // true
console.log(isEmpty({})); // true
console.log(isEmpty({name: 'John'})); // false
console.log(isEmpty([])); // true
console.log(isEmpty([1, 2, 3])); // false
console.log(isEmpty(null)); // true
console.log(isEmpty(undefined)); // true
  `);

  useCaseExampleCode = highlight(`
import {isEmpty} from 'ngx-lift';

function processData(data: unknown) {
  if (isEmpty(data)) {
    console.log('Data is empty, using default value');
    return {default: true};
  }
  return data;
}

const result1 = processData({}); // Returns {default: true}
const result2 = processData({name: 'John'}); // Returns {name: 'John'}
  `);

  signatureCode = highlight(`isEmpty(value: unknown): boolean;`);
}
