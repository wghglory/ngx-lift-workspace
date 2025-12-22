import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {ByteConverterPipe} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-byte-converter-pipe',
  standalone: true,
  imports: [CodeBlockComponent, CalloutComponent, PageContainerComponent, ByteConverterPipe],
  templateUrl: './byte-converter-pipe.component.html',
  styleUrl: './byte-converter-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByteConverterPipeComponent {
  exampleCode = highlight(`
import {ByteConverterPipe} from 'ngx-lift';

@Component({
  standalone: true,
  imports: [ByteConverterPipe],
  template: \`
    <p>{{ 104.89 | byteConverter }}</p>
    <!-- Input fileSize: 104.89 bytes, Output: "104.89 B" -->

    <p>{{ 1044.89 | byteConverter }}</p>
    <!-- Input fileSize: 1044.89 bytes, Output: "1.02 KB" -->

    <p>{{ 2 * 1024 * 1024 | byteConverter }}</p>
    <!-- Input fileSize: 2 * 1024 * 1024 bytes, Output: "2 MB" -->

    <p>{{ 2.89 * 1024 * 1024 * 1024 * 1024 | byteConverter }}</p>
    <!-- Input fileSize: 2.89 * 1024 * 1024 * 1024 * 1024 bytes, Output: "2.89 TB" -->
  \`
})
export class ByteConverterPipeDemoComponent { }
  `);
}
