import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {RouterLink} from '@angular/router';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-spinner',
  imports: [
    DemoPlaygroundComponent,
    RouterLink,
    ApiTableComponent,
    SpinnerComponent,
    PageContainerComponent,
    CodeBlockComponent,
    TranslatePipe,
  ],
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
        name: 'decorative',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('spinner.inputDecorative'),
      },
      {
        name: 'label',
        type: 'string',
        description: this.translationService.translate('spinner.inputLabel'),
      },
      {
        name: 'class',
        type: 'string',
        description: this.translationService.translate('spinner.inputCustomClass'),
      },
    ];
  });
  readonly setupCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SpinnerComponent} from 'clr-lift';

@Component({
  selector: 'app-loading',
  imports: [SpinnerComponent],
  templateUrl: './loading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
// Standalone spinner: decorative=false exposes label to assistive technology.
// Beside visible loading text, leave decorative=true to avoid duplicate announcements.
// Import the Clarity global stylesheet; see the setup link above.`);
  defaultCode = highlight(`
<cll-spinner [decorative]="false" label="Loading..." />
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
<cll-spinner [center]="false" [class]="'demo-spinner-space'" />
  `);

  inlineCode = highlight(`
<div>
  <cll-spinner inline />
  <span>Loading...</span>
</div>
  `);
}
