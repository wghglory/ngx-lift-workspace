import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-equal',
  imports: [PageContainerComponent, CodeBlockComponent],
  templateUrl: './is-equal.component.html',
  styleUrl: './is-equal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEqualComponent {
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

  signatureCode = highlight(`
isEqual(value1: unknown, value2: unknown): boolean
  `);
}
