import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {CommonModule, AsyncPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {
  AlertComponent,
  CalloutComponent,
  convertToHttpParams,
  dgState,
  PageContainerComponent,
  SpinnerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {AsyncState, isEqual, poll} from 'ngx-lift';
import {
  BehaviorSubject,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeWhile,
  tap,
  timer,
} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

interface SignalPollData {
  seq: number;
  status: string;
  timestamp: string;
  totalItems: number;
}

@Component({
  selector: 'app-poll',
  imports: [
    DemoPlaygroundComponent,
    AsyncPipe,
    AlertComponent,
    CommonModule,
    ClarityModule,
    PageContainerComponent,
    CodeBlockComponent,
    AlertComponent,
    SpinnerComponent,
    CalloutComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './poll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollComponent implements OnInit {
  readonly running$ = new BehaviorSubject(false);
  readonly manualRefresh$ = new Subject<void>();
  readonly failure = signal(false);
  private sequence = 0;
  readonly starterState$ = this.running$.pipe(
    switchMap((running) =>
      running
        ? poll({
            interval: 1500,
            forceRefresh: this.manualRefresh$,
            pollingFn: () =>
              timer(300).pipe(
                map(() => {
                  if (this.failure()) throw new Error('Simulated polling failure');
                  return ++this.sequence;
                }),
              ),
          })
        : of(null),
    ),
  );
  readonly starterCode = highlight(`import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {AlertComponent} from 'clr-lift';
import {poll} from 'ngx-lift';
import {BehaviorSubject, Subject, switchMap, of, timer, map} from 'rxjs';

// Start subscribes to one poller; Stop unsubscribes and cancels pending work.
// AsyncPipe also unsubscribes when the component is destroyed.
// Failed reads remain observable; disable failure and refresh to recover.
@Component({
  selector: 'app-starter',
  imports: [AsyncPipe, AlertComponent],
  templateUrl: './starter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterComponent {
  readonly running$ = new BehaviorSubject(false);
  readonly manualRefresh$ = new Subject<void>();
  readonly failure = signal(false);
  private sequence = 0;
  readonly starterState$ = this.running$.pipe(
    switchMap((running) =>
      running
        ? poll({
            interval: 1500,
            forceRefresh: this.manualRefresh$,
            pollingFn: () =>
              timer(300).pipe(
                map(() => {
                  if (this.failure()) throw new Error('Simulated polling failure');
                  return ++this.sequence;
                }),
              ),
          })
        : of(null),
    ),
  );
}`);
  readonly starterHtml = highlight(
    '<div cds-layout="horizontal gap:sm wrap">\n  <button type="button" class="btn btn-sm" (click)="running$.next(true)">Start</button>\n  <button type="button" class="btn btn-sm" (click)="running$.next(false)">Stop</button>\n  <button type="button" class="btn btn-sm" (click)="manualRefresh$.next()">Refresh</button>\n  <button type="button" class="btn btn-sm" [attr.aria-pressed]="failure()" (click)="failure.set(!failure())">\n    Simulate failure\n  </button>\n</div>\n@if (starterState$ | async; as state) {\n  <output aria-live="polite">{{ state.status }} · {{ state.data ?? \'—\' }}</output>\n  @if (state.error) {\n    <cll-alert [error]="state.error" />\n  }\n}',
  );

  selectedItems: User[] = [];
  private readonly destroyRef = inject(DestroyRef);
  private refreshTimers: ReturnType<typeof setTimeout>[] = [];
  constructor() {
    this.destroyRef.onDestroy(() => this.refreshTimers.forEach(clearTimeout));
  }

  userService = inject(UserService);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'pollingFn',
        type: '(input?: Input) => Observable<Data> | Promise<Data> | Data',
        required: true,
        description: this.translationService.translate('poll.paramPollingFn'),
      },
      {
        name: 'interval',
        type: 'number',
        required: true,
        description: this.translationService.translate('poll.paramInterval'),
      },
      {
        name: 'forceRefresh',
        type: 'Observable<Input> | Signal<Input>',
        description: this.translationService.translate('poll.paramForceRefresh'),
      },
      {
        name: 'paramsBuilder',
        type: '(input: Input) => any',
        description: this.translationService.translate('poll.paramParamsBuilder'),
      },
      {
        name: 'initialValue',
        type: 'AsyncState<Data>',
        defaultValue: "{ status: 'loading', isLoading: true, error: null, data: null }",
        description: this.translationService.translate('poll.paramInitialValue'),
      },
      {
        name: 'delay',
        type: 'number',
        defaultValue: '0',
        description: this.translationService.translate('poll.paramDelay'),
      },
    ];
  });

  returnProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'status',
        type: 'ResourceStatus',
        description: this.translationService.translate('createAsyncState.stateStatus'),
      },
      {
        name: 'isLoading',
        type: 'boolean',
        description: this.translationService.translate('createAsyncState.stateIsLoading'),
      },
      {
        name: 'error',
        type: 'E | null',
        description: this.translationService.translate('createAsyncState.stateError'),
      },
      {
        name: 'data',
        type: 'T | null',
        description: this.translationService.translate('createAsyncState.stateData'),
      },
    ];
  });

  private dgBS = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  private dgState$ = this.dgBS.pipe(dgState(false)); // When the dgState parameter is set to false, it signals the execution of an API call even when the current state is identical to the previous state. Conversely, emission is suppressed when dgState is true, thanks to the application of distinctUntilChanged.

  usersState$ = poll({
    interval: 10000,
    pollingFn: (params: Record<string, unknown>) => this.userService.getUsers({...params, results: 10, seed: 'abc'}),
    paramsBuilder: (dgState: ClrDatagridStateInterface | null) => convertToHttpParams(dgState),
    forceRefresh: this.dgState$,
  });

  signalFilter = signal<'all' | 'active' | 'inactive'>('all');
  signalPollLogs = signal<{time: string; filter: string; status: 'in-flight' | 'settled'}[]>([]);
  private signalPollSeq = 0;

  signalPollState$ = poll<SignalPollData, 'all' | 'active' | 'inactive', {status: string; limit: number}>({
    interval: 8000,
    forceRefresh: this.signalFilter,
    paramsBuilder: (filterValue: 'all' | 'active' | 'inactive') => ({
      status: filterValue,
      limit: filterValue === 'all' ? 30 : 15,
    }),
    pollingFn: (params: {status: string; limit: number}) => {
      const seq = ++this.signalPollSeq;
      this.signalPollLogs.update((logs) => [
        {time: new Date().toLocaleTimeString(), filter: params.status, status: 'in-flight'},
        ...logs.slice(0, 4),
      ]);
      return of({
        seq,
        status: params.status,
        timestamp: new Date().toLocaleTimeString(),
        totalItems: params.limit,
      }).pipe(
        delay(1000),
        tap(() => {
          this.signalPollLogs.update((logs) => logs.map((log, idx) => (idx === 0 ? {...log, status: 'settled'} : log)));
        }),
      );
    },
    initialValue: {
      status: 'idle',
      isLoading: false,
      error: null,
      data: {seq: 0, status: 'all', timestamp: '--', totalItems: 0},
    },
  });

  setSignalFilter(filter: 'all' | 'active' | 'inactive') {
    this.signalFilter.set(filter);
  }

  triggerRapidRefreshes() {
    this.signalFilter.set('active');
    this.refreshTimers.forEach(clearTimeout);
    this.refreshTimers = [
      setTimeout(() => this.signalFilter.set('inactive'), 80),
      setTimeout(() => this.signalFilter.set('all'), 200),
    ];
  }

  total$ = this.usersState$.pipe(
    filter((state) => Boolean(state.data)),
    distinctUntilChanged<AsyncState<PaginationResponse<User>, HttpErrorResponse>>(isEqual),
    map((res) => res.data?.info?.total || 0),
  );

  refresh(state: ClrDatagridStateInterface) {
    this.dgBS.next(state);
  }

  searchByFirstName(value: string) {
    // in real project, better implement debounce here
    const state = this.dgBS.value || {};
    const filters = state.filters || [];

    const foundFirstName = filters.some((item) => {
      if (item.property === 'firstName') {
        item.value = value;
        return true;
      }
      return false;
    });

    if (!foundFirstName) {
      filters.push({property: 'firstName', value});
    }

    this.dgBS.next({...state, filters});
  }

  pollingTakeWhileCode = highlight(`
import {poll} from 'ngx-lift';
import {of, takeWhile, delay} from 'rxjs';

poll({
  interval: 1000,
  pollingFn: () => of(Math.random() * 10).pipe(delay(300)),
})
  .pipe(takeWhile((state) => state.data === null || state.data <= 8, true))
  .subscribe(console.log);
  `);

  pollingInitialValue = highlight(`
import {poll} from 'ngx-lift';
import {of, delay} from 'rxjs';

poll({
  interval: 1000,
  pollingFn: () => of(Math.random() * 10).pipe(delay(300)),
  initialValue: {status: 'idle', isLoading: false, error: null, data: 0}, // display 0 for initial value
}).subscribe(console.log);
  `);

  deferPollingCode = highlight(`
import {poll} from 'ngx-lift';
import {Subject} from 'rxjs';
import {delay, of, switchMap, takeWhile} from 'rxjs';

const startPolling = new Subject<void>();

// start button click
function start() {
  startPolling.next();
}

startPolling
  .pipe(
    switchMap(() => {
      return poll({
        interval: 1000,
        pollingFn: () => of(Math.random() * 10).pipe(delay(300)),
      }).pipe(takeWhile((state) => state.data === null || state.data <= 8, true));
    }),
  )
  .subscribe(console.log);
  `);

  deferPolling2Code = highlight(`
import {poll} from 'ngx-lift';
import {of} from 'rxjs';

poll({
  interval: 1000,
  pollingFn: () => of(Math.random() * 10),
  delay: 3000, // delay 3s and start polling
}).subscribe(console.log);
  `);

  basicExampleCode = highlight(`
import {poll} from 'ngx-lift';
import {ajax} from 'rxjs/ajax';

// Return a primitive value
poll({
  interval: 5000, // Poll every 5 seconds
  pollingFn: () => Math.random(),
}).subscribe(console.log);

// Return a Promise
poll({
  interval: 5000,
  pollingFn: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random());
      }, 200);
    }),
}).subscribe(console.log);

// Return an Observable
poll({
  interval: 5000,
  pollingFn: () => ajax('https://api.example.com/data'),
}).subscribe(console.log);
  `);

  forceRefreshCode = highlight(`
import {poll} from 'ngx-lift';
import {Subject} from 'rxjs';

export class MyComponent {
  private refresh$ = new Subject<void>();

  dataState$ = poll({
    interval: 5000,
    pollingFn: () => this.http.get('/api/data'),
    forceRefresh: this.refresh$,
  });

  refresh() {
    this.refresh$.next();
  }
}
  `);

  signalForceRefreshCode = highlight(`import {poll} from 'ngx-lift';
import {signal} from '@angular/core';
import {of, delay} from 'rxjs';

export class DeviceMonitorComponent {
  // 1. Pass an Angular Signal directly to forceRefresh
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  devicePollState$ = poll({
    interval: 8000,
    forceRefresh: this.statusFilter,
    paramsBuilder: (status) => ({status, limit: status === 'all' ? 50 : 20}),
    pollingFn: (params) => this.api.getDevices(params),
  });

  // 2. Updating the Signal immediately triggers pollingFn.
  // If multiple updates happen while a request is in flight, exhaustMap skips
  // the redundant intermediate calls, but RETAINS the newest parameter for the next tick!
  changeFilter(status: 'all' | 'active' | 'inactive') {
    this.statusFilter.set(status);
  }
}`);

  signatureCode = highlight(`interface PollOptions<Data, Input> {
  pollingFn: (input?: Input) => Observable<Data> | Promise<Data> | Data;
  interval: number;
  forceRefresh?: Observable<Input> | Signal<Input>;
  paramsBuilder?: (input: Input) => any;
  initialValue?: AsyncState<Data>;
  delay?: number;
}

poll<Data, Input>(options: PollOptions<Data, Input>): Observable<AsyncState<Data>>;`);

  advancedCode = highlight(`import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {AlertComponent, convertToHttpParams, dgState} from 'clr-lift';
import {poll} from 'ngx-lift';
import {inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export class PollComponent {
  userService = inject(UserService);

  private dgBS = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  private dgState$ = this.dgBS.pipe(dgState(false));

  usersState$ = poll({
    interval: 10_000,
    pollingFn: (params) => this.userService.getUsers({...params, results: 10, seed: 'abc'}),
    paramsBuilder: (dgState: ClrDatagridStateInterface | null) => convertToHttpParams(dgState), // build params for getUsers
    forceRefresh: this.dgState$, // datagrid filter, sort, pagination change will immediately force a refresh of the API call
  });
}`);

  startPolling = new Subject<void>();

  start() {
    this.startPolling.next();
  }

  ngOnInit() {
    this.startPolling
      .pipe(
        switchMap(() => {
          return poll({
            interval: 1000,
            pollingFn: () => of(Math.random() * 10).pipe(delay(300)),
          }).pipe(takeWhile((state) => state.data === null || state.data <= 8, true));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(console.log);
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
