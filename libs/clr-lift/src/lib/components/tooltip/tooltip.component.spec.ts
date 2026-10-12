import {flushEffects} from '../../../test-setup';
import {ApplicationRef, Component, createComponent, EnvironmentInjector, input, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {vi, beforeEach, afterEach} from 'vitest';

import {TooltipComponent} from './tooltip.component';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TooltipComponent],
    });
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should set text content', async () => {
    const text = 'Test Content';
    fixture.componentRef.setInput('content', text);
    fixture.detectChanges();

    expect(component.text()).toEqual(text);
  });

  it('should emit close event when closeTooltip is called', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    component.closeTooltip();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit close event on window click outside the tooltip', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    // Create a clickable element outside the tooltip
    const outsideElement = document.createElement('button');
    const event = new MouseEvent('click', {bubbles: true});
    Object.defineProperty(event, 'target', {value: outsideElement, writable: false});

    component.click(event);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should not emit close event on click inside tooltip', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    // Mock tooltipChildren to contain the target
    const mockElement = document.createElement('div');
    Object.defineProperty(component, 'tooltipChildren', {
      get: () => {
        const collection = document.createDocumentFragment();
        collection.appendChild(mockElement);
        return collection.children;
      },
    });

    const event = new MouseEvent('click', {bubbles: true});
    Object.defineProperty(event, 'target', {value: mockElement, writable: false});

    component.click(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('keeps real non-interactive text content open when clicked', () => {
    fixture.componentRef.setInput('content', 'Plain content');
    fixture.detectChanges();
    const closed = vi.spyOn(component.closePopover, 'emit');
    const target: unknown = fixture.nativeElement.querySelector('.tooltip-content span');
    expect(target).toBeInstanceOf(Element);
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', {value: target});

    component.click(event);

    expect(closed).not.toHaveBeenCalled();
  });

  it('should emit close event on escape key press', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    component.onEscape();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should handle mouseEnter', async () => {
    component.mouseEnter();
    expect(component.tooltipHovering).toBe(true);
  });

  it('should handle mouseLeave and emit close after delay if trigger not hovering', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');
    fixture.componentRef.setInput('triggerElementHovering', false);

    component.mouseLeave();
    expect(component.tooltipHovering).toBe(false);

    await flushEffects(300);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should not emit close on mouseLeave if trigger element is hovering', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');
    fixture.componentRef.setInput('triggerElementHovering', true);

    component.mouseLeave();
    expect(component.tooltipHovering).toBe(false);

    await flushEffects(300);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle null event target in click handler', async () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    const event = {target: null} as unknown as MouseEvent;
    component.click(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('replaces text with dynamically created content without retaining stale text', async () => {
    fixture.componentRef.setInput('content', 'Old text');
    fixture.detectChanges();
    fixture.componentRef.setInput('content', DynamicTooltipContentComponent);
    fixture.detectChanges();
    await flushEffects();

    expect(fixture.nativeElement.textContent).toContain('Dynamic content');
    expect(fixture.nativeElement.textContent).not.toContain('Old text');
    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Close');
  });

  it('releases the old dynamic view when content changes and destroys owned content on teardown', async () => {
    fixture.componentRef.setInput('content', DynamicTooltipContentComponent);
    fixture.detectChanges();
    await flushEffects();
    const view = component.contentContainer()?.get(0);
    expect(view).toBeDefined();
    fixture.componentRef.setInput('content', 'New text');
    fixture.detectChanges();

    expect(view?.destroyed).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('New text');
    fixture.componentRef.setInput('content', DynamicTooltipContentComponent);
    fixture.detectChanges();
    await flushEffects();
    const ownedView = component.contentContainer()?.get(0);
    fixture.destroy();
    expect(ownedView?.destroyed).toBe(true);
  });

  it('renders later input and signal changes in detached caller-owned content', async () => {
    const contentRef = createComponent(ReactiveTooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    const appRef = TestBed.inject(ApplicationRef);
    const viewCount = appRef.viewCount;
    fixture.componentRef.setInput('content', contentRef);
    fixture.detectChanges();
    await flushEffects();
    expect(fixture.nativeElement.textContent).toContain('Initial 0');

    contentRef.setInput('label', 'Updated');
    contentRef.instance.count.set(1);
    TestBed.tick();

    expect(fixture.nativeElement.textContent).toContain('Updated 1');
    expect(appRef.viewCount).toBe(viewCount);
    fixture.destroy();
    expect(contentRef.hostView.destroyed).toBe(false);
    contentRef.destroy();
  });

  it('preserves application attachment of borrowed component content', async () => {
    const contentRef = createComponent(ReactiveTooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    const appRef = TestBed.inject(ApplicationRef);
    appRef.attachView(contentRef.hostView);
    const viewCount = appRef.viewCount;
    fixture.componentRef.setInput('content', contentRef);
    fixture.detectChanges();
    await flushEffects();
    expect(appRef.viewCount).toBe(viewCount);
    fixture.destroy();
    expect(appRef.viewCount).toBe(viewCount);
    expect(contentRef.hostView.destroyed).toBe(false);
    appRef.detachView(contentRef.hostView);
    contentRef.destroy();
  });

  it('does not destroy caller-owned content when its fixture is destroyed', async () => {
    const contentRef = createComponent(DynamicTooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    fixture.componentRef.setInput('content', contentRef);
    fixture.detectChanges();
    await flushEffects();
    fixture.destroy();

    expect(contentRef.hostView.destroyed).toBe(false);
    contentRef.destroy();
  });

  it('does not restore borrowed DOM after its caller has destroyed the component', async () => {
    const parent = document.createElement('section');
    document.body.appendChild(parent);
    const contentRef = createComponent(DynamicTooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    const element: unknown = contentRef.location.nativeElement;
    if (!(element instanceof Element)) {
      throw new Error('Expected a component host element');
    }
    parent.appendChild(element);
    fixture.componentRef.setInput('content', contentRef);
    fixture.detectChanges();
    await flushEffects();
    expect(fixture.nativeElement.contains(element)).toBe(true);
    contentRef.destroy();

    fixture.componentRef.setInput('content', 'Replacement');
    fixture.detectChanges();

    expect(contentRef.hostView.destroyed).toBe(true);
    expect(parent.contains(element)).toBe(false);
    expect(fixture.nativeElement.contains(element)).toBe(false);
    parent.remove();
  });

  it('does not schedule change detection for borrowed content destroyed before insertion', async () => {
    const contentRef = createComponent(DynamicTooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    const detectChanges = vi.spyOn(contentRef.changeDetectorRef, 'detectChanges');
    fixture.componentRef.setInput('content', contentRef);
    fixture.detectChanges();
    contentRef.destroy();

    await flushEffects();

    expect(detectChanges).not.toHaveBeenCalled();
  });

  it('closes when clicking a nested icon inside an interactive button', () => {
    const closed = vi.spyOn(component.closePopover, 'emit');
    const button = document.createElement('button');
    const icon = document.createElement('span');
    button.appendChild(icon);
    fixture.nativeElement.querySelector('a').appendChild(button);
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', {value: icon});
    component.click(event);

    expect(closed).toHaveBeenCalledWith(true);
  });

  it('inserts borrowed component content as a sibling outside the floated close-btn container', async () => {
    const contentRef = createComponent(DynamicTooltipContentComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    const element: unknown = contentRef.location.nativeElement;
    fixture.componentRef.setInput('content', contentRef);
    fixture.detectChanges();
    await flushEffects();

    const container = fixture.nativeElement.querySelector('.content-container');
    expect(container).toBeDefined();
    expect(container.contains(element)).toBe(false);
    expect(fixture.nativeElement.contains(element)).toBe(true);
    expect(container.nextElementSibling).toBe(element);
    contentRef.destroy();
  });
});

@Component({template: 'Dynamic content'})
class DynamicTooltipContentComponent {}

@Component({template: '{{ label() }} {{ count() }}'})
class ReactiveTooltipContentComponent {
  label = input('Initial');
  count = signal(0);
}
