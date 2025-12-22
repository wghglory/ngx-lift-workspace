import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {AlertComponent, CalloutComponent, convertToHttpParams, dgState, PageContainerComponent} from 'clr-lift';
import {AsyncState, isEqual, poll} from 'ngx-lift';
import {BehaviorSubject, delay, distinctUntilChanged, filter, map, of, Subject, switchMap, takeWhile} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, ClarityModule, PageContainerComponent, CodeBlockComponent, AlertComponent, CalloutComponent],
  templateUrl: './poll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollComponent implements OnInit {
  selectedItem: User | undefined;

  userService = inject(UserService);

  private dgBS = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  private dgState$ = this.dgBS.pipe(dgState(false)); // When the dgState parameter is set to false, it signals the execution of an API call even when the current state is identical to the previous state. Conversely, emission is suppressed when dgState is true, thanks to the application of distinctUntilChanged.

  usersState$ = poll({
    interval: 10000,
    pollingFn: (params) => this.userService.getUsers({...params, results: 10, seed: 'abc'}),
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
import { poll } from 'ngx-lift';
import { of, takeWhile, delay } from 'rxjs';

poll({
  interval: 1000,
  pollingFn: () => of(Math.random() * 10).pipe(delay(300)),
})
  .pipe(takeWhile((state) => state.data === null || state.data <= 8, true))
  .subscribe(console.log);
    `);

  pollingInitialValue = highlight(`
import { poll } from 'ngx-lift';
import { of, delay } from 'rxjs';

poll({
  interval: 1000,
  pollingFn: () => of(Math.random() * 10).pipe(delay(300)),
  initialValue: { loading: false, error: null, data: 0 }, // display 0 for initial value
}).subscribe(console.log);
    `);

  deferPollingCode = highlight(`
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
import { poll } from 'ngx-lift';
import { of } from 'rxjs';

poll({
  interval: 1000,
  pollingFn: () => of(Math.random() * 10),
  delay: 3000, // delay 3s and start polling
}).subscribe(console.log);
  `);

  simpleCode = highlight(`
import { poll } from 'ngx-lift';
import { ajax } from 'rxjs/ajax';

poll({
  interval: 5000, // Poll every 5 second
  pollingFn: () => Math.random(), // return a primitive value
}).subscribe(console.log);

poll({
  interval: 5000,
  pollingFn: () =>
    new Promise((resolve) => {
      setTimeout(() => { resolve(Math.random()); }, 200); // return a promise
    }),
}).subscribe(console.log);

poll({
  interval: 5000,
  pollingFn: () => ajax('https://api.example.com/data'), // return an observable
}).subscribe(console.log);
`);

  advancedCode = highlight(`
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {AlertComponent, convertToHttpParams, dgState, PageContainerComponent} from 'clr-lift';
import {AsyncState, isEqual, poll} from 'ngx-lift';

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
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
}
