import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-logger',
  imports: [PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './logger.component.html',
  styleUrl: './logger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggerComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'method',
        type: "'log' | 'table' | 'dir' | 'count' | 'debug'",
        default: "'log'",
        description: this.translationService.translate('logger.paramMethod'),
      },
    ];
  });

  basicExampleCode = highlight(`import {logger} from 'ngx-lift';
import {of} from 'rxjs';

const output: number[][] = [];
// of(array) emits ONE array, not three separate numbers.
of([1, 2, 3])
  .pipe(logger())
  .subscribe((value) => output.push(value));
// Console: [1, 2, 3]
// output: [[1, 2, 3]] — logger observes values without changing them.
// Nothing logs until subscribed. Each subscription performs logging again.
// Log only non-sensitive diagnostic data. Remove diagnostic logging when finished.`);

  tableExampleCode = highlight(`
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

of([1, 1, 2, 2, 3, 4, 4, 5]).pipe(logger('table')).subscribe();
// check your console for table result
  `);

  otherMethodsCode = highlight(`
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

of([1, 2, 3]).pipe(logger('debug')).subscribe();
of([1, 2, 3]).pipe(logger('dir')).subscribe();
of([1, 2, 3]).pipe(logger('count')).subscribe();
  `);

  signatureCode = highlight(
    `logger(method?: 'log' | 'table' | 'dir' | 'count' | 'debug'): MonoTypeOperatorFunction<T>;`,
  );
}
