import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {MaskOptions} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-mask-pipe',
  imports: [CodeBlockComponent, PageContainerComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './mask-pipe.component.html',
  styleUrl: './mask-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskPipeComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: 'string',
        description: this.translationService.translate('maskPipe.paramValue'),
      },
      {
        name: 'options',
        type: 'MaskOptions',
        default: '{}',
        description: this.translationService.translate('maskPipe.paramOptions'),
      },
    ];
  });

  maskOptionsProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'unmaskedPrefixLength',
        type: 'number',
        default: '6',
        description: this.translationService.translate('maskPipe.optUnmaskedPrefixLength'),
      },
      {
        name: 'unmaskedSuffixLength',
        type: 'number',
        default: '6',
        description: this.translationService.translate('maskPipe.optUnmaskedSuffixLength'),
      },
      {
        name: 'maskChar',
        type: 'string',
        default: "'*'",
        description: this.translationService.translate('maskPipe.optMaskChar'),
      },
      {
        name: 'enabled',
        type: 'boolean',
        default: 'true',
        description: this.translationService.translate('maskPipe.optEnabled'),
      },
    ];
  });
  basicExampleCode = highlight(`
import {MaskPipe} from 'ngx-lift';

@Component({
  imports: [MaskPipe],
  template: \`
    <p>{{ 'sensitive-string-to-mask' | mask }}</p>
    <!-- Output: sensit************o-mask -->
  \`
})
export class MaskExampleComponent {}
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

  signatureCode = highlight(`
transform(value: string, options?: MaskOptions): string
  `);

  maskOptions: MaskOptions = {
    unmaskedPrefixLength: 2,
    unmaskedSuffixLength: 3,
  };
}
