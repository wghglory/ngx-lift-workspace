import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-array-join-pipe',
  imports: [CodeBlockComponent, PageContainerComponent],
  templateUrl: './array-join-pipe.component.html',
  styleUrl: './array-join-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayJoinPipeComponent {
  basicExampleCode = highlight(`
import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ [1, 2, 3, 4] | arrayJoin }}</p>
    <!-- Output: "1,2,3,4" -->
  \`
})
export class ArrayJoinExampleComponent {}
  `);

  customSeparatorsCode = highlight(`
import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ ['apple', 'orange', 'banana'] | arrayJoin: ';' }}</p>
    <!-- Output: "apple;orange;banana" -->

    <p>{{ ['John', 'Doe'] | arrayJoin: ' - ' }}</p>
    <!-- Output: "John - Doe" -->
  \`
})
export class ArrayJoinExampleComponent {}
  `);

  numericArrayCode = highlight(`
import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ [10, 20, 30] | arrayJoin }}</p>
    <!-- Output: "10,20,30" -->

    <p>{{ [100, 200, 300] | arrayJoin: ' | ' }}</p>
    <!-- Output: "100 | 200 | 300" -->
  \`
})
export class ArrayJoinExampleComponent {}
  `);

  signatureCode = highlight(`
transform(value: unknown, separator?: string): string | unknown
  `);
}
