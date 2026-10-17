import {RouterLink} from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {IdleDetectionService, provideIdleDetectionService} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-idle-detection-demo',
  providers: [provideIdleDetectionService({idleDurationInSeconds: 3, timeoutDurationInSeconds: 10})],
  imports: [RouterLink, PageContainerComponent, CalloutComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './idle-detection-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleDetectionDemoComponent implements OnInit, OnDestroy {
  readonly starterCode = highlight(
    `import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, OnDestroy, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IdleDetectionService, provideIdleDetectionService} from 'ngx-lift';

@Component({
  selector: 'app-idle',
  providers: [provideIdleDetectionService({idleDurationInSeconds: 3, timeoutDurationInSeconds: 10})],
  templateUrl: './idle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);

  private readonly idleDetectionService = inject(IdleDetectionService);

  readonly phase = signal<'Stopped' | 'Active' | 'Warning' | 'Expired'>('Stopped');

  readonly countdown = signal<number | null>(null);

  readonly monitoring = signal(false);

  ngOnInit() {
    this.idleDetectionService
      .onIdleEnd()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.phase.set('Warning'));
    this.idleDetectionService
      .onCountDown()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.countdown.set(value));
    this.idleDetectionService
      .onTimeoutEnd()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.phase.set('Expired');
        this.monitoring.set(false);
        this.idleDetectionService.clearTimers();
      });
  }

  start() {
    this.phase.set('Active');
    this.countdown.set(null);
    this.monitoring.set(true);
    this.idleDetectionService.startWatching();
  }

  confirm() {
    this.idleDetectionService.resetTimer(true);
    this.phase.set('Active');
    this.countdown.set(null);
  }

  stop() {
    this.idleDetectionService.clearTimers();
    this.phase.set('Stopped');
    this.monitoring.set(false);
    this.countdown.set(null);
  }

  ngOnDestroy() {
    this.idleDetectionService.clearTimers();
  }
}
// The provider isolates these timers from the root service.
// Activity resets the idle phase; only resetTimer(true) confirms an active warning.
// Expiry is an event: connect it to your application's session termination policy.`,
  );
  readonly starterHtml = highlight(
    `<div cds-layout="horizontal gap:sm wrap">
  <button type="button" class="btn btn-sm" [disabled]="monitoring()" (click)="start()">Start</button>
  <button type="button" class="btn btn-sm" [disabled]="!monitoring()" (click)="stop()">Stop</button>
  @if (phase() === 'Warning') {
    <button type="button" class="btn btn-sm" (click)="confirm()">Refresh</button>
  }
</div>
<output aria-live="polite">{{ phase() }} · {{ countdown() ?? '—' }}</output>`,
  );
  private destroyRef = inject(DestroyRef);
  private translationService = inject(TranslationService);

  serviceMethods = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'setConfig',
        type: '(config: IdleDetectionConfig) => void',
        description: this.translationService.translate('idleDetection.methodSetConfig'),
      },
      {
        name: 'startWatching',
        type: '() => void',
        description: this.translationService.translate('idleDetection.methodStartWatching'),
      },
      {
        name: 'clearTimers',
        type: '() => void',
        description: this.translationService.translate('idleDetection.methodClearTimers'),
      },
      {
        name: 'onIdleEnd',
        type: '() => Observable<void>',
        description: this.translationService.translate('idleDetection.methodOnIdleEnd'),
      },
      {
        name: 'onTimeoutEnd',
        type: '() => Observable<void>',
        description: this.translationService.translate('idleDetection.methodOnTimeoutEnd'),
      },
      {
        name: 'onCountDown',
        type: '() => Observable<number>',
        description: this.translationService.translate('idleDetection.methodOnCountDown'),
      },
    ];
  });

  configProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'idleDurationInSeconds',
        type: 'number',
        description: this.translationService.translate('idleDetection.configIdleDuration'),
      },
      {
        name: 'timeoutDurationInSeconds',
        type: 'number',
        description: this.translationService.translate('idleDetection.configTimeoutDuration'),
      },
    ];
  });

  configCode = highlight(`
export class IdleDetectionConfig {
  idleDurationInSeconds?: number;
  timeoutDurationInSeconds?: number;
}
  `);

  moduleUsage = highlight(`import {provideIdleDetectionConfig, IdleDetectionService} from 'ngx-lift';

@NgModule({
  providers: [
    // After 20 minutes of inactivity, a countdown starts with 300.
    provideIdleDetectionConfig({
      idleDurationInSeconds: 20 * 60, // 20 minutes for idle-detection phase
      timeoutDurationInSeconds: 5 * 60, // 5 minutes for timeout phase
    }),
  ],
})
export class AppModule {}`);

  standaloneUsage = highlight(`import {provideIdleDetectionConfig} from 'ngx-lift';

export const appConfig: ApplicationConfig = {
  providers: [provideIdleDetectionConfig({idleDurationInSeconds: 20 * 60, timeoutDurationInSeconds: 5 * 60})],
};

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));`);

  someComponentUsage = highlight(`
import {IdleDetectionService} from 'ngx-lift';
import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DestroyRef} from '@angular/core';

@Component({})
export class AppComponent implements OnInit, OnDestroy {
  private idleDetectionService = inject(IdleDetectionService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      // setConfig is optional if you have idle configuration by provideIdleDetectionConfig
      // This will overwrite the config passed by provideIdleDetectionConfig
      this.idleDetectionService.setConfig({
        idleDurationInSeconds: 5 * 60,
        timeoutDurationInSeconds: 5 * 60,
      });

      // Most important, start to watch for user inactivity!
      this.idleDetectionService.startWatching();

      this.idleDetectionService
        .onIdleEnd()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // Handle idle end event, e.g., show a warning dialog
          console.log('idle detection phase ends, enter timeout phase');
        });

      this.idleDetectionService
        .onTimeoutEnd()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // Handle timeout end event, e.g., log out the user
          console.log('timeout phase ends, should logout user');
        });

      this.idleDetectionService
        .onCountDown()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((countdown) => {
          // Update the UI with the remaining time if needed
          console.log(countdown, 'display countdown in UI');
        });
    }
  }

  ngOnDestroy() {
    this.idleDetectionService.clearTimers();
  }
}
  `);

  idleDetectionComponentCode = highlight(`import {IdleDetectionComponent} from 'clr-lift';
import {Component, inject} from '@angular/core';

@Component({
  imports: [IdleDetectionComponent],
  template: \`
    @if (isLoggedIn) {
      <cll-idle-detection
        [idleDurationInSeconds]="15 * 60"
        [timeoutDurationInSeconds]="5 * 60"
        (timeout)="onTimeout()"
      />
    }
  \`,
})
export class AppComponent {
  isLoggedIn = inject(AuthService).isLoggedIn;

  onTimeout() {
    localStorage.removeItem('your-app-jwt');
    location.assign('/login');
  }
}`);

  // onTimeout() {
  //   this.router.navigate(['/login']);
  // }

  private readonly idleDetectionService = inject(IdleDetectionService);
  readonly phase = signal<'Stopped' | 'Active' | 'Warning' | 'Expired'>('Stopped');
  readonly countdown = signal<number | null>(null);
  readonly monitoring = signal(false);

  ngOnInit() {
    this.idleDetectionService
      .onIdleEnd()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.phase.set('Warning'));
    this.idleDetectionService
      .onCountDown()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.countdown.set(value));
    this.idleDetectionService
      .onTimeoutEnd()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.phase.set('Expired');
        this.monitoring.set(false);
        this.idleDetectionService.clearTimers();
      });
  }
  start() {
    this.phase.set('Active');
    this.countdown.set(null);
    this.monitoring.set(true);
    this.idleDetectionService.startWatching();
  }
  confirm() {
    this.idleDetectionService.resetTimer(true);
    this.phase.set('Active');
    this.countdown.set(null);
  }
  stop() {
    this.idleDetectionService.clearTimers();
    this.phase.set('Stopped');
    this.monitoring.set(false);
    this.countdown.set(null);
  }
  ngOnDestroy() {
    this.idleDetectionService.clearTimers();
  }
}
