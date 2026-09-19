import {ChangeDetectionStrategy, Component, computed, effect, inject, Injector, numberAttribute} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {computedAsync, injectQueryParams} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-inject-query-params',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent],
  templateUrl: './inject-query-params.component.html',
  styleUrl: './inject-query-params.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InjectQueryParamsComponent {
  private userService = inject(UserService);
  private injector = inject(Injector);

  queryParamsKeys = injectQueryParams((params) => Object.keys(params)); // returns a signal with all keys of the query params

  searchParam = injectQueryParams('search', {
    initialValue: 3,
    transform: numberAttribute,
  });

  // Decoupled Injector: Can be called outside component constructor
  customInjectorQuery = injectQueryParams('search', {injector: this.injector});

  users = computedAsync(() => this.userService.getUsers({results: this.searchParam()}));

  pageNumber = injectQueryParams('page', {transform: numberAttribute});

  multipliedNumber = computed(() => (this.pageNumber() || 0) * 2);

  constructor() {
    effect(() => {
      console.log('[injectQueryParams] queryParamsKeys:', this.queryParamsKeys());
      console.log('[injectQueryParams] searchParam:', this.searchParam());
      console.log('[injectQueryParams] users:', this.users());
      console.log('[injectQueryParams] pageNumber:', this.pageNumber());
      console.log('[injectQueryParams] multipliedNumber:', this.multipliedNumber());
      console.log('[injectQueryParams] customInjectorQuery (custom injector):', this.customInjectorQuery());
    });
  }

  allParamsCode = highlight(`
import {injectQueryParams} from 'ngx-lift';

export class MyComponent {
  // Returns a signal with all query parameters
  allQueryParams = injectQueryParams();
}
  `);

  singleParamCode = highlight(`
import {injectQueryParams} from 'ngx-lift';
import {Signal} from '@angular/core';

export class MyComponent {
  // Returns a signal with the value of the "page" query parameter
  page: Signal<string | null> = injectQueryParams('page');
}
  `);

  transformCode = highlight(`
import {injectQueryParams} from 'ngx-lift';

export class MyComponent {
  // Returns a signal with all keys of the query params
  queryParamsKeys = injectQueryParams((params) => Object.keys(params));
}
  `);

  transformWithInitialCode = highlight(`
import {injectQueryParams} from 'ngx-lift';
import {numberAttribute, Signal} from '@angular/core';

export class MyComponent {
  // Returns a signal with "search" querystring, convert to number, initial value is 3
  searchParam: Signal<number> = injectQueryParams('search', {
    initialValue: 3,
    transform: numberAttribute,
  });
}
  `);

  completeExampleCode = highlight(`
import {injectQueryParams, computedAsync} from 'ngx-lift';
import {computed} from '@angular/core';
import {numberAttribute, Signal} from '@angular/core';

export class SearchComponent {
  private userService = inject(UserService);

  // Get all query params
  allQueryParams = injectQueryParams();

  // Transform with initial value
  searchParam: Signal<number> = injectQueryParams('search', {
    initialValue: 3,
    transform: numberAttribute,
  });

  // Get single param with transform
  pageNumber: Signal<number | null> = injectQueryParams('page', {
    transform: numberAttribute,
  });

  // Use with computedAsync to fetch data when param changes
  users = computedAsync(() => this.userService.getUsers({results: this.searchParam()}));

  // Use with computed
  multipliedNumber = computed(() => (this.pageNumber() || 0) * 2);
}
  `);

  customInjectorCode = highlight(`
import {injectQueryParams} from 'ngx-lift';
import {Component, inject, Injector, Signal} from '@angular/core';

export class SearchComponent {
  private injector = inject(Injector);

  // Decoupled Injector: By passing { injector }, injectQueryParams can be called
  // outside the constructor (e.g. inside helper methods, custom composables, or services).
  searchParam: Signal<string | null> = injectQueryParams('search', {injector: this.injector});
}
  `);

  signatureCode = highlight(`
injectQueryParams(): Signal<Params>
injectQueryParams(key: string): Signal<string | null>
injectQueryParams<T>(key: string, options: InjectQueryParamsOptions<T>): Signal<T>
injectQueryParams<T>(transform: (params: Params) => T): Signal<T>
injectQueryParams<T>(transform: (params: Params) => T, options: InjectQueryParamsOptions<T>): Signal<T>
  `);
}
