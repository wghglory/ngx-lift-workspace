import {Component, ComponentRef, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {vi, beforeEach, afterEach} from 'vitest';

import {TooltipComponent} from './tooltip.component';
import {TooltipDirective} from './tooltip.directive';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

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
      toJSON: () => {
        // Mock implementation for getBoundingClientRect
      },
    }));

    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    TestBed.configureTestingModule({
      imports: [TooltipDirective, MockTooltipComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveElement = fixture.debugElement.query(By.directive(TooltipDirective));

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

  it('should show and hide tooltip on mouse enter and leave', async () => {
    const directive = directiveElement.injector.get(TooltipDirective);

    // Trigger mouse enter
    directive.onMouseEnter();
    fixture.detectChanges();
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();

    // Tooltip should be created
    expect(directive['tooltipComponent']).toBeTruthy();

    // Wait for positionTooltip setTimeout to complete
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(0);
    TestBed.tick();

    // Trigger mouse leave
    directive.onMouseLeave();
    fixture.detectChanges();
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(directive['cllTooltipHideDelay']());
    TestBed.tick();

    // Tooltip should be removed
    expect(directive['tooltipComponent']).toBeFalsy();
  });

  it('should handle showTooltip when content is empty', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Mock implementation
    });

    // Create a new test component with empty content
    @Component({
      template: `<div cllTooltip></div>`,
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
    } as unknown as ComponentRef<TooltipComponent>;

    directive['tooltipComponent'] = mockComponent;

    // This should not throw
    expect(() => directive['reRenderTooltip']()).not.toThrow();
  });
});

@Component({
  template: `<div cllTooltip cllTooltipContent="Tooltip content"></div>`,
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
})
class MockTooltipComponent {}
