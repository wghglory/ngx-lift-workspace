import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { TooltipDirective } from './tooltip.directive';

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(() => {
    // Mock getBoundingClientRect for elements
    const mockGetBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    TestBed.configureTestingModule({
      imports: [TooltipDirective, MockTooltipComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(TooltipDirective),
    );

    // Ensure the actual element used by the directive has getBoundingClientRect
    const nativeElement = directiveElement.nativeElement;
    if (!nativeElement.getBoundingClientRect) {
      Object.defineProperty(nativeElement, 'getBoundingClientRect', {
        value: mockGetBoundingClientRect,
        writable: true,
        configurable: true,
      });
    }
  });

  it('should create an instance', () => {
    const directive = directiveElement.injector.get(TooltipDirective);
    expect(directive).toBeTruthy();
  });

  it('should show and hide tooltip on mouse enter and leave', fakeAsync(() => {
    const directive = directiveElement.injector.get(TooltipDirective);

    // Trigger mouse enter
    directive.onMouseEnter();
    fixture.detectChanges();
    tick();

    // Tooltip should be created
    expect(directive['tooltipComponent']).toBeTruthy();

    // Trigger mouse leave
    directive.onMouseLeave();
    fixture.detectChanges();
    tick(directive['cllTooltipHideDelay']());

    // Tooltip should be removed
    expect(directive['tooltipComponent']).toBeFalsy();
  }));
});

@Component({
  template: `<div cllTooltip cllTooltipContent="Tooltip content"></div>`,
  standalone: true,
  imports: [TooltipDirective],
})
class TestComponent {}

@Component({
  selector: 'cll-tooltip',
  template: `
    <a>
      <span class="tooltip-content">
        <span [innerHtml]="text"></span>
      </span>
    </a>
  `,
  standalone: true,
})
class MockTooltipComponent {}
