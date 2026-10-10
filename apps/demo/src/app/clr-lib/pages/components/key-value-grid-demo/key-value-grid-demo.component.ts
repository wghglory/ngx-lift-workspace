import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {KeyValueGridComponent, KeyValueItemComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-key-value-grid-demo',
  imports: [
    ClarityModule,
    FormsModule,
    KeyValueGridComponent,
    KeyValueItemComponent,
    PageContainerComponent,
    CodeBlockComponent,
  ],
  templateUrl: './key-value-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueGridDemoComponent {
  selectedGap = signal('1.5rem');

  basicExampleCode = highlight(`
import {KeyValueGridComponent, KeyValueItemComponent} from 'clr-lift';

@Component({
  imports: [KeyValueGridComponent, KeyValueItemComponent],
  template: \`
    <cll-key-value-grid gap="1.5rem">
      <cll-key-value-item key="Cluster Name" value="k8s-prod-cluster-01" />
      <cll-key-value-item key="Region" value="us-west-2" />
      <cll-key-value-item key="Kubernetes Version" value="v1.31.2" />
      <cll-key-value-item key="Node Count" [value]="12" />
      <cll-key-value-item key="Storage Class" value="vsan-default" />
      <cll-key-value-item key="Status">
        <span value class="badge badge-success">Healthy</span>
      </cll-key-value-item>
    </cll-key-value-grid>
  \`
})
export class ClusterDetailsComponent {}
  `);

  fixedColumnsCode = highlight(`
<!-- Fixed 2-column grid layout -->
<cll-key-value-grid [columns]="2" gap="1rem">
  <cll-key-value-item key="IP Address" value="192.168.1.100" />
  <cll-key-value-item key="Subnet Mask" value="255.255.255.0" />
  <cll-key-value-item key="Default Gateway" value="192.168.1.1" />
  <cll-key-value-item key="DNS Servers" value="8.8.8.8, 1.1.1.1" />
</cll-key-value-grid>
  `);
}
