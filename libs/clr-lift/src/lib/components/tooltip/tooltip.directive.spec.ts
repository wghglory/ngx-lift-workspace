import {flushEffects} from '../../../test-setup';
import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  DebugElement,
  EnvironmentInjector,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
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
    fixture.detectChanges();
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
    await flushEffects();

    // Tooltip should be created
    expect(directive['tooltipComponent']).toBeTruthy();

    // Wait for positionTooltip setTimeout to complete
    await flushEffects();

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
    const actualComponent = directive['tooltipComponent'];

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
    directive['tooltipComponent'] = actualComponent;
  });
  it('destroys the tooltip and removes its DOM on hide', async () => {
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    const ref = directive['tooltipComponent'];
    const host = directive.hostElement;
    expect(document.body.contains(host)).toBe(true);

    directive.onMouseLeave();
    await flushEffects();

    expect(ref?.hostView.destroyed).toBe(true);
    expect(document.body.contains(host)).toBe(false);
  });

  it('cancels deferred tooltip work and removes its view when the trigger is destroyed', () => {
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    const ref = directive['tooltipComponent'];
    const host = directive.hostElement;
    fixture.destroy();

    expect(ref?.hostView.destroyed).toBe(true);
    expect(document.body.contains(host)).toBe(false);
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
  });

  it('preserves the existing tooltip when the pointer returns during the hide delay', async () => {
    fixture.componentInstance.hideDelay.set(100);
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    const ref = directive['tooltipComponent'];
    directive.onMouseLeave();
    directive.onMouseEnter();
    await flushEffects(100);

    expect(directive['tooltipComponent']).toBe(ref);
  });

  it('attaches only one application view when show is requested twice', () => {
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    const appRef = TestBed.inject(ApplicationRef);
    const previousCount = appRef.viewCount;
    directive.showTooltip();
    const ref = directive['tooltipComponent'];
    directive.showTooltip();

    expect(directive['tooltipComponent']).toBe(ref);
    expect(appRef.viewCount).toBe(previousCount + 1);
  });

  it('reuses a caller-owned ComponentRef after hiding and showing the tooltip', async () => {
    const contentRef = createComponent(TooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    fixture.componentInstance.content.set(contentRef);
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    await flushEffects();
    directive.removeTooltip(true);
    await flushEffects();

    expect(contentRef.hostView.destroyed).toBe(false);
    expect(() => directive.onMouseEnter()).not.toThrow();
    await flushEffects();
    expect(directive.hostElement?.textContent).toContain('Borrowed content');
    fixture.destroy();
    expect(contentRef.hostView.destroyed).toBe(false);
    contentRef.destroy();
  });

  it('links tooltip content to its trigger without replacing another description', () => {
    const trigger: HTMLElement = directiveElement.nativeElement;
    trigger.setAttribute('aria-describedby', 'existing-help');
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    const tooltip: HTMLElement = directive.hostElement;

    expect(tooltip.id).not.toBe('');
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(tooltip.id);
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain('existing-help');
    directive.removeTooltip(true);
    expect(trigger.getAttribute('aria-describedby')).toBe('existing-help');
  });

  it('uses dialog relationships for interactive content and restores caller attributes', async () => {
    const contentRef = createComponent(TooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    const trigger: HTMLElement = directiveElement.nativeElement;
    trigger.setAttribute('aria-describedby', 'existing-help');
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    fixture.componentInstance.content.set(contentRef);
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.showTooltip();
    await flushEffects();
    const popup = directive.hostElement;
    expect(popup?.querySelector('[role="dialog"]')).not.toBeNull();
    expect(trigger.getAttribute('aria-controls')).toBe(popup?.id);
    expect(trigger.getAttribute('aria-describedby')).toBe('existing-help');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    directive.removeTooltip(true);
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    contentRef.destroy();
  });

  it('keeps focused help open across mouse leave and scroll, then closes on blur', async () => {
    const trigger: HTMLElement = directiveElement.nativeElement;
    trigger.tabIndex = 0;
    trigger.focus();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseLeave();
    await flushEffects();
    expect(directive.hostElement).toBeDefined();
    trigger.dispatchEvent(new Event('scroll'));
    await flushEffects();
    expect(directive.hostElement).toBeDefined();
    trigger.blur();
    await flushEffects();
    expect(directive.hostElement).toBeUndefined();
  });

  it('hides a viewport-positioned tooltip when a scroll container moves', () => {
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    const ref = directive['tooltipComponent'];
    directiveElement.nativeElement.dispatchEvent(new Event('scroll'));

    expect(ref?.hostView.destroyed).toBe(true);
    expect(directive['tooltipComponent']).toBeUndefined();
  });

  it('updates already visible tooltip content when the parent signal changes', async () => {
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    await flushEffects();
    fixture.componentInstance.content.set('Updated details');
    fixture.detectChanges();
    await flushEffects();

    expect(directive.hostElement?.textContent).toContain('Updated details');
    expect(directive.hostElement?.textContent).not.toContain('Tooltip content');
  });

  it('does not revive trigger hovering when visible content changes during the hide delay', async () => {
    fixture.componentInstance.hideDelay.set(100);
    fixture.detectChanges();
    const directive = directiveElement.injector.get(TooltipDirective);
    directive.onMouseEnter();
    await flushEffects();
    directive.onMouseLeave();
    fixture.componentInstance.content.set('Updated after leaving');
    fixture.detectChanges();

    await flushEffects(100);

    expect(directive['tooltipComponent']).toBeUndefined();
  });

  it('updates an already visible template when its context changes', async () => {
    const directive = directiveElement.injector.get(TooltipDirective);
    fixture.componentInstance.content.set(fixture.componentInstance.template());
    fixture.componentInstance.context.set({title: 'Initial context'});
    fixture.detectChanges();
    directive.onMouseEnter();
    await flushEffects();
    expect(directive.hostElement?.textContent).toContain('Initial context');
    fixture.componentInstance.context.set({title: 'Updated context'});
    fixture.detectChanges();
    await flushEffects();

    expect(directive.hostElement?.textContent).toContain('Updated context');
    expect(directive.hostElement?.textContent).not.toContain('Initial context');
  });
});

@Component({
  template: `<div
      cllTooltip
      [cllTooltipContent]="content()"
      [cllTooltipContentContext]="context()"
      [cllTooltipHideDelay]="hideDelay()"
    ></div>
    <ng-template #template let-title="title">{{ title }}</ng-template>`,
  imports: [TooltipDirective],
})
class TestComponent {
  content = signal<string | ComponentRef<TooltipContentComponent> | TemplateRef<{title: string}>>('Tooltip content');
  context = signal<Record<string, unknown> | undefined>(undefined);
  template = viewChild.required<TemplateRef<{title: string}>>('template');
  hideDelay = signal(0);
}

@Component({template: 'Borrowed content'})
class TooltipContentComponent {}

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
