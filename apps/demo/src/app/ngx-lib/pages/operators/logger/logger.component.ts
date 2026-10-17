import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

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
export class LoggerComponent implements OnInit {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'method',
        type: "'log' | 'table' | 'warn' | 'error' | 'info' | 'debug'",
        default: "'log'",
        description: this.translationService.translate('logger.paramMethod'),
      },
    ];
  });
  ngOnInit() {
    of([1, 1, 2, 2, 3, 4, 4, 5]).pipe(logger('table')).subscribe();
  }

  basicExampleCode = highlight(`
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

of([1, 2, 3]).pipe(logger()).subscribe();
// check your console for result
  `);

  tableExampleCode = highlight(`
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

of([1, 1, 2, 2, 3, 4, 4, 5]).pipe(logger('table')).subscribe();
// check your console for table result
  `);

  otherMethodsCode = highlight(`
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

of([1, 2, 3]).pipe(logger('warn')).subscribe();
of([1, 2, 3]).pipe(logger('error')).subscribe();
of([1, 2, 3]).pipe(logger('info')).subscribe();
  `);

  signatureCode = highlight(
    `logger(method?: 'log' | 'table' | 'warn' | 'error' | 'info' | 'debug'): MonoTypeOperatorFunction<T>;`,
  );
}
