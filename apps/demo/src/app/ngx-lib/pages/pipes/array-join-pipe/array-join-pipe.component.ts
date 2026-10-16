import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-array-join-pipe',
  imports: [CodeBlockComponent, PageContainerComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './array-join-pipe.component.html',
  styleUrl: './array-join-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayJoinPipeComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: 'unknown',
        description: this.translationService.translate('arrayJoinPipe.paramValue'),
      },
      {
        name: 'separator',
        type: 'string',
        default: "','",
        description: this.translationService.translate('arrayJoinPipe.paramSeparator'),
      },
    ];
  });
  basicExampleCode = highlight(`import {Component} from '@angular/core';

import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ [1, 2, 3, 4] | arrayJoin }}</p>
    <!-- Output: "1,2,3,4" -->
  \`,
})
export class ArrayJoinExampleComponent {}`);

  customSeparatorsCode = highlight(`import {Component} from '@angular/core';

import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ ['apple', 'orange', 'banana'] | arrayJoin: ';' }}</p>
    <!-- Output: "apple;orange;banana" -->

    <p>{{ ['John', 'Doe'] | arrayJoin: ' - ' }}</p>
    <!-- Output: "John - Doe" -->
  \`,
})
export class ArrayJoinExampleComponent {}`);

  numericArrayCode = highlight(`import {Component} from '@angular/core';

import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  imports: [ArrayJoinPipe],
  template: \`
    <p>{{ [10, 20, 30] | arrayJoin }}</p>
    <!-- Output: "10,20,30" -->

    <p>{{ [100, 200, 300] | arrayJoin: ' | ' }}</p>
    <!-- Output: "100 | 200 | 300" -->
  \`,
})
export class ArrayJoinExampleComponent {}`);

  signatureCode = highlight(`transform(value: unknown, separator?: string): string | unknown;`);
}
