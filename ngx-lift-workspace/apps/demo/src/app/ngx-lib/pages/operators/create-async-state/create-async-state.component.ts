import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardListComponent} from '../../../../shared/components/user-card-list/user-card-list.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-create-async-state',
  standalone: true,
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, UserCardListComponent],
  templateUrl: './create-async-state.component.html',
  styleUrl: './create-async-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAsyncStateComponent {
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
  loading: boolean;
  error: E | null;
  data: T | null;
}
  `);

  exampleCode = highlight(`
import {createAsyncState} from 'ngx-lift';
// ... other imports

@Component({
  template: \`
    <ng-container *ngIf="usersState$ | async as usersState">
      <cll-spinner *ngIf="usersState.loading"></cll-spinner>

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
  standalone: true,
  imports: [SpinnerComponent, AlertComponent],
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent {
  private userService = inject(UserService);
  private location = inject(Location);

  userState$ = this.userService
    .getUserById(1)
    .pipe(createAsyncState<User>(noop, {loading: false, error: null, data: this.location.getState()}));
}
  `);
}
