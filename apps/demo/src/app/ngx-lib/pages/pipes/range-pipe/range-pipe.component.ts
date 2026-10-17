import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {RangePipe} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-range-pipe',
  imports: [
    JsonPipe,
    RangePipe,
    CodeBlockComponent,
    PageContainerComponent,
    CalloutComponent,
    RangePipe,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './range-pipe.component.html',
  styleUrl: './range-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangePipeComponent {
  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {RangePipe} from 'ngx-lift';

@Component({
  selector: 'app-pipe-example',
  imports: [RangePipe, JsonPipe],
  template: \`<p>{{ [1, 5] | range | json }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeExampleComponent {}
// Output: [1, 2, 3, 4]
// End is exclusive: [1, 5] produces 1, 2, 3, 4. JsonPipe displays the array.`);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: '[number] | [number, number] | [number, number, number] | [number, number, number, boolean]',
        description: this.translationService.translate('rangePipe.paramValue'),
      },
    ];
  });
  basicExampleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {RangePipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [RangePipe],\n  template: `\n    <p>{{ [1, 5] | range }}</p>\n    <!-- Output: [1,2,3,4] -->\n\n    <p>{{ [10, 5] | range }}</p>\n    <!-- Output: [10,9,8,7,6] (start is bigger than end) -->\n  `,\n})\nexport class RangeExampleComponent {}",
  );

  stepExampleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {RangePipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [RangePipe],\n  template: `\n    <p>{{ [1, 5, 2] | range }}</p>\n    <!-- Output: [1,3] (step by 2) -->\n  `,\n})\nexport class RangeStepExampleComponent {}",
  );

  reverseExampleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {RangePipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [RangePipe],\n  template: `\n    <p>{{ [1, 5, 1, true] | range }}</p>\n    <!-- Output: [4,3,2,1] (reverse the array) -->\n  `,\n})\nexport class RangeReverseExampleComponent {}",
  );

  signatureCode = highlight(`transform(value: [number]): number[];
transform(value: [number, number]): number[];
transform(value: [number, number, number]): number[];
transform(value: [number, number, number, boolean]): number[];`);

  cpuCode = highlight(
    'import {ChangeDetectionStrategy, Component} from \'@angular/core\';\n\nimport {RangePipe} from \'ngx-lift\';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [RangePipe],\n  template: `\n    <div cds-layout="horizontal gap:sm align:center">\n      <label for="cpu-count">Choose CPU count</label>\n      <select id="cpu-count">\n        @for (count of [1, 5] | range; track $index) {\n          <option [value]="count">{{ count }} CPU(s)</option>\n        }\n      </select>\n    </div>\n  `,\n})\nexport class CpuExampleComponent {}',
  );
}
