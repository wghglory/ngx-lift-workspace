import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AlertContainerComponent, AlertService, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-multi-alerts-demo',
  standalone: true,
  imports: [AlertContainerComponent, PageContainerComponent, CodeBlockComponent],
  templateUrl: './multi-alerts-demo.component.html',
  styleUrl: './multi-alerts-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiAlertsDemoComponent implements OnInit, OnDestroy {
  alertService = inject(AlertService);

  ngOnInit() {
    this.alertService.addAlert({
      content: 'This is a danger alert! You can delete this alert by clicking the close button.',
    });
    this.alertService.addAlert({
      content: 'warning alert! You can delete this alert by clicking the close button.',
      alertType: 'warning',
    });
    this.alertService.addAlert({
      content: 'I am an info alert. You can delete this alert by clicking the close button.',
      alertType: 'info',
    });
    this.alertService.addAlert({
      content:
        'Alert with a button. <button type="button" class="btn btn-sm btn-outline" id="click-target">Click Me</button>',
      alertType: 'info',
      targetSelector: '#click-target',
      onTargetClick: this.clickMe,
    });
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }

  addAlert() {
    this.alertService.addAlert({content: `New alert added on ${new Date()}`, alertType: 'success'});
  }

  clearAlerts() {
    this.alertService.clearAlerts();
  }

  clickMe() {
    alert('You did it correctly!');
  }

  htmlCode = highlight(`
<clr-main-container>
  <cll-alert-container />
  <clr-header></clr-header>
</clr-main-container>
  `);

  tsCode = highlight(`
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
  `);

  advancedCode = highlight(`
this.alertService.addAlert({
  content: 'Alert with a button. <button type="button" class="btn btn-sm btn-outline" id="click-target">Click Me</button>',
  alertType: 'info',
  targetSelector: '#click-target',
  onTargetClick: this.clickMe,
});

clickMe() {
  alert('You did it correctly!');
}
  `);
}
