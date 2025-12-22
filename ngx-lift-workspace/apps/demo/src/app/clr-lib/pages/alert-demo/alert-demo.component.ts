import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent, TooltipModule} from 'clr-lift';

import {highlight} from '../../../shared/utils/highlight.util';
import {CodeBlockComponent} from './../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [AlertComponent, PageContainerComponent, TooltipModule, CodeBlockComponent, ClarityModule],
  templateUrl: './alert-demo.component.html',
  styleUrl: './alert-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDemoComponent {
  error = new HttpErrorResponse({
    error: {message: 'angular http error response'},
  });

  standardApiErrorCode = highlight(`
<!-- error is instance of HttpErrorResponse -->
<cll-alert [error]="error" />
  `);

  standardContentCode = highlight(`
<cll-alert alertType="success" content="I'm a successful content" />
<cll-alert alertType="info" content="I'm a info content" />
<cll-alert alertType="warning" content="I'm a warning content" />
<cll-alert alertType="danger" content="I'm a danger content" />

<!-- Pass HTML tags -->
<cll-alert alertType="info" [content]="'<strong>Hello world</strong>, I like clr-lift!'" />
  `);

  standardProjectionCode = highlight(`
<cll-alert>
  <p class="!mt-0 !mb-2">Multiple errors are listed as below by <strong>content projection</strong>.</p>
  <ol class="list-decimal">
    <li>Cannot read undefined.</li>
    <li>
      Cannot upload a object.
      <button
        [cllTooltip]="'server is down'"
        [cllTooltipPosition]="'tooltip-right'"
        class="btn btn-sm btn-link btn-icon !my-0 !px-0"
        aria-label="info"
        type="button"
      >
        <cds-icon shape="info-circle" />
      </button>
    </li>
  </ol>
</cll-alert>
  `);

  standardSmallAlertCode = highlight(`
<cll-alert alertType="danger" content="I'm a small alert" [isSmall]="true" />
  `);

  lightweightAlertsCode = highlight(`
<cll-alert [isLightweight]="true" [error]="error" />
<cll-alert [isLightweight]="true" alertType="success" content="I'm a successful content" />
<cll-alert [isLightweight]="true" alertType="info" content="I'm a info content" />
<cll-alert [isLightweight]="true" alertType="warning" content="I'm a warning content" />
<cll-alert [isLightweight]="true" alertType="neutral" content="I'm a neutral content" />
<cll-alert [isLightweight]="true" alertType="loading" content="I'm a loading content" />
<cll-alert [isLightweight]="true" alertType="unknown" content="I'm a unknown content" />
  `);

  appLevelAlertsCode = highlight(`
<cll-alert [error]="error" [isAppLevel]="true" />
<cll-alert
  alertType="success"
  content="I'm a successful content <a href='javascript:void(0)' class='btn btn-outline btn-sm'>View</a>"
  [isAppLevel]="true"
/>
<cll-alert alertType="success" [isAppLevel]="true">
  I'm a successful content injected by content projection &nbsp;
  <a href="javascript:void(0)" class="btn btn-inverse btn-sm">View</a>
</cll-alert>
<cll-alert alertType="info" content="I'm a info content" [isAppLevel]="true" />
<cll-alert alertType="warning" content="I'm a warning content" [isAppLevel]="true" />
    `);
}
