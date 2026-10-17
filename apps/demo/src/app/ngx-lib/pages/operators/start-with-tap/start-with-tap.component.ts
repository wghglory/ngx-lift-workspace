import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {startWithTap} from 'ngx-lift';
import {delay, finalize, of, tap} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-start-with-tap',
  imports: [
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    ClarityModule,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './start-with-tap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartWithTapComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'callback',
        type: '() => void',
        description: this.translationService.translate('startWithTap.paramCallback'),
      },
    ];
  });

  readonly isLoading = signal(false);
  readonly logs = signal<string[]>([]);
  readonly fetchedData = signal<string | null>(null);

  executeFetch(): void {
    this.logs.set(['Pipeline initiated...']);
    this.fetchedData.set(null);

    of({user: 'Alice', role: 'Administrator'})
      .pipe(
        delay(900),
        startWithTap(() => {
          this.isLoading.set(true);
          this.logs.update((l) => [...l, `[${new Date().toLocaleTimeString()}] startWithTap executed on subscription`]);
        }),
        tap((data) => {
          this.logs.update((l) => [
            ...l,
            `[${new Date().toLocaleTimeString()}] Data received: ${JSON.stringify(data)}`,
          ]);
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.logs.update((l) => [...l, `[${new Date().toLocaleTimeString()}] Stream finalized`]);
        }),
      )
      .subscribe((res) => {
        this.fetchedData.set(`${res.user} (${res.role})`);
      });
  }

  clearLogs(): void {
    this.logs.set([]);
    this.fetchedData.set(null);
  }

  basicUsageCode = highlight(`import {startWithTap} from 'ngx-lift';
import {of, tap} from 'rxjs';

const trace: string[] = [];
const stream$ = of('Ready').pipe(
  startWithTap(() => trace.push('subscribed')),
  tap((value) => trace.push(value)),
);
// trace: [] — declaring a pipeline does not run its side effects.
stream$.subscribe();
// trace: ['subscribed', 'Ready']
stream$.subscribe();
// trace: ['subscribed', 'Ready', 'subscribed', 'Ready']
// Every subscription invokes the callback before the source emits.
// This finite trace completes synchronously. The preview delays data by 900 ms
// to make loading visible. For component-owned streams, use AsyncPipe or
// takeUntilDestroyed; startWithTap itself does not manage subscription lifetime.`);

  lazyExecutionCode = highlight(`import {startWithTap} from 'ngx-lift';
import {of} from 'rxjs';

// Callback does NOT run when pipeline is declared:
const stream$ = of('Ready').pipe(startWithTap(() => console.log('Subscription started!')));

// Callback runs synchronously each time .subscribe() is invoked:
stream$.subscribe(); // Logs: "Subscription started!"
stream$.subscribe(); // Logs: "Subscription started!"`);

  signatureCode = highlight(`startWithTap<T>(callback: () => void): MonoTypeOperatorFunction<T>;`);
}
