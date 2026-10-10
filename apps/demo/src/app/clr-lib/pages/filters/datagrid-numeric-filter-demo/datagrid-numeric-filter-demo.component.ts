import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {DatagridCustomNumericFilter, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

interface NodeCluster {
  id: string;
  name: string;
  spec: {
    resources: {
      cpu: number;
      memoryGb: number;
    };
  };
  nodeCount: number;
}

@Component({
  selector: 'app-datagrid-numeric-filter-demo',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent],
  templateUrl: './datagrid-numeric-filter-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridNumericFilterDemoComponent {
  readonly cpuFilter = new DatagridCustomNumericFilter<NodeCluster>('spec.resources.cpu');
  readonly memoryFilter = new DatagridCustomNumericFilter<NodeCluster>('spec.resources.memoryGb');
  readonly nodeCountFilter = new DatagridCustomNumericFilter<NodeCluster>('nodeCount');

  clusters = signal<NodeCluster[]>([
    {
      id: 'c-1',
      name: 'analytics-prod-01',
      spec: {resources: {cpu: 32, memoryGb: 128}},
      nodeCount: 8,
    },
    {
      id: 'c-2',
      name: 'ingress-edge-01',
      spec: {resources: {cpu: 8, memoryGb: 32}},
      nodeCount: 4,
    },
    {
      id: 'c-3',
      name: 'database-primary-01',
      spec: {resources: {cpu: 64, memoryGb: 256}},
      nodeCount: 12,
    },
    {
      id: 'c-4',
      name: 'dev-sandbox-01',
      spec: {resources: {cpu: 4, memoryGb: 16}},
      nodeCount: 2,
    },
    {
      id: 'c-5',
      name: 'ml-training-gpu-01',
      spec: {resources: {cpu: 128, memoryGb: 512}},
      nodeCount: 16,
    },
  ]);

  exampleCode = highlight(`
import {DatagridCustomNumericFilter} from 'clr-lift';

export class ClusterListComponent {
  // Supports deep dot-notation paths
  readonly cpuFilter = new DatagridCustomNumericFilter<NodeCluster>('spec.resources.cpu');
  readonly memoryFilter = new DatagridCustomNumericFilter<NodeCluster>('spec.resources.memoryGb');
}
  `);

  htmlCode = highlight(`
<clr-datagrid>
  <clr-dg-column [clrDgField]="'spec.resources.cpu'">
    CPU (Cores)
    <clr-dg-numeric-filter [clrDgNumericFilter]="cpuFilter" />
  </clr-dg-column>

  <clr-dg-column [clrDgField]="'spec.resources.memoryGb'">
    Memory (GB)
    <clr-dg-numeric-filter [clrDgNumericFilter]="memoryFilter" />
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let cluster of clusters()">
    <clr-dg-cell>{{ cluster.name }}</clr-dg-cell>
    <clr-dg-cell>{{ cluster.spec.resources.cpu }}</clr-dg-cell>
    <clr-dg-cell>{{ cluster.spec.resources.memoryGb }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
  `);
}
