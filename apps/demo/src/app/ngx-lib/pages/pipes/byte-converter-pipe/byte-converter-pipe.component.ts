import {ByteConverterPipe} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-byte-converter-pipe',
  imports: [
    ByteConverterPipe,
    CodeBlockComponent,
    PageContainerComponent,
    CalloutComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './byte-converter-pipe.component.html',
  styleUrl: './byte-converter-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByteConverterPipeComponent {
  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ByteConverterPipe} from 'ngx-lift';

@Component({
  selector: 'app-pipe-example',
  imports: [ByteConverterPipe],
  template: \`<p>{{ 1024 | byteConverter: 'en' }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeExampleComponent {}
// Output: 1 KB
// Units use 1024-based scaling; the optional locale controls formatting and labels.
// Without a locale argument, the pipe reads the application LOCALE_ID.`);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: 'number | null',
        default: 'undefined',
        description: this.translationService.translate('byteConverterPipe.paramValue'),
      },
      {
        name: 'locale',
        type: 'string',
        default: 'LOCALE_ID',
        description: this.translationService.translate('byteConverterPipe.languageSupportDesc'),
      },
    ];
  });
  basicExampleCode = highlight(
    'import {ChangeDetectionStrategy, Component} from \'@angular/core\';\n\nimport {ByteConverterPipe} from \'ngx-lift\';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ByteConverterPipe],\n  template: `\n    <p>{{ 104.89 | byteConverter }}</p>\n    <!-- Output: "104.89 B" -->\n\n    <p>{{ 1044.89 | byteConverter }}</p>\n    <!-- Output: "1.02 KB" -->\n  `,\n})\nexport class ByteConverterExampleComponent {}',
  );

  fileSizeDisplayCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {ByteConverterPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ByteConverterPipe],\n  template: `\n    <p>File size: {{ fileSizeInBytes | byteConverter }}</p>\n    <!-- Example: \"File size: 1.02 KB\" -->\n  `,\n})\nexport class FileSizeExampleComponent {\n  fileSizeInBytes = 1044.89;\n}",
  );

  unitConversionsCode = highlight(
    'import {ChangeDetectionStrategy, Component} from \'@angular/core\';\n\nimport {ByteConverterPipe} from \'ngx-lift\';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ByteConverterPipe],\n  template: `\n    <p>{{ 104.89 | byteConverter }}</p>\n    <!-- Output: "104.89 B" -->\n\n    <p>{{ 1044.89 | byteConverter }}</p>\n    <!-- Output: "1.02 KB" -->\n\n    <p>{{ 2 * 1024 * 1024 | byteConverter }}</p>\n    <!-- Output: "2 MB" -->\n\n    <p>{{ 3 * 1024 * 1024 * 1024 | byteConverter }}</p>\n    <!-- Output: "3 GB" -->\n\n    <p>{{ 2.89 * 1024 * 1024 * 1024 * 1024 | byteConverter }}</p>\n    <!-- Output: "2.89 TB" -->\n  `,\n})\nexport class UnitConversionsExampleComponent {}',
  );

  signatureCode = highlight(`transform(value?: number | null, locale?: string): string | null;`);
}
