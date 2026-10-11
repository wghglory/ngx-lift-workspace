import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, StatusIndicatorComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-status-indicator-demo',
  imports: [ApiTableComponent, CodeBlockComponent, PageContainerComponent, StatusIndicatorComponent, TranslatePipe],
  templateUrl: './status-indicator-demo.component.html',
  styleUrl: './status-indicator-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorDemoComponent {
  private translationService = inject(TranslationService);

  readonly inputs = computed<ApiProperty[]>(() => [
    {
      name: 'iconStatus',
      type: "'error' | 'success' | 'warning' | 'unknown' | 'inactive' | 'pending'",
      required: true,
      description: this.translationService.translate('statusIndicator.inputIconStatus'),
    },
    {
      name: 'iconSize',
      type: "'sm' | 'md' | 'lg' | number",
      defaultValue: "'md'",
      description: this.translationService.translate('statusIndicator.inputIconSize'),
    },
    {
      name: 'tooltip',
      type: 'string',
      description: this.translationService.translate('statusIndicator.inputTooltip'),
    },
    {
      name: 'tooltipPosition',
      type: 'string',
      defaultValue: "'tooltip-top-right'",
      description: this.translationService.translate('statusIndicator.inputTooltipPosition'),
    },
  ]);
  basicExampleCode = highlight(`
import {StatusIndicatorComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [StatusIndicatorComponent],
  template: \`
    <cll-status-indicator [iconStatus]="'error'" [iconSize]="'sm'"> Error </cll-status-indicator>
    <cll-status-indicator [iconStatus]="'success'" [iconSize]="'24'"> Success </cll-status-indicator>
    <cll-status-indicator [iconStatus]="'warning'"> Warning </cll-status-indicator>
  \`
})
export class StatusIndicatorExampleComponent {}
  `);

  tooltipExampleCode = highlight(`
import {StatusIndicatorComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [StatusIndicatorComponent],
  template: \`
    <cll-status-indicator
      [iconStatus]="'pending'"
      [tooltip]="'some pending happen'"
      [tooltipPosition]="'tooltip-left'"
    >
      Pending
    </cll-status-indicator>
  \`
})
export class StatusIndicatorTooltipExampleComponent {}
  `);
}
