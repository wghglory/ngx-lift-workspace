import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent, StatusConditionsGridComponent} from 'clr-lift';
import {KubernetesObjectCondition} from 'ngx-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-status-conditions-grid-demo',
  imports: [CodeBlockComponent, PageContainerComponent, StatusConditionsGridComponent],
  templateUrl: './status-conditions-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusConditionsGridDemoComponent {
  sampleConditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'True',
      reason: 'PodReady',
      message: 'Pod is ready to serve network traffic.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      observedGeneration: 4,
    },
    {
      type: 'ContainersReady',
      status: 'True',
      reason: 'ContainersReady',
      message: 'All containers have completed initialization and readiness probes passed.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      observedGeneration: 4,
    },
    {
      type: 'PodScheduled',
      status: 'True',
      reason: 'PodScheduled',
      message: 'Successfully assigned to worker-node-us-west-2a.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      observedGeneration: 4,
    },
    {
      type: 'Initialized',
      status: 'True',
      reason: 'PodInitialized',
      message: 'All init containers completed successfully.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      observedGeneration: 4,
    },
  ];

  emptyConditions: KubernetesObjectCondition[] = [];

  basicExampleCode = highlight(`
import {StatusConditionsGridComponent} from 'clr-lift';
import {Component} from '@angular/core';
import {KubernetesObjectCondition} from 'ngx-lift';

@Component({
  imports: [StatusConditionsGridComponent],
  template: \`
    <cll-status-conditions-grid
      [conditions]="conditions"
      exportFileName="my-database-cluster"
    />
  \`
})
export class StatusConditionsGridExampleComponent {
  conditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'True',
      reason: 'PodReady',
      message: 'Pod is ready to serve network traffic.',
      lastTransitionTime: '2026-10-10T08:00:00Z',
      observedGeneration: 4,
    }
  ];
}
  `);
}
