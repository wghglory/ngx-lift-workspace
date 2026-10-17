import {ArrayJoinPipe} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-array-join-pipe',
  imports: [ArrayJoinPipe, CodeBlockComponent, PageContainerComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './array-join-pipe.component.html',
  styleUrl: './array-join-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayJoinPipeComponent {
  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ArrayJoinPipe} from 'ngx-lift';

@Component({
  selector: 'app-pipe-example',
  imports: [ArrayJoinPipe],
  template: \`<p>{{ ['Atlas', 'Beacon'] | arrayJoin: ', ' }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeExampleComponent {}
// Output: Atlas, Beacon`);
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
  basicExampleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {ArrayJoinPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ArrayJoinPipe],\n  template: `\n    <p>{{ [1, 2, 3, 4] | arrayJoin }}</p>\n    <!-- Output: \"1,2,3,4\" -->\n  `,\n})\nexport class ArrayJoinExampleComponent {}",
  );

  customSeparatorsCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {ArrayJoinPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ArrayJoinPipe],\n  template: `\n    <p>{{ ['apple', 'orange', 'banana'] | arrayJoin: ';' }}</p>\n    <!-- Output: \"apple;orange;banana\" -->\n\n    <p>{{ ['John', 'Doe'] | arrayJoin: ' - ' }}</p>\n    <!-- Output: \"John - Doe\" -->\n  `,\n})\nexport class ArrayJoinExampleComponent {}",
  );

  numericArrayCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {ArrayJoinPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ArrayJoinPipe],\n  template: `\n    <p>{{ [10, 20, 30] | arrayJoin }}</p>\n    <!-- Output: \"10,20,30\" -->\n\n    <p>{{ [100, 200, 300] | arrayJoin: ' | ' }}</p>\n    <!-- Output: \"100 | 200 | 300\" -->\n  `,\n})\nexport class ArrayJoinExampleComponent {}",
  );

  signatureCode = highlight(`transform(value: unknown, separator?: string): string | unknown;`);
}
