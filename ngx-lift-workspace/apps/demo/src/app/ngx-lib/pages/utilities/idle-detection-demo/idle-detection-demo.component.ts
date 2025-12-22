import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {CalloutComponent, IdleDetectionComponent, PageContainerComponent} from 'clr-lift';
import {IdleDetectionService} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-idle-detection-demo',
  standalone: true,
  imports: [PageContainerComponent, CalloutComponent, CodeBlockComponent, IdleDetectionComponent],
  templateUrl: './idle-detection-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleDetectionDemoComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  configCode = highlight(`
export class IdleDetectionConfig {
  idleDurationInSeconds?: number;
  timeoutDurationInSeconds?: number;
}
  `);

  moduleUsage = highlight(`
import { provideIdleDetectionConfig, IdleDetectionService } from 'ngx-lift';

@NgModule({
  providers: [
    // After 20 minutes of inactivity, a countdown starts with 300.
    provideIdleDetectionConfig({
      idleDurationInSeconds: 20 * 60, // 20 minutes for idle-detection phase
      timeoutDurationInSeconds: 5 * 60, // 5 minutes for timeout phase
    }),
  ],
})
export class AppModule {}
  `);

  standaloneUsage = highlight(`
import { provideIdleDetectionConfig } from 'ngx-lift';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIdleDetectionConfig({ idleDurationInSeconds: 20 * 60, timeoutDurationInSeconds: 5 * 60 }),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
  `);

  someComponentUsage = highlight(`
import { IdleDetectionService } from 'ngx-lift';

export class AppComponent implements OnInit {
  constructor(private idleDetectionService: IdleDetectionService, private authService: AuthService) {}

  ngOnInit() {
    if(this.authService.isLoggedIn) {
      // setConfig is optional if you have idle configuration by provideIdleDetectionConfig
      // This will overwrite the config passed by provideIdleDetectionConfig
      this.idleDetectionService.setConfig({
        idleDurationInSeconds: 5 * 60,
        timeoutDurationInSeconds: 5 * 60,
      });

      // Most important, start to watch for user inactivity!
      this.idleDetectionService.startWatching();

      this.idleDetectionService.onIdleEnd().subscribe(() => {
        // Handle idle end event, e.g., show a warning dialog
        console.log('idle detection phase ends, enter timeout phase');
      });

      this.idleDetectionService.onTimeoutEnd().subscribe(() => {
        // Handle timeout end event, e.g., log out the user
        console.log('timeout phase ends, should logout user');
      });

      this.idleDetectionService.onCountDown().subscribe((countdown) => {
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

  idleDetectionComponentCode = highlight(`
import {IdleDetectionComponent} from 'clr-lift';

@Component({
  imports: [IdleDetectionComponent],
  template: \`
    if(isLoggedIn) {
      <cll-idle-detection [idleDurationInSeconds]="15 * 60" [timeoutDurationInSeconds]="5 * 60" (timeout)="onTimeout()" />
    }
  \`
})
export class AppComponent {
  isLoggedIn = inject(AuthService).isLoggedIn;

  onTimeout() {
    localStorage.removeItem('your-app-jwt');
    location.assign('/login');
  }
}
  `);

  // onTimeout() {
  //   this.router.navigate(['/login']);
  // }

  constructor(private idleDetectionService: IdleDetectionService) {}

  ngOnInit() {
    this.idleDetectionService.setConfig({
      idleDurationInSeconds: 5,
      timeoutDurationInSeconds: 5,
    });
    this.idleDetectionService.startWatching();

    this.idleDetectionService
      .onIdleEnd()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Handle idle end event, e.g., show a warning dialog
        console.log('idle for a long time, enter timeout phase');
      });

    this.idleDetectionService
      .onTimeoutEnd()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Handle timeout end event, e.g., log out the user
        console.log('timeout, should logout');
      });

    this.idleDetectionService
      .onCountDown()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countdown) => {
        // Update the UI with the remaining time
        console.log(countdown);
      });
  }

  ngOnDestroy() {
    this.idleDetectionService.clearTimers();
  }
}
