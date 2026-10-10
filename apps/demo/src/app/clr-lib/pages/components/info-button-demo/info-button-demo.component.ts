import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {InfoButtonComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-info-button-demo',
  imports: [ClarityModule, FormsModule, InfoButtonComponent, PageContainerComponent, CodeBlockComponent],
  templateUrl: './info-button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoButtonDemoComponent {
  actionCount = signal(0);

  onTriggerAction() {
    this.actionCount.update((count) => count + 1);
  }

  basicExampleCode = highlight(`
import {InfoButtonComponent} from 'clr-lift';

@Component({
  imports: [InfoButtonComponent],
  template: \`
    <cll-info-button
      text="Trigger Maintenance Task"
      (clicked)="onTriggerAction()"
    />
  \`
})
export class MaintenanceComponent {
  onTriggerAction() {
    console.log('Task started');
  }
}
  `);

  routerExampleCode = highlight(`
<cll-info-button
  text="Inspect Cluster Settings"
  [link]="['/clr-lift', 'components', 'alert']"
  [queryParams]="{ tab: 'overview' }"
/>
  `);

  disabledTooltipCode = highlight(`
<cll-info-button
  text="Scale Down Replicas"
  [disabled]="true"
  tooltipText="Scaling down is disabled while maintenance mode is active."
/>
  `);
}
