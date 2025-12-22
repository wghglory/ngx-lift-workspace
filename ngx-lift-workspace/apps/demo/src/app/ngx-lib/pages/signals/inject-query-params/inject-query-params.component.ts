import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, numberAttribute} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {computedAsync, injectQueryParams} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-inject-query-params',
  standalone: true,
  imports: [ClarityModule, JsonPipe, PageContainerComponent, CodeBlockComponent, CalloutComponent],
  templateUrl: './inject-query-params.component.html',
  styleUrl: './inject-query-params.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InjectQueryParamsComponent {
  private userService = inject(UserService);

  queryParamsKeys = injectQueryParams((params) => Object.keys(params)); // returns a signal with all keys of the query params

  searchParam = injectQueryParams('search', {initialValue: 3, transform: numberAttribute});

  users = computedAsync(() => this.userService.getUsers({results: this.searchParam()}));

  pageNumber = injectQueryParams('page', {transform: numberAttribute});

  multipliedNumber = computed(() => (this.pageNumber() || 0) * 2);

  constructor() {
    effect(() => {
      console.log(this.queryParamsKeys(), 'queryParamsKeys');
      console.log(this.searchParam(), 'searchParam');
      console.log(this.users(), 'users');
      console.log(this.pageNumber(), 'pageNumber');
      console.log(this.multipliedNumber(), 'multipliedNumber');
    });
  }

  code = highlight(`
import {injectParams} from 'ngx-lift';

export class InjectParamsComponent {
  allQueryParams = injectQueryParams();

  // returns a signal with all keys of the query params
  queryParamsKeys = injectQueryParams((params) => Object.keys(params));

  // returns a signal with "search" querystring, convert the search value to number, initial value is 3
  searchParam = injectQueryParams('search', {initialValue: 3, transform: numberAttribute});

  // whenever searchParam is changed, fetch users
  users = computedAsync(() => this.userService.getUsers({results: this.searchParam()}));

  // returns a signal with "page" querystring, convert the page value to number
  pageNumber = injectQueryParams('page', {transform: numberAttribute});

  // you can use computed with the signal returned from injectQueryParams
  multipliedNumber = computed(() => (this.pageNumber() || 0) * 2);
}
  `);
}
