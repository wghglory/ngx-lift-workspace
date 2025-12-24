import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';
import {MaskOptions} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-mask-pipe',
  imports: [CodeBlockComponent, PageContainerComponent],
  templateUrl: './mask-pipe.component.html',
  styleUrl: './mask-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskPipeComponent {
  importCode = highlight(`import { MaskPipe } from 'ngx-lift';`);

  simpleCode = highlight(`
import {MaskPipe} from 'ngx-lift';

@Component({
  imports: [MaskPipe],
  template: \`
    <p>{{ 'sensitive-string-to-mask' | mask }}</p>
    <!-- Output: sensit************o-mask -->
  \`
})
  `);

  customCode = highlight(`
import {MaskPipe} from 'ngx-lift';

@Component({
  imports: [MaskPipe],
  template: \`
    <p>{{ 'sensitive-string-to-mask' | mask: {unmaskedPrefixLength: 2, unmaskedSuffixLength: 3} }}</p>
    <!-- Output: se*******************ask -->
  \`
})
    `);

  creditCardCode = highlight(`
import {MaskPipe} from 'ngx-lift';

@Component({
  imports: [MaskPipe],
  template: \`
    <p>{{ creditCardNumber | mask: {unmaskedPrefixLength: 0, unmaskedSuffixLength: 4} }}</p>
    <!-- Example: "************1234" -->
  \`
})
  `);

  toggleMaskCode = highlight(`
import {MaskPipe} from 'ngx-lift';

@Component({
  imports: [MaskPipe],
  template: \`
    <p>{{ apiKey | mask: {masked: showMask} }}</p>
    <!-- Toggle showMask to reveal/hide -->
  \`
})
  `);

  maskOptions: MaskOptions = {
    unmaskedPrefixLength: 2,
    unmaskedSuffixLength: 3,
  };
}
