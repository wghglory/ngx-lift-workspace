import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-logger',
  standalone: true,
  imports: [PageContainerComponent, CodeBlockComponent],
  templateUrl: './logger.component.html',
  styleUrl: './logger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggerComponent implements OnInit {
  ngOnInit() {
    of([1, 1, 2, 2, 3, 4, 4, 5]).pipe(logger('table')).subscribe();
  }

  tsCode = highlight(
    `
import {logger} from 'ngx-lift';
import {of} from 'rxjs';

of([1, 1, 2, 2, 3, 4, 4, 5]).pipe(logger('table')).subscribe();

// check your console for result
    `,
  );
}
