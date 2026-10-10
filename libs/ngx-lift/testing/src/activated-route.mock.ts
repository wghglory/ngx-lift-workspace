import {BehaviorSubject} from 'rxjs';

/**
 * Mock implementation of Angular's `ActivatedRoute` for reactive component unit testing.
 *
 * @example
 * ```typescript
 * import { ActivatedRoute } from '@angular/router';
 * import { ActivatedRouteMock } from 'ngx-lift/testing';
 *
 * let routeMock: ActivatedRouteMock;
 *
 * beforeEach(() => {
 *   routeMock = new ActivatedRouteMock();
 *   routeMock.setParams({ id: '123' });
 *
 *   TestBed.configureTestingModule({
 *     providers: [{ provide: ActivatedRoute, useValue: routeMock }]
 *   });
 * });
 * ```
 */
export class ActivatedRouteMock {
  private testParams: Record<string, string> = {};
  private testQueryParams: Record<string, string> = {};

  private paramsSubject = new BehaviorSubject<Record<string, string>>(this.testParams);
  private queryParamsSubject = new BehaviorSubject<Record<string, string>>(this.testQueryParams);

  params = this.paramsSubject.asObservable();
  queryParams = this.queryParamsSubject.asObservable();

  get snapshot() {
    return {
      params: this.testParams,
      queryParams: this.testQueryParams,
      paramMap: {
        get: (key: string): string | null => this.testParams[key] ?? null,
        has: (key: string): boolean => key in this.testParams,
        getAll: (key: string): string[] => (this.testParams[key] ? [this.testParams[key]] : []),
        keys: Object.keys(this.testParams),
      },
      queryParamMap: {
        get: (key: string): string | null => this.testQueryParams[key] ?? null,
        has: (key: string): boolean => key in this.testQueryParams,
        getAll: (key: string): string[] => (this.testQueryParams[key] ? [this.testQueryParams[key]] : []),
        keys: Object.keys(this.testQueryParams),
      },
    };
  }

  get parent(): ActivatedRouteMock {
    return this;
  }

  setParams(params: Record<string, string>): void {
    this.testParams = params;
    this.paramsSubject.next(params);
  }

  setQueryParams(queryParams: Record<string, string>): void {
    this.testQueryParams = queryParams;
    this.queryParamsSubject.next(queryParams);
  }
}
