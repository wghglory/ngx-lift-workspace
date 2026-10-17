import {isEqual} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-equal',
  imports: [PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './is-equal.component.html',
  styleUrl: './is-equal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEqualComponent {
  readonly firstCases = [
    {expression: 'isEqual([1], [1])', result: String(isEqual([1], [1]))},
    {expression: 'isEqual([1, 2], [2, 1])', result: String(isEqual([1, 2], [2, 1]))},
    {expression: 'isEqual(NaN, NaN)', result: String(isEqual(NaN, NaN))},
  ];
  readonly firstTaskCode = highlight(`import {isEqual} from 'ngx-lift';

const original = {id: 'a', labels: ['ready']};
const sameContent = {id: 'a', labels: ['ready']};
original === sameContent; // false — different object references
isEqual(original, sameContent); // true — equal nested content
isEqual([1, 2], [2, 1]); // false — array order matters
isEqual(NaN, NaN); // true
// Use for content comparison, such as deciding whether form values changed.
// For one business identifier, a direct ID comparison is usually clearer.`);

  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value1',
        type: 'unknown',
        description: this.translationService.translate('isEqual.paramValue1'),
      },
      {
        name: 'value2',
        type: 'unknown',
        description: this.translationService.translate('isEqual.paramValue2'),
      },
    ];
  });
  basicExampleCode = highlight(`
import {isEqual} from 'ngx-lift';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('1', '1')); // true
console.log(isEqual('1', 1)); // false
console.log(isEqual([1], [1])); // true
console.log(isEqual([1], [2])); // false
  `);

  deepComparisonCode = highlight(`
import {isEqual} from 'ngx-lift';

// Deep object comparison
console.log(isEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})); // true
console.log(isEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 3}})); // false

// Deep array comparison
console.log(isEqual([1, [2, 3]], [1, [2, 3]])); // true
console.log(isEqual([1, [2, 3]], [1, [2, 4]])); // false
  `);

  signatureCode = highlight(`isEqual<T>(value1: T, value2: T): boolean;`);
}
