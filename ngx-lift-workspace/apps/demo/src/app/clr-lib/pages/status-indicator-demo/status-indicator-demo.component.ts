import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent, StatusIndicatorComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-status-indicator-demo',
  standalone: true,
  imports: [CodeBlockComponent, PageContainerComponent, StatusIndicatorComponent],
  templateUrl: './status-indicator-demo.component.html',
  styleUrl: './status-indicator-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorDemoComponent {
  exampleCode = highlight(`
import {StatusIndicatorComponent} from 'clr-lift';

<cll-status-indicator [iconStatus]="'error'" [iconSize]="'sm'"> Error </cll-status-indicator>
<cll-status-indicator [iconStatus]="'success'" [iconSize]="24"> Success </cll-status-indicator>

<li>
  <cll-status-indicator
    [iconStatus]="'pending'"
    [tooltip]="'some pending happen'"
    [tooltipPosition]="'tooltip-left'"
  >
    Pending
  </cll-status-indicator>
</li>
  `);
}
