import {ChangeDetectionStrategy, Component, effect, inject, Injector, Signal, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, SpinnerComponent} from 'clr-lift';
import {AsyncState, computedAsync, createAsyncState, createTrigger} from 'ngx-lift';
import {delay, of, throwError} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardComponent} from '../../../../shared/components/user-card/user-card.component';
import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-computed-async',
  imports: [
    ClarityModule,
    RouterLink,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    AlertComponent,
    UserCardComponent,
  ],
  templateUrl: './computed-async.component.html',
  styleUrl: './computed-async.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComputedAsyncComponent {
  private userService = inject(UserService);
  private injector = inject(Injector);
  private refreshTrigger = createTrigger();
  private fetchTrigger = createTrigger();

  // Decoupled Injector example: Can be created dynamically outside component constructor
  decoupledUserState = computedAsync(() => this.userService.getUsers({results: 3}).pipe(createAsyncState()), {
    injector: this.injector,
  });

  // user list will initially be fetched
  usersState: Signal<AsyncState<PaginationResponse<User>>> = computedAsync(
    () => {
      this.refreshTrigger.value();

      return this.userService.getUsers({results: 9}).pipe(createAsyncState());
    },
    {requireSync: true, behavior: 'merge'},
  );

  // user list will be fetched only when button clicks
  deferredUsersState: Signal<AsyncState<PaginationResponse<User>> | undefined> = computedAsync(() => {
    return this.fetchTrigger.value() ? this.userService.getUsers({results: 9}).pipe(createAsyncState()) : undefined;
  });

  // Tab switching resilience demo
  selectedTab = signal<'activeDirectory' | 'backupLocations' | 'certificates' | 'aborted'>('activeDirectory');

  tabState: Signal<AsyncState<{title: string; count: number; items: string[]}>> = computedAsync(
    () => {
      const tab = this.selectedTab();
      if (tab === 'aborted') {
        // Simulates an HTTP request aborted by browser when rapidly switching tabs
        return throwError(() => new Error('Request canceled / aborted (net::ERR_ABORTED)')).pipe(
          delay(100),
          createAsyncState(),
        );
      }

      const dataMap: Record<string, {title: string; count: number; items: string[]}> = {
        activeDirectory: {
          title: 'Active Directory Domains',
          count: 2,
          items: ['corp.local (Configured)', 'internal.ad (Configured)'],
        },
        backupLocations: {
          title: 'Backup & Storage Locations',
          count: 3,
          items: ['s3-primary (us-west-2)', 'minio-backup (local)', 'azure-blob (eastus)'],
        },
        certificates: {
          title: 'Trusted Root Certificates',
          count: 4,
          items: ['vCenter Root CA', 'Internal Root CA', 'MinIO Self-Signed CA', 'Proxy Root CA'],
        },
      };

      return of(dataMap[tab]).pipe(delay(200), createAsyncState());
    },
    {
      initialValue: {isLoading: false, data: null, error: null, status: 'idle'},
    },
  );

  constructor() {
    effect(() => {
      console.log('[computedAsync] usersState:', this.usersState());
      console.log('[computedAsync] deferredUsersState:', this.deferredUsersState());
      console.log('[computedAsync] tabState:', this.tabState());
      console.log('[computedAsync] decoupledUserState (custom injector):', this.decoupledUserState());
    });
  }

  selectTab(tab: 'activeDirectory' | 'backupLocations' | 'certificates' | 'aborted') {
    this.selectedTab.set(tab);
  }

  refresh() {
    this.refreshTrigger.next();
  }

  load() {
    this.fetchTrigger.next();
  }

  promiseCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, input, Signal} from '@angular/core';

export class UserDetailComponent {
  userId = input.required<number>();

  user: Signal<User | undefined> = computedAsync(
    () => fetch(\`https://localhost/api/users/\${this.userId()}\`).then((res) => res.json()),
  );
}
  `);

  observableCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user: Signal<User | undefined> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`),
  );
}
  `);

  regularCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, Signal} from '@angular/core';

export class UserDetailComponent {
  user: Signal<User> = computedAsync(() => ({name: 'Great user!'}), {requireSync: true});
}
  `);

  promiseInitialValueCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, input, Signal} from '@angular/core';

export class UserDetailComponent {
  userId = input.required<number>();

  user: Signal<User> = computedAsync(
    () => fetch(\`https://localhost/api/users/\${this.userId()}\`).then((res) => res.json()),
    {initialValue: {name: 'Placeholder'}},
  );
}
  `);

  requireSyncCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {startWith} from 'rxjs/operators';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user: Signal<User> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`).pipe(startWith({name: 'Placeholder'})),
    {requireSync: true},
  );
}
  `);

  createAsyncStateCode = highlight(`
import {computedAsync, createAsyncState} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AsyncState} from 'ngx-lift';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  // AsyncState includes status field for granular state tracking
  userState: Signal<AsyncState<User>> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`).pipe(createAsyncState()),
    {requireSync: true},
  );

  // Access state via:
  // userState().status  // 'idle' | 'loading' | 'reloading' | 'resolved' | 'error'
  // userState().isLoading
  // userState().error
  // userState().data
}
  `);

  behaviorCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user: Signal<User | undefined> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`),
    {behavior: 'merge'}, // or 'switch', 'concat', 'exhaust'
  );
}
  `);

  previousCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user: Signal<User | undefined> = computedAsync(
    (previousValue) => {
      // Use previousValue here if you need
      return this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`);
    },
  );
}
  `);

  loadInitiallyHtmlCode = highlight(`
<div>
  <button class="btn btn-primary" (click)="refresh()" [clrLoading]="usersState().isLoading">Refresh</button>
</div>

@if (usersState().isLoading) {
  <cll-spinner />
}

@if (usersState().error; as error) {
  <cll-alert [error]="error" />
}

@if (usersState().data?.results; as users) {
  <div class="card-grid">
    @for (user of users; track user.id.value) {
      <app-user-card [user]="user" />
    }
  </div>
}
  `);

  loadInitiallyTsCode = highlight(`
import {AsyncState, computedAsync, createAsyncState, createTrigger} from 'ngx-lift';
import {Component, inject, Signal} from '@angular/core';
import {UserService} from './user.service';

export class UserListComponent {
  private userService = inject(UserService);
  private refreshTrigger = createTrigger();

  // user list will initially be fetched
  usersState: Signal<AsyncState<PaginationResponse<User>>> = computedAsync(
    () => {
      this.refreshTrigger.value();

      return this.userService.getUsers({results: 9}).pipe(createAsyncState());
    },
    {requireSync: true},
  );

  refresh() {
    this.refreshTrigger.next();
  }
}
  `);

  loadDeferHtmlCode = highlight(`
<div>
  <button class="btn btn-primary" (click)="load()" [clrLoading]="deferredUsersState()?.isLoading">
    Load Users
  </button>
</div>

@if (deferredUsersState()?.isLoading) {
  <cll-spinner />
}

@if (deferredUsersState()?.error; as error) {
  <cll-alert [error]="error" />
}

@if (deferredUsersState()?.data?.results; as users) {
  <div class="card-grid">
    @for (user of users; track user.id.value) {
      <app-user-card [user]="user" />
    }
  </div>
}
  `);

  loadDeferTsCode = highlight(`
import {AsyncState, computedAsync, createAsyncState, createTrigger} from 'ngx-lift';
import {Component, inject, Signal} from '@angular/core';
import {UserService} from './user.service';

export class UserListComponent {
  private userService = inject(UserService);
  private fetchTrigger = createTrigger();

  // user list will be fetched only when button clicks
  deferredUsersState: Signal<AsyncState<PaginationResponse<User>> | undefined> = computedAsync(() => {
    return this.fetchTrigger.value() ? this.userService.getUsers({results: 9}).pipe(createAsyncState()) : undefined;
  });

  load() {
    this.fetchTrigger.next();
  }
}
  `);

  errorHandlingCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  // Handle errors and provide fallback value
  user: Signal<User | undefined> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`),
    {
      onError: (error) => {
        console.error('Failed to load user:', error);
        // Return fallback user
        return {id: 0, name: 'Guest User', email: 'guest@example.com'} as User;
      }
    }
  );
}
  `);

  throwOnErrorCode = highlight(`
import {computedAsync} from 'ngx-lift';
import {Component, inject, input, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  // Throw errors instead of silently handling them
  user: Signal<User | undefined> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`),
    {
      throwOnError: true,  // Errors will propagate up
      onError: (error) => {
        console.error('API Error:', error);
        // Can still log/handle but error will still throw
        return undefined;  // Won't be used since error throws
      }
    }
  );
}
  `);

  tabSwitchingCode = highlight(`
import {computedAsync, createAsyncState} from 'ngx-lift';
import {Component, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class MultiTabPageComponent {
  selectedTab = signal<'activeDirectory' | 'backupLocations' | 'certificates'>('activeDirectory');

  // When switching tabs rapidly, the previous HTTP request might be canceled
  // by the browser / abort controller (throwing an AbortError or HttpError).
  //
  // BEFORE FIX: The inner abort error permanently killed the outer RxJS switchAll
  // pipeline, unsubscribing from subsequent signal changes. The page got stuck
  // in loading state forever!
  //
  // AFTER FIX: The inner error is safely captured, leaving the pipeline open.
  // Clicking another tab or retrying continues to fetch and display fresh data!
  tabState = computedAsync(() => {
    const tab = this.selectedTab();
    return this.http.get(\`/api/\${tab}\`).pipe(createAsyncState());
  });

  selectTab(tab: 'activeDirectory' | 'backupLocations' | 'certificates') {
    this.selectedTab.set(tab);
  }
}
  `);

  decoupledInjectorCode = highlight(`
import {computedAsync, createAsyncState} from 'ngx-lift';
import {Component, inject, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserProfileComponent {
  private http = inject(HttpClient);
  private injector = inject(Injector);

  // Decoupled Injector: By passing { injector }, computedAsync can be instantiated
  // outside the constructor (e.g. inside helper methods, composable functions, or services).
  userState = computedAsync(
    () => this.http.get('/api/user/current').pipe(createAsyncState()),
    {injector: this.injector},
  );
}
  `);

  signatureCode = highlight(`
computedAsync<T>(
  computation: (previousValue?: T) => Promise<T> | Observable<T> | T,
  options?: ComputedAsyncOptions<T>
): Signal<T | undefined> | Signal<T>

interface ComputedAsyncOptions<T> {
  initialValue?: T;
  requireSync?: boolean;
  behavior?: 'switch' | 'merge' | 'concat' | 'exhaust';
  onError?: (error: unknown) => T | undefined;
  throwOnError?: boolean;
  injector?: Injector;
}
  `);
}
