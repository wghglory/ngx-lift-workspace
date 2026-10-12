import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent, TooltipModule, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-alert-demo',
  imports: [
    AlertComponent,
    PageContainerComponent,
    TooltipModule,
    ClarityModule,
    DemoPlaygroundComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './alert-demo.component.html',
  styleUrl: './alert-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDemoComponent {
  private translationService = inject(TranslationService);

  error = new HttpErrorResponse({
    error: {message: 'angular http error response'},
  });

  alertInputs = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'alertType',
        type: `'info' | 'warning' | 'success' | 'danger' | 'neutral' | 'loading' | 'unknown'`,
        defaultValue: `'danger'`,
        description: this.translationService.translate('alert.inputAlertType'),
      },
      {
        name: 'isAppLevel',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('alert.inputIsAppLevel'),
      },
      {
        name: 'isSmall',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('alert.inputIsSmall'),
      },
      {
        name: 'isLightweight',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('alert.inputIsLightweight'),
      },
      {
        name: 'error',
        type: 'HttpErrorResponse | Error | null',
        defaultValue: 'null',
        description: this.translationService.translate('alert.inputError'),
      },
      {
        name: 'content',
        type: 'string',
        defaultValue: `''`,
        description: this.translationService.translate('alert.inputContent'),
      },
    ];
  });

  standardApiErrorCode = highlight(`
import {AlertComponent} from 'clr-lift';

@Component({
  imports: [AlertComponent],
  template: \`
    <!-- error is instance of HttpErrorResponse -->
    <cll-alert [error]="error" />
  \`
})
export class AlertExampleComponent {
  error = new HttpErrorResponse({
    error: {message: 'Error message'},
  });
}
  `);

  standardContentCode = highlight(`
import {AlertComponent} from 'clr-lift';

@Component({
  imports: [AlertComponent],
  template: \`
    <cll-alert alertType="success" content="I'm a successful content" />
    <cll-alert alertType="info" content="I'm a info content" />
    <cll-alert alertType="warning" content="I'm a warning content" />
    <cll-alert alertType="danger" content="I'm a danger content" />

    <!-- Pass HTML tags -->
    <cll-alert alertType="info" [content]="'<strong>Hello world</strong>, I like clr-lift!'" />
  \`
})
export class AlertContentExampleComponent { }
  `);

  standardProjectionCode = highlight(`
import {AlertComponent} from 'clr-lift';

@Component({
  imports: [AlertComponent],
  template: \`
    <cll-alert>
      <p cds-layout="m-t:none m-b:xs">Multiple errors are listed as below by <strong>content projection</strong>.</p>
      <ol class="list">
        <li>Cannot read undefined.</li>
        <li>
          Cannot upload a object.
          <button
            [cllTooltip]="'server is down'"
            [cllTooltipPosition]="'tooltip-right'"
            class="btn btn-sm btn-link btn-icon"
            cds-layout="m-y:none p-x:none"
            aria-label="info"
            type="button"
          >
            <clr-icon shape="info-circle" />
          </button>
        </li>
      </ol>
    </cll-alert>
  \`
})
export class AlertProjectionExampleComponent { }
  `);

  standardSmallAlertCode = highlight(`
import {AlertComponent} from 'clr-lift';

@Component({
  imports: [AlertComponent],
  template: \`
    <cll-alert alertType="danger" content="I'm a small alert" [isSmall]="true" />
  \`
})
export class SmallAlertExampleComponent { }
  `);

  lightweightAlertsCode = highlight(`
import {AlertComponent} from 'clr-lift';

@Component({
  imports: [AlertComponent],
  template: \`
    <cll-alert [isLightweight]="true" [error]="error" />
    <cll-alert [isLightweight]="true" alertType="success" content="I'm a successful content" />
    <cll-alert [isLightweight]="true" alertType="info" content="I'm a info content" />
    <cll-alert [isLightweight]="true" alertType="warning" content="I'm a warning content" />
    <cll-alert [isLightweight]="true" alertType="neutral" content="I'm a neutral content" />
    <cll-alert [isLightweight]="true" alertType="loading" content="I'm a loading content" />
    <cll-alert [isLightweight]="true" alertType="unknown" content="I'm a unknown content" />
  \`
})
export class LightweightAlertExampleComponent { }
  `);

  appLevelAlertsCode = highlight(`
import {AlertComponent} from 'clr-lift';

@Component({
  imports: [AlertComponent],
  template: \`
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
  \`
})
export class AppLevelAlertExampleComponent { }
  `);
}
