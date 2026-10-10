import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-testing-utilities',
  imports: [PageContainerComponent, CalloutComponent, ClarityModule, CodeBlockComponent],
  templateUrl: './testing-utilities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingUtilitiesComponent {
  installCode = highlight(`
// Import from the dedicated secondary testing entrypoint
import { ActivatedRouteMock, RouterMock, flushEffects } from 'ngx-lift/testing';
  `);

  flushEffectsCode = highlight(`
import { Component, effect, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { flushEffects } from 'ngx-lift/testing';

it('should run effect synchronously without fakeAsync/tick', () => {
  const count = signal(0);
  let logged = 0;

  TestBed.runInInjectionContext(() => {
    effect(() => {
      logged = count();
    });
  });

  count.set(5);
  flushEffects(); // Immediately executes pending effects
  expect(logged).toBe(5);
});
  `);

  routeMockCode = highlight(`
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteMock } from 'ngx-lift/testing';

describe('UserProfileComponent', () => {
  let routeMock: ActivatedRouteMock;

  beforeEach(() => {
    routeMock = new ActivatedRouteMock({ id: 'user-123' }, { tab: 'overview' });

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    });
  });

  it('should react dynamically when route params change', () => {
    // Dynamically emit new params during test
    routeMock.setParams({ id: 'user-456' });
    // Component reacting to paramMap or params automatically receives the update!
  });
});
  `);

  routerMockCode = highlight(`
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterMock } from 'ngx-lift/testing';

describe('Navigation Flow', () => {
  let routerMock: RouterMock;

  beforeEach(() => {
    routerMock = new RouterMock();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should track navigated routes and emit router events', () => {
    const navSpy = vi.spyOn(routerMock, 'navigate');
    
    // Component triggers navigation
    routerMock.navigate(['/dashboard'], { queryParams: { refresh: 'true' } });
    
    expect(navSpy).toHaveBeenCalledWith(['/dashboard'], { queryParams: { refresh: 'true' } });
    expect(routerMock.url).toBe('/dashboard');
  });
});
  `);
}
