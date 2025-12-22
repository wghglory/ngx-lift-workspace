import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {UserDatagridComponent} from '../../shared/components/user-datagrid/user-datagrid.component';

@Component({
  selector: 'app-dg-state',
  standalone: true,
  imports: [
    ClarityModule,
    RouterLink,
    PageContainerComponent,
    AlertComponent,
    CodeBlockComponent,
    CalloutComponent,
    UserDatagridComponent,
  ],
  templateUrl: './dg-state.component.html',
  styleUrl: './dg-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DgStateComponent {
  dataCode = highlight(`
{
  "results": [
    {
      "gender": "male",
      "name": {
        "first": "Johan",
        "last": "Lemoine"
      },
      "email": "john@gmail.com"
    }
    // ... more users
  ],
  "info": {
    "pageSize": 10, // display 10 items per page
    "page": 2, // current page is 2
    "total": 100
  }
}
  `);

  htmlCode = highlight(
    `
<!-- angular v17+ user-datagrid.component.html -->
@if ({usersState: usersState$ | async, total: total$ | async}; as vm) {
  <button class="btn btn-outline" (click)="userService.refreshList()" [disabled]="vm.usersState?.loading">
    Refresh
  </button>

  <clr-datagrid
    class="min-h-[200px]"
    (clrDgRefresh)="refresh($event)"
    [clrDgLoading]="vm.usersState?.loading === true"
    [(clrDgSingleSelected)]="selectedItem"
  >
    <clr-dg-column [clrDgField]="'firstName'">First Name</clr-dg-column>
    <clr-dg-column [clrDgField]="'lastName'">Last Name</clr-dg-column>
    <clr-dg-column [clrDgField]="'email'">Email</clr-dg-column>
    <clr-dg-column [clrDgField]="'gender'">Gender</clr-dg-column>

    <clr-dg-placeholder>No data found</clr-dg-placeholder>

    @for (user of vm.usersState?.data?.results; track user.id.value) {
      <clr-dg-row [clrDgItem]="user">
        <clr-dg-cell>{{ user.name.first }}</clr-dg-cell>
        <clr-dg-cell>{{ user.name.last }}</clr-dg-cell>
        <clr-dg-cell>{{ user.email }}</clr-dg-cell>
        <clr-dg-cell>{{ user.gender }}</clr-dg-cell>
      </clr-dg-row>
    }

    <clr-dg-footer>
      @if (!vm.total) {
        No items
      } @else {
        {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ vm.total }} items
      }
      <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="vm.total || 0" />
    </clr-dg-footer>
  </clr-datagrid>

  @if (vm.usersState?.error; as error) {
    <cll-alert [error]="error" class="mb-4" />
  }
}
  `,
  );

  secondHtmlCode = highlight(`
<div>
  <button class="btn btn-outline" (click)="userService.refreshList()" [disabled]="(usersState$ | async)?.loading">
    Refresh
  </button>
</div>

<clr-datagrid
  class="min-h-[200px]"
  (clrDgRefresh)="refresh($event)"
  [clrDgLoading]="(usersState$ | async)?.loading === true"
  [(clrDgSingleSelected)]="selectedItem"
>
  <clr-dg-column [clrDgField]="'firstName'">First Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'lastName'">Last Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'email'">Email</clr-dg-column>
  <clr-dg-column [clrDgField]="'gender'">Gender</clr-dg-column>

  <clr-dg-placeholder>No data found</clr-dg-placeholder>

  @for (user of (usersState$ | async)?.data?.results; track user.id.value) {
    <clr-dg-row [clrDgItem]="user">
      <clr-dg-cell>{{ user.name.first }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name.last }}</clr-dg-cell>
      <clr-dg-cell>{{ user.email }}</clr-dg-cell>
      <clr-dg-cell>{{ user.gender }}</clr-dg-cell>
    </clr-dg-row>
  }

  <clr-dg-footer>
    @if (total$ | async) {
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ total$ | async }} items
    } @else {
      No items
    }
    <clr-dg-pagination #pagination [clrDgPageSize]="10" [clrDgTotalItems]="(total$ | async) || 0" />
  </clr-dg-footer>
</clr-datagrid>

@if ((usersState$ | async)?.error; as error) {
  <cll-alert [error]="error" class="mb-4" />
}
    `);

  typescriptCode = highlight(
    `
// user-datagrid.component.ts
import {AlertComponent, convertToHttpParams, dgState, PageContainerComponent} from 'clr-lift';
import {AsyncState, createAsyncState} from 'ngx-lift';
// ... other imports

export class UserDatagridComponent {
  selectedItem: User | undefined;

  userService = inject(UserService);

  private dgBS = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  // When the dgState parameter is set to false, it signals the execution of an API call even when the current state is identical to the previous state.
  // Conversely, emission is suppressed when dgState is true, thanks to the application of distinctUntilChanged.
  private dgState$ = this.dgBS.pipe(dgState(false));

  usersState$ = combineLatest([this.dgState$, this.userService.refresh$]).pipe(
    switchMap(([state]) => {
      const params = convertToHttpParams(state); // if convertToHttpParams doesn't fit your need, use your own utils to convert state
      return this.userService.getUsers(params).pipe(createAsyncState());
    }),
    share(),
  );

  total$ = this.usersState$.pipe(
    filter((state) => Boolean(state.data)),
    distinctUntilChanged<AsyncState<PaginationResponse<User>, HttpErrorResponse>>(isEqual),
    map((res) => res.data?.info?.total),
  );

  refresh(state: ClrDatagridStateInterface) {
    this.dgBS.next(state);
  }
}
`,
  );
}
