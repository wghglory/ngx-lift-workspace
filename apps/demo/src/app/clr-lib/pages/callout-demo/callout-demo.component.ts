import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe} from 'clr-lift';

import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-callout-demo',
  imports: [CalloutComponent, PageContainerComponent, DemoPlaygroundComponent, ClarityModule, TranslatePipe],
  templateUrl: './callout-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutDemoComponent {
  basicCalloutCode = highlight(`
import {CalloutComponent} from 'clr-lift';

@Component({
  imports: [CalloutComponent],
  template: \`
    <cll-callout>
      <p class="font-medium" cds-layout="m-t:none">Please note that all configuration changes take effect immediately.</p>
    </cll-callout>
  \`
})
export class CalloutExampleComponent {}
  `);

  listAndLinksCode = highlight(`
import {CalloutComponent} from 'clr-lift';

@Component({
  imports: [CalloutComponent],
  template: \`
    <cll-callout>
      <ul class="list" cds-layout="vertical gap:xs">
        <li>Supports both <strong>light</strong> and <strong>dark</strong> themes automatically.</li>
        <li>
          For more details, check out the
          <a href="https://clarity.design" target="_blank" rel="noopener noreferrer">Clarity Design System documentation</a>.
        </li>
      </ul>
    </cll-callout>
  \`
})
export class CalloutListExampleComponent {}
  `);

  richContentCode = highlight(`
import {CalloutComponent} from 'clr-lift';
import {ClrIconModule} from '@clr/angular';

@Component({
  imports: [CalloutComponent, ClrIconModule],
  template: \`
    <cll-callout>
      <div cds-layout="vertical gap:xs">
        <h4 class="font-semibold text-base" cds-layout="m-t:none">Pro Tip for Production Deployments</h4>
        <p>Ensure resource limits are explicitly configured before triggering the rollout process.</p>
        <div cds-layout="horizontal gap:xs align:center m-t:xs">
          <span class="label label-info">Deployment</span>
          <span class="label label-success">Validated</span>
        </div>
      </div>
    </cll-callout>
  \`
})
export class CalloutRichExampleComponent {}
  `);
}
