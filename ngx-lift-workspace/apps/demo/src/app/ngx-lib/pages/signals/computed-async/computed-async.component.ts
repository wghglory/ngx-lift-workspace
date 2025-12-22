import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, SpinnerComponent} from 'clr-lift';
import {AsyncState, computedAsync, createAsyncState, createTrigger} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardComponent} from '../../../../shared/components/user-card/user-card.component';
import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-computed-async',
  standalone: true,
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
  private refreshTrigger = createTrigger();
  private fetchTrigger = createTrigger();

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

  refresh() {
    this.refreshTrigger.next();
  }

  load() {
    this.fetchTrigger.next();
  }

  promiseCode = highlight(`
import {computedAsync} from 'ngx-lift';

export class UserDetailComponent {
  userId = input.required<number>();

  user = computedAsync(
    () => fetch(\`https://localhost/api/users/\${this.userId()}\`).then((res) => res.json()),
  );
}
  `);

  observableCode = highlight(`
export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user: Signal<User | undefined> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`),
  );
}
  `);

  regularCode = highlight(`
export class UserDetailComponent {
  user = computedAsync(() => ({name: 'Great user!'}), { requireSync: true });
}
  `);

  promiseInitialValueCode = highlight(`
export class UserDetailComponent {
  userId = input.required<number>();

  user = computedAsync(
    () => fetch(\`https://localhost/api/users/\${this.userId()}\`).then((res) => res.json()),
    { initialValue: { name: 'Placeholder' } }
  );
}
  `);

  requireSyncCode = highlight(`
export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user: Signal<User> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`).pipe(startWith({ name: 'Placeholder' })),
    { requireSync: true },
  );
}
  `);

  createAsyncStateCode = highlight(`
import {computedAsync, createAsyncState} from 'ngx-lift';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  userState: Signal<AsyncState<User>> = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`).pipe(createAsyncState())),
    { requireSync: true },
  );
}
  `);

  behaviorCode = highlight(`
export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user = computedAsync(
    () => this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`),
    { behavior: 'merge' },
  );
}
  `);

  previousCode = highlight(`
export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user = computedAsync(
    (previousValue) => {
      // Use previousValue here if you need

      return this.http.get<User>(\`https://localhost/api/users/\${this.userId()}\`);
    },
  );
}
  `);

  loadInitiallyHtmlCode = highlight(`
<div>
  <button class="btn btn-primary" (click)="refresh()" [clrLoading]="usersState().loading === true">Refresh</button>
</div>

@if (usersState().loading) {
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

export class UserDetailComponent {
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
  <button class="btn btn-primary" (click)="load()" [clrLoading]="deferredUsersState()?.loading === true">
    Load Users
  </button>
</div>

@if (deferredUsersState()?.loading) {
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

export class UserDetailComponent {
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
}
