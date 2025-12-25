import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-difference-in-days',
  imports: [PageContainerComponent, CodeBlockComponent],
  templateUrl: './difference-in-days.component.html',
  styleUrl: './difference-in-days.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifferenceInDaysComponent {
  basicExampleCode = highlight(`
import {differenceInDays} from 'ngx-lift';

// How many whole days are between '2022-09-08' and '2023-09-18'?
console.log(differenceInDays(new Date('2022-09-08'), new Date('2023-09-18'))); // 375
console.log(differenceInDays('2022-09-08', '2023-09-18')); // 375
console.log(differenceInDays('2022-09-08', new Date('2023-09-18'))); // 375
  `);

  fromTodayExampleCode = highlight(`
import {differenceInDays} from 'ngx-lift';

// How many whole days are between today and '2022-09-08'?
const daysAgo = differenceInDays(new Date(), '2022-09-08');
console.log(\`That date was \${daysAgo} days ago\`);

// Using Date.now() (milliseconds)
const daysAgo2 = differenceInDays(Date.now(), '2022-09-08');
console.log(\`That date was \${daysAgo2} days ago\`);
  `);

  signatureCode = highlight(`
differenceInDays(dateLeft: Date | number | string, dateRight: Date | number | string): number
  `);
}
