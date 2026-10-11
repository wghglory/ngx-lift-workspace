import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {
  AlertComponent,
  CalloutComponent,
  convertToHttpParams,
  dgState,
  PageContainerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {AsyncState, isEqual, poll} from 'ngx-lift';
import {BehaviorSubject, delay, distinctUntilChanged, filter, map, of, Subject, switchMap, takeWhile} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-poll',
  imports: [
    CommonModule,
    ClarityModule,
    PageContainerComponent,
    CodeBlockComponent,
    AlertComponent,
    CalloutComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './poll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollComponent implements OnInit {
  selectedItems: User[] = [];

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

  signatureCode = highlight(`
poll<Data, Input>(options: PollOptions<Data, Input>): Observable<AsyncState<Data>>

interface PollOptions<Data, Input> {
  pollingFn: (input?: Input) => Observable<Data> | Promise<Data> | Data;
  interval: number;
  forceRefresh?: Observable<Input> | Signal<Input>;
  paramsBuilder?: (input: Input) => any;
  initialValue?: AsyncState<Data>;
  delay?: number;
}
  `);

  advancedCode = highlight(`
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
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
    forceRefresh: this.dgState$,  // datagrid filter, sort, pagination change will immediately force a refresh of the API call
  });
}
    `);

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
