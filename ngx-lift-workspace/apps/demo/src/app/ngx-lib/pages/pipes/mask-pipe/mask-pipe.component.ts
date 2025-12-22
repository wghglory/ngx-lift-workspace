import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';
import {MaskOptions, MaskPipe} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-mask-pipe',
  standalone: true,
  imports: [CodeBlockComponent, PageContainerComponent, MaskPipe],
  templateUrl: './mask-pipe.component.html',
  styleUrl: './mask-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskPipeComponent {
  simpleCode = highlight(`
<p>{{ 'sensitive-string-to-mask' | mask }}</p>
<!-- Output: sensit************o-mask -->
  `);

  customCode = highlight(`
<p>{{ 'sensitive-string-to-mask' | mask: {unmaskedPrefixLength: 2, unmaskedSuffixLength: 3} }}</p>
<!-- Output: se*******************ask -->
    `);

  maskOptions: MaskOptions = {
    unmaskedPrefixLength: 2,
    unmaskedSuffixLength: 3,
  };
}
