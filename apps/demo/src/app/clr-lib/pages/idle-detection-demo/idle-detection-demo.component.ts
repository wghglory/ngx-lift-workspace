import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {
  CalloutComponent,
  IdleDetectionComponent,
  PageContainerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-clr-idle-detection-demo',
  imports: [
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    IdleDetectionComponent,
    ClarityModule,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './idle-detection-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrIdleDetectionDemoComponent {
  private translationService = inject(TranslationService);

  readonly isMonitoring = signal(false);
  readonly timeoutCount = signal(0);
  readonly sessionStatus = signal<'Active' | 'Timeout Triggered'>('Active');

  idleInputs = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'idleDurationInSeconds',
        type: 'number',
        description: this.translationService.translate('idleDetection.inputIdleDuration'),
      },
      {
        name: 'timeoutDurationInSeconds',
        type: 'number',
        description: this.translationService.translate('idleDetection.inputTimeoutDuration'),
      },
    ];
  });

  idleOutputs = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'timeout',
        type: 'EventEmitter<void>',
        description: this.translationService.translate('idleDetection.outputTimeout'),
      },
    ];
  });

  startSimulation() {
    this.sessionStatus.set('Active');
    this.isMonitoring.set(true);
  }

  stopSimulation() {
    this.isMonitoring.set(false);
  }

  onTimeout() {
    this.sessionStatus.set('Timeout Triggered');
    this.timeoutCount.update((count) => count + 1);
  }

  basicUsageCode = highlight(`
import {IdleDetectionComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [IdleDetectionComponent],
  template: \`
    <!-- Pop up countdown modal after 15 minutes of inactivity; timeout after 60 seconds -->
    <cll-idle-detection
      [idleDurationInSeconds]="15 * 60"
      [timeoutDurationInSeconds]="60"
      (timeout)="onSessionTimeout()"
    />
  \`
})
export class AppComponent {
  onSessionTimeout() {
    // Clear tokens and redirect to login
    localStorage.removeItem('auth_token');
    window.location.assign('/login');
  }
}
  `);

  appConfigCode = highlight(`
import {provideIdleDetectionConfig} from 'ngx-lift';

// Optionally define global default durations at the application level:
export const appConfig: ApplicationConfig = {
  providers: [
    provideIdleDetectionConfig({
      idleDurationInSeconds: 20 * 60,
      timeoutDurationInSeconds: 2 * 60,
    }),
  ],
};
  `);
}
