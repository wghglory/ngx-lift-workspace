import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-array-join-pipe',
  standalone: true,
  imports: [CodeBlockComponent, PageContainerComponent],
  templateUrl: './array-join-pipe.component.html',
  styleUrl: './array-join-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayJoinPipeComponent {
  exampleCode = highlight(`
import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  standalone: true,
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ [1, 2, 3, 4] | arrayJoin }}</p>
    <!-- Output: "1,2,3,4" -->

    <p>{{ ['apple', 'orange', 'banana'] | arrayJoin: ';' }}</p>
    <!-- Output: "apple;orange;banana" -->

    <p>{{ ['John', 'Doe'] | arrayJoin: ' - ' }}</p>
    <!-- Output: "John - Doe" -->
  \`
})
export class ArrayJoinPipeDemoComponent { }
  `);
}
