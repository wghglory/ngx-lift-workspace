import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {MaskOptions, MaskPipe} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-mask-pipe',
  imports: [MaskPipe, CodeBlockComponent, PageContainerComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './mask-pipe.component.html',
  styleUrl: './mask-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskPipeComponent {
  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MaskPipe} from 'ngx-lift';

@Component({
  selector: 'app-pipe-example',
  imports: [MaskPipe],
  template: \`<p>{{ '1234567890123456' | mask: {unmaskedPrefixLength: 4, unmaskedSuffixLength: 4} }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeExampleComponent {}
// Output: 1234********3456
// Display formatting only: the original value remains in memory. The mask character is always *. `);
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
        name: 'masked',
        type: 'boolean',
        default: 'true',
        description: this.translationService.translate('maskPipe.optEnabled'),
      },
    ];
  });
  basicExampleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {MaskPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [MaskPipe],\n  template: `\n    <p>{{ 'sensitive-string-to-mask' | mask }}</p>\n    <!-- Output: sensit************o-mask -->\n  `,\n})\nexport class MaskExampleComponent {}",
  );

  customCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {MaskPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [MaskPipe],\n  template: `\n    <p>{{ 'sensitive-string-to-mask' | mask: {unmaskedPrefixLength: 2, unmaskedSuffixLength: 3} }}</p>\n    <!-- Output: se*******************ask -->\n  `,\n})\nexport class MaskExampleComponent {}",
  );

  creditCardCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';

import {MaskPipe} from 'ngx-lift';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaskPipe],
  template: \`
    <p>{{ creditCardNumber | mask: {unmaskedPrefixLength: 0, unmaskedSuffixLength: 4} }}</p>
    <!-- Example: "************1234" -->
  \`,
})
export class MaskExampleComponent {
  readonly creditCardNumber = '1234567890121234';
}`);

  toggleMaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';

import {MaskPipe} from 'ngx-lift';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaskPipe],
  template: \`
    <p>{{ apiKey | mask: {masked: showMask} }}</p>
    <button type="button" (click)="showMask = !showMask">Toggle mask</button>
  \`,
})
export class MaskExampleComponent {
  readonly apiKey = 'public-demo-key-000001';
  showMask = true;
}`);

  signatureCode = highlight(`transform(value: string, options?: MaskOptions): string;`);

  maskOptions: MaskOptions = {
    unmaskedPrefixLength: 2,
    unmaskedSuffixLength: 3,
  };
}
