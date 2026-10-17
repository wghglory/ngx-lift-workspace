import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {UserDatagridComponent} from '../../shared/components/user-datagrid/user-datagrid.component';

@Component({
  selector: 'app-dg-state',
  imports: [
    ClarityModule,
    DemoPlaygroundComponent,
    RouterLink,
    PageContainerComponent,
    CodeBlockComponent,
    CalloutComponent,
    UserDatagridComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './dg-state.component.html',
  styleUrl: './dg-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DgStateComponent {
  private translationService = inject(TranslationService);

  paramProps = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'enableDistinctUntilChanged',
        type: 'boolean',
        default: 'true',
        description: this.translationService.translate('dgState.paramDesc'),
      },
    ];
  });
  dataCode = highlight(`{
  "results": [
    {
      "gender": "male",
      "name": {
        "first": "Johan",
        "last": "Lemoine",
      },
      "email": "john@gmail.com",
    },
    // ... more users
  ],
  "info": {
    "pageSize": 10, // display 10 items per page
    "page": 2, // current page is 2
    "total": 100,
  },
}`);

  signatureCode = highlight(`dgState(
  enableDistinctUntilChanged?: boolean,
): UnaryFunction<Observable<ClrDatagridStateInterface | null>, Observable<ClrDatagridStateInterface | null>>;`);

  htmlCode = highlight(
    `
<!-- angular v17+ user-datagrid.component.html -->
@if ({usersState: usersState$ | async, total: total$ | async}; as vm) {
  <button class="btn btn-outline" (click)="userService.refreshList()" [disabled]="vm.usersState?.isLoading">
    Refresh
  </button>

  <clr-datagrid
    class="min-h-[200px]"
    (clrDgRefresh)="refresh($event)"
    [clrDgLoading]="vm.usersState?.isLoading === true"
    [clrDgSelectionType]="'single'"
    [(clrDgSelected)]="selectedItems"
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
    <cll-alert [error]="error" cds-layout="m-b:md" />
  }
}
  `,
  );

  secondHtmlCode = highlight(`
<div>
  <button class="btn btn-outline" (click)="userService.refreshList()" [disabled]="(usersState$ | async)?.isLoading">
    Refresh
  </button>
</div>

<clr-datagrid
  class="min-h-[200px]"
  (clrDgRefresh)="refresh($event)"
  [clrDgLoading]="(usersState$ | async)?.isLoading === true"
  [clrDgSelectionType]="'single'"
  [(clrDgSelected)]="selectedItems"
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
  <cll-alert [error]="error" cds-layout="m-b:md" />
}
    `);

  typescriptCode = highlight(`import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ClarityModule, ClrDatagridStateInterface} from '@clr/angular';
import {AlertComponent, convertToHttpParams, dgState, TranslatePipe} from 'clr-lift';
import {AsyncState, createAsyncState, isEqual} from 'ngx-lift';
import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, share, switchMap} from 'rxjs';

import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-user-datagrid',
  imports: [CommonModule, ClarityModule, AlertComponent, TranslatePipe],
  templateUrl: './user-datagrid.component.html',
  styleUrl: './user-datagrid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDatagridComponent {
  selectedItems: User[] = [];

  userService = inject(UserService);

  private dgBS = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  private dgState$ = this.dgBS.pipe(dgState(false)); // When the dgState parameter is set to false, it signals the execution of an API call even when the current state is identical to the previous state. Conversely, emission is suppressed when dgState is true, thanks to the application of distinctUntilChanged.

  usersState$ = combineLatest([this.dgState$, this.userService.refresh$]).pipe(
    switchMap(([state]) => {
      const params = convertToHttpParams(state);
      return this.userService.getUsers({...params, results: 10, seed: 'abc'}).pipe(createAsyncState());
    }),
    share(),
  );

  total$ = this.usersState$.pipe(
    filter((state) => Boolean(state.data)),
    distinctUntilChanged<AsyncState<PaginationResponse<User>, HttpErrorResponse>>(isEqual),
    map((res) => res.data?.info?.total || 0),
  );

  refresh(state: ClrDatagridStateInterface) {
    this.dgBS.next(state);
  }
}`);
}
