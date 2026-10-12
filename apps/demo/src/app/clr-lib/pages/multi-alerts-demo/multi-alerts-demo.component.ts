import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AlertContainerComponent, AlertService, PageContainerComponent, TranslatePipe} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-multi-alerts-demo',
  imports: [ApiTableComponent, AlertContainerComponent, PageContainerComponent, CodeBlockComponent, TranslatePipe],
  templateUrl: './multi-alerts-demo.component.html',
  styleUrl: './multi-alerts-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiAlertsDemoComponent implements OnInit, OnDestroy {
  readonly methods: ApiProperty[] = [
    {
      name: 'addAlert(options: Alert)',
      type: 'RequiredAlert',
      description: 'Adds a new alert with the specified options.',
    },
    {
      name: 'deleteAlert(id: symbol)',
      type: 'void',
      description: 'Deletes an alert by its ID.',
    },
    {
      name: 'clearAlerts()',
      type: 'void',
      description: 'Clears all alerts.',
    },
  ];

  readonly alertProperties: ApiProperty[] = [
    {
      name: 'content',
      type: 'string',
      required: true,
      description: 'The alert message. Safe HTML formatting is supported.',
    },
    {
      name: 'alertType',
      type: 'AlertType',
      defaultValue: "'danger'",
      description: 'The type of alert.',
    },
    {
      name: 'actions',
      type: 'readonly AlertAction[]',
      description:
        'Native buttons. Each action provides <code>label: string</code> and <code>onClick: () => void</code>.',
    },
    {
      name: 'isAppLevel',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether this is an application-level alert.',
    },
    {
      name: 'targetSelector',
      type: 'string',
      description:
        'The selector (ID, class, etc.) of a clickable element (button, link, etc.) anywhere within the alert content.',
    },
    {
      name: 'onTargetClick',
      type: '() => void',
      description:
        'Callback executed when the element matching <code>targetSelector</code> within the alert content is clicked.',
    },
  ];

  alertService = inject(AlertService);

  ngOnInit() {
    this.alertService.addAlert({
      content: 'This is a danger alert! You can delete this alert by clicking the close button.',
      alertType: 'danger',
    });
    this.alertService.addAlert({
      content: 'Warning alert! You can delete this alert by clicking the close button.',
      alertType: 'warning',
    });
    this.alertService.addAlert({
      content: 'Success alert with trailing action buttons.',
      alertType: 'success',
      actions: [
        {label: 'Details', onClick: () => alert('Details action clicked!')},
        {label: 'Dismiss', onClick: () => alert('Dismiss action clicked!')},
      ],
    });
    this.alertService.addAlert({
      content:
        'Alert with an inline button: <button type="button" class="btn btn-sm alert-action" id="click-target">Click Me</button> placed in the middle of a sentence.',
      alertType: 'info',
      targetSelector: '#click-target',
      onTargetClick: () => this.clickMe(),
    });
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }

  addAlert() {
    this.alertService.addAlert({
      content: `New standard alert added on ${new Date().toLocaleTimeString()}`,
      alertType: 'success',
    });
  }

  addAlertWithInlineButton() {
    this.alertService.addAlert({
      content:
        'New alert with an inline button: <button type="button" class="btn btn-sm alert-action" id="inline-click-target">Click Me</button> inside the message.',
      alertType: 'info',
      targetSelector: '#inline-click-target',
      onTargetClick: () => this.clickMe(),
    });
  }

  addAlertWithAction() {
    this.alertService.addAlert({
      content: 'New alert with trailing action buttons.',
      alertType: 'warning',
      actions: [{label: 'Acknowledge', onClick: () => alert('Acknowledged!')}],
    });
  }

  clearAlerts() {
    this.alertService.clearAlerts();
  }

  clickMe() {
    alert('You did it correctly!');
  }

  htmlCode = highlight(`
import {AlertContainerComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [AlertContainerComponent],
  template: \`
    <clr-main-container>
      <cll-alert-container />
      <clr-header></clr-header>
      <!-- rest of your app -->
    </clr-main-container>
  \`
})
export class AppComponent {}
  `);

  tsCode = highlight(`
import {AlertService} from 'clr-lift';
import {Component, inject} from '@angular/core';

@Component({})
export class AlertExampleComponent {
  private alertService = inject(AlertService);

  addAppLevelAlert() {
    // You can pass 'danger', 'info', 'success', 'warning' for the alertType.
    this.alertService.addAlert({
      content: 'New app-level alert added.',
      alertType: 'success',
    });
  }

  addStandardAlert() {
    this.alertService.addAlert({
      content: 'New standard alert added.',
      alertType: 'success',
      isAppLevel: false,
    });
  }

  clearAlerts() {
    this.alertService.clearAlerts();
  }
}
  `);

  advancedCode = highlight(`
import {AlertService} from 'clr-lift';
import {Component, inject} from '@angular/core';

@Component({})
export class AlertAdvancedExampleComponent {
  private alertService = inject(AlertService);

  addAlertWithInlineButton() {
    this.alertService.addAlert({
      content:
        'Alert with a button: <button type="button" class="btn btn-sm alert-action" id="click-target">Click Me</button> in the middle of a sentence.',
      alertType: 'info',
      targetSelector: '#click-target',
      onTargetClick: () => this.clickMe(),
    });
  }

  addAlertWithAction() {
    this.alertService.addAlert({
      content: 'Alert with trailing action button.',
      alertType: 'info',
      actions: [{label: 'Click Me', onClick: () => this.clickMe()}],
    });
  }

  clickMe() {
    alert('You did it correctly!');
  }
}
  `);
}
