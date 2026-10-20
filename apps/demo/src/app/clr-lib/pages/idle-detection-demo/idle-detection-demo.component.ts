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
  styleUrl: './idle-detection-demo.component.scss',
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

  basicUsageCode = highlight(
    "import {ChangeDetectionStrategy, Component, signal} from '@angular/core';\nimport {IdleDetectionComponent} from 'clr-lift';\n\n@Component({\n  selector: 'app-idle-example',\n  imports: [IdleDetectionComponent],\n  templateUrl: './idle-example.html',\n  changeDetection: ChangeDetectionStrategy.OnPush,\n})\nexport class IdleExampleComponent {\n  readonly isMonitoring = signal(false);\n\n  readonly timeoutCount = signal(0);\n\n  readonly sessionStatus = signal<'Active' | 'Timeout Triggered'>('Active');\n\n  startSimulation() {\n    this.sessionStatus.set('Active');\n    this.isMonitoring.set(true);\n  }\n\n  stopSimulation() {\n    this.isMonitoring.set(false);\n  }\n\n  onTimeout() {\n    this.sessionStatus.set('Timeout Triggered');\n    this.timeoutCount.update((count) => count + 1);\n  }\n}\n// The demo changes status only. Connect timeout to your application session policy.\n// Activity resets the idle period; an open warning requires explicit confirmation.",
  );
  basicUsageHtml = highlight(
    '<button type="button" class="btn btn-sm" (click)="startSimulation()">Start</button>\n<button type="button" class="btn btn-sm" (click)="stopSimulation()">Stop</button>\n<output>{{ sessionStatus() }} · {{ timeoutCount() }}</output>\n@if (isMonitoring()) {\n  <cll-idle-detection [idleDurationInSeconds]="3" [timeoutDurationInSeconds]="10" (timeout)="onTimeout()" />\n}',
  );

  appConfigCode = highlight(`
import {ApplicationConfig} from '@angular/core';
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
