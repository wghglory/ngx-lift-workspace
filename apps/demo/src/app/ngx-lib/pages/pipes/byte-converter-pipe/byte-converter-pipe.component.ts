import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-byte-converter-pipe',
  imports: [CodeBlockComponent, PageContainerComponent, CalloutComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './byte-converter-pipe.component.html',
  styleUrl: './byte-converter-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByteConverterPipeComponent {
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
    ];
  });
  basicExampleCode = highlight(`
import {ByteConverterPipe} from 'ngx-lift';

@Component({
  imports: [ByteConverterPipe],
  template: \`
    <p>{{ 104.89 | byteConverter }}</p>
    <!-- Output: "104.89 B" -->

    <p>{{ 1044.89 | byteConverter }}</p>
    <!-- Output: "1.02 KB" -->
  \`
})
export class ByteConverterExampleComponent {}
  `);

  fileSizeDisplayCode = highlight(`
import {ByteConverterPipe} from 'ngx-lift';

@Component({
  imports: [ByteConverterPipe],
  template: \`
    <p>File size: {{ fileSizeInBytes | byteConverter }}</p>
    <!-- Example: "File size: 1.02 KB" -->
  \`
})
export class FileSizeExampleComponent {
  fileSizeInBytes = 1044.89;
}
  `);

  unitConversionsCode = highlight(`
import {ByteConverterPipe} from 'ngx-lift';

@Component({
  imports: [ByteConverterPipe],
  template: \`
    <p>{{ 104.89 | byteConverter }}</p>
    <!-- Output: "104.89 B" -->

    <p>{{ 1044.89 | byteConverter }}</p>
    <!-- Output: "1.02 KB" -->

    <p>{{ 2 * 1024 * 1024 | byteConverter }}</p>
    <!-- Output: "2 MB" -->

    <p>{{ 3 * 1024 * 1024 * 1024 | byteConverter }}</p>
    <!-- Output: "3 GB" -->

    <p>{{ 2.89 * 1024 * 1024 * 1024 * 1024 | byteConverter }}</p>
    <!-- Output: "2.89 TB" -->
  \`
})
export class UnitConversionsExampleComponent {}
  `);

  signatureCode = highlight(`
transform(value?: number | null): string | null
  `);
}
