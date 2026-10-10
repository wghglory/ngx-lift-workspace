import {NavigationBehaviorOptions, NavigationExtras, UrlTree} from '@angular/router';
import {Subject} from 'rxjs';
import {vi} from 'vitest';

/**
 * Mock implementation of Angular's `Router` for component unit testing.
 *
 * @example
 * ```typescript
 * import { Router } from '@angular/router';
 * import { RouterMock } from 'ngx-lift/testing';
 *
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     providers: [{ provide: Router, useClass: RouterMock }]
 *   });
 * });
 * ```
 */
export class RouterMock {
  url = '/';
  events = new Subject<Event>();
  routerState = {root: {firstChild: {url: []}}};

  navigateByUrl = vi
    .fn<(url: string | UrlTree, extras?: NavigationBehaviorOptions) => Promise<boolean>>()
    .mockImplementation(() => Promise.resolve(true));

  navigate = vi
    .fn<(commands: unknown[], extras?: NavigationExtras) => Promise<boolean>>()
    .mockImplementation(() => Promise.resolve(true));

  createUrlTree = vi
    .fn<(commands: unknown[], extras?: NavigationExtras) => UrlTree>()
    .mockImplementation(() => new UrlTree());

  parseUrl = vi.fn<(url: string) => UrlTree>().mockImplementation(() => new UrlTree());

  serializeUrl = vi.fn<(url: UrlTree) => string>().mockImplementation(() => '');

  isActive = vi.fn<(url: string | UrlTree, exact: boolean) => boolean>().mockImplementation(() => true);
}
