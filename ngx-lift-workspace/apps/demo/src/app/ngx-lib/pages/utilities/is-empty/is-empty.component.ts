import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-empty',
  standalone: true,
  imports: [PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './is-empty.component.html',
  styleUrl: './is-empty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEmptyComponent {
  exampleCode = highlight(`
import {isEmpty} from 'ngx-lift';

console.log(isEmpty('abc')); // false
console.log(isEmpty({})); // true
console.log(isEmpty([])); // true
        `);
}
