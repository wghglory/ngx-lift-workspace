import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardListComponent} from '../../../../shared/components/user-card-list/user-card-list.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-create-async-state',
  imports: [
    ClarityModule,
    PageContainerComponent,
    CodeBlockComponent,
    UserCardListComponent,
    CalloutComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './create-async-state.component.html',
  styleUrl: './create-async-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAsyncStateComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'observerOrNextForOrigin',
        type: 'Partial<TapObserver<T>> | ((value: T) => void)',
        description: this.translationService.translate('createAsyncState.paramObserver'),
      },
      {
        name: 'initialValue',
        type: 'AsyncState<T, E>',
        defaultValue: "{ status: 'loading', isLoading: true, error: null, data: null }",
        description: this.translationService.translate('createAsyncState.paramInitialValue'),
      },
    ];
  });

  asyncStateProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'status',
        type: "'idle' | 'loading' | 'reloading' | 'resolved' | 'error'",
        required: true,
        description: this.translationService.translate('createAsyncState.stateStatus'),
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: true,
        description: this.translationService.translate('createAsyncState.stateIsLoading'),
      },
      {
        name: 'error',
        type: 'E | null',
        required: true,
        description: this.translationService.translate('createAsyncState.stateError'),
      },
      {
        name: 'data',
        type: 'T | null',
        required: true,
        description: this.translationService.translate('createAsyncState.stateData'),
      },
    ];
  });
  callbackCode = highlight(`
import {createAsyncState} from 'ngx-lift';

this.userService.getUsers().pipe(
  createAsyncState({
    next: (res) => console.log(res), // success callback
    error: (error) => console.error(error), // error callback
  }),
).subscribe();
    `);

  asyncStateCode = highlight(`
export interface AsyncState<T, E = HttpErrorResponse> {
  status: ResourceStatus;  // 'idle' | 'loading' | 'reloading' | 'resolved' | 'error'
  isLoading: boolean;
  error: E | null;
  data: T | null;
}

type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';

// For non-HTTP errors, you can override the default:
// AsyncState<Product[], Error>
  `);

  exampleCode = highlight(`
import {createAsyncState} from 'ngx-lift';
// ... other imports

@Component({
  template: \`
    <ng-container *ngIf="usersState$ | async as usersState">
      <cll-spinner *ngIf="usersState.isLoading"></cll-spinner>

      <cll-alert *ngIf="usersState.error as error" [error]="error"></cll-alert>

      <div class="card-grid" *ngIf="usersState.data as users">
        <app-user-card *ngFor="let user of users" [user]="user"></app-user-card>
      </div>
    </ng-container>
  \`,
})
export class UserCardListComponent {
  usersState$ = inject(UserService).getUsers({results: 9}).pipe(createAsyncState());
}
  `);

  exampleWithoutLoadingCode = highlight(`
import {createAsyncState} from 'ngx-lift';
import { Location } from '@angular/common';
import {noop} from 'rxjs';

import {User} from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  imports: [SpinnerComponent, AlertComponent],
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent {
  private userService = inject(UserService);
  private location = inject(Location);

  userState$ = this.userService
    .getUserById(1)
    .pipe(createAsyncState<User>(noop, {status: 'idle', isLoading: false, error: null, data: this.location.getState()}));
}
  `);

  dependentRequestsCode = highlight(`
import {createAsyncState} from 'ngx-lift';

data$ = firstCall$.pipe(
  switchMap(() => this.shopService.products$),
  createAsyncState()
);
  `);

  templateUsageCode = highlight(`
import {createAsyncState} from 'ngx-lift';

// In component:
userState$ = this.userService.getUser(id).pipe(createAsyncState());

// In template (using isLoading - recommended):
@if (userState$ | async; as state) {
  @if (state.isLoading) {
    <cll-spinner />
  }
  @if (state.error) {
    <cll-alert [error]="state.error" />
  }
  @if (state.data; as user) {
    <user-card [user]="user" />
  }
}

// Alternative: using status for granular state tracking:
@if (userState$ | async; as state) {
  @if (state.status === 'loading') {
    <p>Initial load...</p>
  }
  @if (state.status === 'reloading') {
    <p>Refreshing...</p>
  }
  @if (state.status === 'error' && state.error) {
    <cll-alert [error]="state.error" />
  }
  @if (state.status === 'resolved' && state.data; as user) {
    <user-card [user]="user" />
  }
}
  `);

  signatureCode = highlight(`
createAsyncState<T, E>(
  observerOrNextForOrigin?: Partial<TapObserver<T>> | ((value: T) => void),
  initialValue?: AsyncState<T, E>
): UnaryFunction<Observable<T>, Observable<AsyncState<T, E>>>
  `);
}
