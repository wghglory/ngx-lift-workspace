import {differenceInDays} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-difference-in-days',
  imports: [PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './difference-in-days.component.html',
  styleUrl: './difference-in-days.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifferenceInDaysComponent {
  readonly firstCases = [
    {expression: 'differenceInDays(48h, 0)', result: String(differenceInDays(48 * 3600000, 0))},
    {expression: 'differenceInDays(23h, 0)', result: String(differenceInDays(23 * 3600000, 0))},
    {expression: 'differenceInDays(0, 48h)', result: String(differenceInDays(0, 48 * 3600000))},
  ];
  readonly firstTaskCode = highlight(`import {differenceInDays} from 'ngx-lift';

// dateLeft minus dateRight, truncated toward zero in whole 24-hour periods.
differenceInDays('2026-10-03T00:00:00Z', '2026-10-01T00:00:00Z'); // 2
differenceInDays('2026-10-01T23:00:00Z', '2026-10-01T00:00:00Z'); // 0
differenceInDays('2026-10-01T00:00:00Z', '2026-10-03T00:00:00Z'); // -2
// Use explicit offsets for reproducible elapsed time. This is not calendar-day counting.
// Invalid date inputs produce NaN; validate input before using the result.`);

  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'dateLeft',
        type: 'Date | number | string',
        description: this.translationService.translate('differenceInDays.paramDateLeft'),
      },
      {
        name: 'dateRight',
        type: 'Date | number | string',
        description: this.translationService.translate('differenceInDays.paramDateRight'),
      },
    ];
  });
  basicExampleCode = highlight(`
import {differenceInDays} from 'ngx-lift';

// How many whole days are between '2022-09-08' and '2023-09-18'?
console.log(differenceInDays(new Date('2022-09-08'), new Date('2023-09-18'))); // -375
console.log(differenceInDays('2022-09-08', '2023-09-18')); // -375
console.log(differenceInDays('2022-09-08', new Date('2023-09-18'))); // -375
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

  signatureCode = highlight(
    `differenceInDays(dateLeft: Date | number | string, dateRight: Date | number | string): number;`,
  );
}
