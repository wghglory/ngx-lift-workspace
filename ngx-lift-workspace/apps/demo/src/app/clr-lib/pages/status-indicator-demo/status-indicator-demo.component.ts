import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent, StatusIndicatorComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-status-indicator-demo',
  imports: [CodeBlockComponent, PageContainerComponent, StatusIndicatorComponent],
  templateUrl: './status-indicator-demo.component.html',
  styleUrl: './status-indicator-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorDemoComponent {
  basicExampleCode = highlight(`
import {StatusIndicatorComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [StatusIndicatorComponent],
  template: \`
    <cll-status-indicator [iconStatus]="'error'" [iconSize]="'sm'"> Error </cll-status-indicator>
    <cll-status-indicator [iconStatus]="'success'" [iconSize]="24"> Success </cll-status-indicator>
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
