import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {RangePipe} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-range-pipe',
  standalone: true,
  imports: [CodeBlockComponent, PageContainerComponent, CalloutComponent, RangePipe],
  templateUrl: './range-pipe.component.html',
  styleUrl: './range-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangePipeComponent {
  exampleCode = highlight(`
import {RangePipe} from 'ngx-lift';

@Component({
  standalone: true,
  imports: [RangePipe],
  template: \`
    <p>{{ [1, 5] | range }}</p>
    <!-- generate an array from 1 to 4: [1,2,3,4] -->

    <p>{{ [10, 5] | range }}</p>
    <!-- generate an array from 10 to 6 since start is bigger than end: [10,9,8,7,6] -->

    <p>{{ [1, 5, 2] | range }}</p>
    <!-- stepper by 2: [1,3] -->

    <p>{{ [1, 5, 1, true] | range }}</p>
    <!-- reverse the array by passing true: [4,3,2,1] -->
  \`
})
export class RangePipeComponent { }
  `);

  cpuCode = highlight(`
<div class="space-x-6">
  <label for="cpu-count">Choose CPU count</label>
  <select id="cpu-count">
    @for (count of [1, 5] | range; track count) {
      <option [value]="count">{{ count }} CPU(s)</option>
    }
  </select>
</div>
    `);
}
