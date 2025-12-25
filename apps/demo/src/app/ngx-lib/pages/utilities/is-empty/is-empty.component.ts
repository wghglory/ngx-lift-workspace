import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-empty',
  imports: [PageContainerComponent, CodeBlockComponent],
  templateUrl: './is-empty.component.html',
  styleUrl: './is-empty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEmptyComponent {
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

  signatureCode = highlight(`
isEmpty(value: unknown): boolean
  `);
}
