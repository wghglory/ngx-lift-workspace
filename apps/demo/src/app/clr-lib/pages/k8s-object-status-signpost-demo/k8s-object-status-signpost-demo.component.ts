import {ChangeDetectionStrategy, Component} from '@angular/core';
import {K8sObjectStatusSignpostComponent, PageContainerComponent} from 'clr-lift';
import {KubernetesObjectCondition} from 'ngx-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-k8s-object-status-signpost-demo',
  imports: [CodeBlockComponent, K8sObjectStatusSignpostComponent, PageContainerComponent],
  templateUrl: './k8s-object-status-signpost-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class K8sObjectStatusSignpostDemoComponent {
  readyConditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'True',
      reason: 'Ready',
      message: 'Resource is operating normally.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  failedConditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'False',
      reason: 'Failed',
      message: 'Node network attachment timed out.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ];

  upgradingConditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'False',
      reason: 'Upgrading',
      message: 'Rolling update in progress on node 2 of 3.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ];

  degradedConditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'False',
      reason: 'Degraded',
      message: 'High replica replication lag detected.',
      lastTransitionTime: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ];

  basicExampleCode = highlight(`
import {K8sObjectStatusSignpostComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [K8sObjectStatusSignpostComponent],
  template: \`
    <!-- Ready / Success Status -->
    <cll-k8s-object-status-signpost
      [conditions]="readyConditions"
      resourceName="production-redis"
      [bold]="true"
    />

    <!-- Failed / Error Status -->
    <cll-k8s-object-status-signpost
      [conditions]="failedConditions"
      resourceName="production-redis"
    />
  \`
})
export class StatusSignpostExampleComponent {}
  `);
}
