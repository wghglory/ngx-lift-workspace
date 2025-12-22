import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-equal',
  standalone: true,
  imports: [PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './is-equal.component.html',
  styleUrl: './is-equal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEqualComponent {
  exampleCode = highlight(`
import {isEqual} from 'ngx-lift';

console.log(isEqual(1, 1)); // true
console.log(isEqual('1', '1')); // true
console.log(isEqual([1], [1])); // true
console.log(isEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})); // true
        `);
}
