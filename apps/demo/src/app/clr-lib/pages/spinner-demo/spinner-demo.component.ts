import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-spinner',
  imports: [ApiTableComponent, SpinnerComponent, PageContainerComponent, CodeBlockComponent, TranslatePipe],
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDemoComponent {
  private translationService = inject(TranslationService);

  inputs = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'size',
        type: "'lg' | 'md' | 'sm'",
        defaultValue: "'lg'",
        description: this.translationService.translate('spinner.inputSize'),
      },
      {
        name: 'center',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('spinner.inputCenter'),
      },
      {
        name: 'inline',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('spinner.inputInline'),
      },
      {
        name: 'customClass',
        type: 'string',
        description: this.translationService.translate('spinner.inputCustomClass'),
      },
    ];
  });
  defaultCode = highlight(`
<cll-spinner />
  `);

  sizeVariationsCode = highlight(`
<!-- Large (default) -->
<cll-spinner />

<!-- Medium -->
<cll-spinner [size]="'md'" />

<!-- Small -->
<cll-spinner [size]="'sm'" />
  `);

  alignLeftCode = highlight(`
<cll-spinner [center]="false" />
  `);

  customClassCode = highlight(`
<cll-spinner [center]="false" [class]="'mx-10'" />
  `);

  inlineCode = highlight(`
<div>
  <cll-spinner inline [class]="'mx-2'" />
  <span>Loading...</span>
</div>
  `);
}
