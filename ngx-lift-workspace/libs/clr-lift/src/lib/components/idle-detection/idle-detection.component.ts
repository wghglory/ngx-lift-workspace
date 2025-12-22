import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { ClarityModule } from '@clr/angular';
import {
  IdleDetectionConfig,
  IdleDetectionService,
  isEmpty,
  pickBy,
} from 'ngx-lift';
import { map, merge, Subject, tap } from 'rxjs';

import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { idleDetectionTranslations } from './idle-detection.l10n';

@Component({
  selector: 'cll-idle-detection',
  standalone: true,
  imports: [ClarityModule, TranslatePipe, AsyncPipe],
  templateUrl: './idle-detection.component.html',
  styleUrl: './idle-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleDetectionComponent implements OnInit {
  private idleDetectionService = inject(IdleDetectionService);
  private translationService = inject(TranslationService);
  private closeSubject = new Subject<void>();

  idleDurationInSeconds = input<number>();
  timeoutDurationInSeconds = input<number>();

  timeout = output<void>();

  open$ = merge(
    // Idle detection phase ends, pop up timeout countdown dialog
    this.idleDetectionService.onIdleEnd().pipe(map(() => true)),

    // Timeout phase ends, session timeout. It will redirect to login page.
    this.idleDetectionService.onTimeoutEnd().pipe(
      map(() => false),
      tap(() => {
        this.timeout.emit();
      }),
    ),

    this.closeSubject.pipe(map(() => false)),
  );

  countdown$ = this.idleDetectionService.onCountDown();

  constructor() {
    this.translationService.loadTranslationsForComponent(
      'idleDetection',
      idleDetectionTranslations,
    );

    effect(() => {
      const config = pickBy(
        {
          idleDurationInSeconds: this.idleDurationInSeconds(),
          timeoutDurationInSeconds: this.timeoutDurationInSeconds(),
        } as IdleDetectionConfig,
        (value) => value !== undefined,
      );

      if (!isEmpty(config)) {
        this.idleDetectionService.setConfig(config);
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.idleDetectionService.clearTimers();
    });
  }

  ngOnInit() {
    this.idleDetectionService.startWatching();
  }

  keepMeSignedIn() {
    this.closeSubject.next();
    this.idleDetectionService.resetTimer(true);
  }
}
