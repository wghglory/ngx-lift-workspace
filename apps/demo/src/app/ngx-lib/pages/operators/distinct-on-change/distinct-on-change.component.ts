import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-distinct-on-change',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './distinct-on-change.component.html',
  styleUrl: './distinct-on-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistinctOnChangeComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'callback',
        type: '(previous: T, current: T) => void',
        description: this.translationService.translate('distinctOnChange.paramCallback'),
      },
      {
        name: 'comparator',
        type: '(previous: T, current: T) => boolean',
        default: '===',
        description: this.translationService.translate('distinctOnChange.paramComparator'),
      },
    ];
  });
  data = [1, 1, 2, 2, 3, 4, 4, 5];

  basicExampleCode = highlight(`import {distinctOnChange} from 'ngx-lift';
import {from} from 'rxjs';

const transitions: string[] = [];
const output: number[] = [];
from([1, 1, 2, 2, 3])
  .pipe(distinctOnChange((previous, current) => transitions.push(previous + ' → ' + current)))
  .subscribe((value) => output.push(value));

// output: [1, 2, 3] — the first value passes through without a callback.
// transitions: ['1 → 2', '2 → 3'] — compare with the previous DISTINCT value.
// The default comparator is ===; use a comparator for object identity by ID.`);

  comparatorExampleCode = highlight(`import {distinctOnChange} from 'ngx-lift';
import {from} from 'rxjs';

interface User {
  id: number;
  name: string;
}

from([
  {id: 1, name: 'John'},
  {id: 1, name: 'John'},
  {id: 2, name: 'Jane'},
])
  .pipe(
    distinctOnChange(
      (prev, curr) => console.log(\`User changed from \${prev.name} to \${curr.name}\`),
      (prev, curr) => prev.id === curr.id,
    ),
  )
  .subscribe();`);

  signatureCode = highlight(`distinctOnChange<T>(
  onChangeCallback: (previous: T, current: T) => void,
  comparator?: (previous: T, current: T) => boolean,
): MonoTypeOperatorFunction<T>;`);
}
