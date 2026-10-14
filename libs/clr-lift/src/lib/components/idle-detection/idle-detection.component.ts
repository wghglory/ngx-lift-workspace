import {AsyncPipe} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
  runInInjectionContext,
} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ClarityModule} from '@clr/angular';
import {IdleDetectionConfig, IdleDetectionService, isEmpty, pickBy} from 'ngx-lift';
import {map, merge, Subject, switchMap, tap} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {idleDetectionTranslations} from './idle-detection.l10n';

@Component({
  selector: 'cll-idle-detection',
  imports: [ClarityModule, TranslatePipe, AsyncPipe],
  templateUrl: './idle-detection.component.html',
  styleUrl: './idle-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleDetectionComponent implements OnInit {
  private readonly rootIdleDetectionService = inject(IdleDetectionService);
  private readonly translationService = inject(TranslationService);
  private readonly injector = inject(Injector);
  private readonly closeSubject = new Subject<void>();

  private scopedService?: IdleDetectionService;
  private previousService?: IdleDetectionService;
  private releaseWatch?: () => void;
  private initialized = false;

  scoped = input(false);
  idleDurationInSeconds = input<number>();
  timeoutDurationInSeconds = input<number>();

  timeout = output<void>();

  private getOrCreateScopedService(): IdleDetectionService {
    if (!this.scopedService) {
      this.scopedService = runInInjectionContext(this.injector, () => new IdleDetectionService());
    }
    return this.scopedService;
  }

  private get activeService(): IdleDetectionService {
    return this.scoped() ? this.getOrCreateScopedService() : this.rootIdleDetectionService;
  }

  private readonly activeService$ = toObservable(this.scoped).pipe(
    map((isScoped) => (isScoped ? this.getOrCreateScopedService() : this.rootIdleDetectionService)),
  );

  open$ = this.activeService$.pipe(
    switchMap((service) =>
      merge(
        // Idle detection phase ends, pop up timeout countdown dialog
        service.onIdleEnd().pipe(map(() => true)),

        // Timeout phase ends, session timeout. It will redirect to login page.
        service.onTimeoutEnd().pipe(
          map(() => false),
          tap(() => {
            this.timeout.emit();
          }),
        ),

        this.closeSubject.pipe(map(() => false)),
      ),
    ),
  );

  countdown$ = this.activeService$.pipe(switchMap((service) => service.onCountDown()));

  constructor() {
    this.translationService.loadTranslationsForComponent('idleDetection', idleDetectionTranslations);

    effect(() => {
      const service = this.activeService;
      this.configureService(service);
      if (this.initialized && this.previousService !== service) {
        this.releaseWatch?.();
        this.releaseWatch = service.watch();
        this.previousService = service;
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.releaseWatch?.();
      this.closeSubject.complete();
    });
  }

  private configureService(service: IdleDetectionService): void {
    const config = pickBy(
      {
        idleDurationInSeconds: this.idleDurationInSeconds(),
        timeoutDurationInSeconds: this.timeoutDurationInSeconds(),
      } as IdleDetectionConfig,
      (value) => value !== undefined,
    );
    if (!isEmpty(config)) service.setConfig(config);
  }

  ngOnInit() {
    if (this.initialized) return;
    this.initialized = true;
    const service = this.activeService;
    this.configureService(service);
    this.releaseWatch = service.watch();
    this.previousService = service;
  }

  keepMeSignedIn() {
    this.closeSubject.next();
    this.activeService.resetTimer(true);
  }
}
