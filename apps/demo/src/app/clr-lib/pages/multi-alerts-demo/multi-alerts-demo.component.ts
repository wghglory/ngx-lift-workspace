import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, computed} from '@angular/core';
import {
  AlertContainerComponent,
  AlertService,
  PageContainerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';

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
  private readonly translationService = inject(TranslationService);

  readonly methods = computed<ApiProperty[]>(() => [
    {
      name: 'addAlert(options: Alert)',
      type: 'RequiredAlert',
      description: this.translationService.translate('demoApi.multi-alerts-demo.methods.addAlert(options: Alert)'),
    },
    {
      name: 'deleteAlert(id: symbol)',
      type: 'void',
      description: this.translationService.translate('demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)'),
    },
    {
      name: 'clearAlerts()',
      type: 'void',
      description: this.translationService.translate('demoApi.multi-alerts-demo.methods.clearAlerts()'),
    },
  ]);

  readonly alertProperties = computed<ApiProperty[]>(() => [
    {
      name: 'content',
      type: 'string',
      required: true,
      description: this.translationService.translate('demoApi.multi-alerts-demo.alertProperties.content'),
    },
    {
      name: 'alertType',
      type: 'AlertType',
      defaultValue: "'danger'",
      description: this.translationService.translate('demoApi.multi-alerts-demo.alertProperties.alertType'),
    },
    {
      name: 'actions',
      type: 'readonly AlertAction[]',
      description: this.translationService.translate('demoApi.multi-alerts-demo.alertProperties.actions'),
    },
    {
      name: 'isAppLevel',
      type: 'boolean',
      defaultValue: 'true',
      description: this.translationService.translate('demoApi.multi-alerts-demo.alertProperties.isAppLevel'),
    },
    {
      name: 'targetSelector',
      type: 'string',
      description: this.translationService.translate('demoApi.multi-alerts-demo.alertProperties.targetSelector'),
    },
    {
      name: 'onTargetClick',
      type: '() => void',
      description: this.translationService.translate('demoApi.multi-alerts-demo.alertProperties.onTargetClick'),
    },
  ]);

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

  htmlCode = highlight(`import {AlertContainerComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [AlertContainerComponent],
  template: \`
    <clr-main-container>
      <cll-alert-container />
      <clr-header></clr-header>
      <!-- rest of your app -->
    </clr-main-container>
  \`,
})
export class AppComponent {}`);

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
