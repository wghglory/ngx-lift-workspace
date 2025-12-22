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

    // Wait for positionTooltip setTimeout to complete
    tick();

    // Trigger mouse leave
    directive.onMouseLeave();
    fixture.detectChanges();
    tick(directive['cllTooltipHideDelay']());

    // Tooltip should be removed
    expect(directive['tooltipComponent']).toBeFalsy();
  }));

  it('should handle showTooltip when content is empty', () => {
    const directive = directiveElement.injector.get(TooltipDirective);
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Create a new test component with empty content
    @Component({
      template: `<div cllTooltip></div>`,
      standalone: true,
      imports: [TooltipDirective],
    })
    class EmptyContentComponent {}

    const emptyFixture = TestBed.createComponent(EmptyContentComponent);
    const emptyDirectiveElement = emptyFixture.debugElement.query(By.directive(TooltipDirective));
    const emptyDirective = emptyDirectiveElement.injector.get(TooltipDirective);

    emptyDirective.onMouseEnter();
    emptyFixture.detectChanges();

    // Tooltip should not be created
    expect(emptyDirective['tooltipComponent']).toBeFalsy();
    expect(consoleSpy).toHaveBeenCalledWith('Tooltip content not defined, cannot show tooltip');

    consoleSpy.mockRestore();
  });

  it('should handle reRenderTooltip safely when firstElementChild is null', () => {
    const directive = directiveElement.injector.get(TooltipDirective);

    // Trigger mouse enter to create tooltip
    directive.onMouseEnter();
    fixture.detectChanges();

    // Manually set tooltipComponent with a mock that has no firstElementChild
    const mockComponent = {
      location: {
        nativeElement: {
          firstElementChild: null,
        },
      },
      setInput: vi.fn(),
      hostView: {
        detectChanges: vi.fn(),
      },
    } as any;

    directive['tooltipComponent'] = mockComponent;

    // This should not throw
    expect(() => directive['reRenderTooltip']()).not.toThrow();
  });
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
