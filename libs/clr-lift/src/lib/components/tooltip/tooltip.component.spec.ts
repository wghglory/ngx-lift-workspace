import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {vi} from 'vitest';

import {TooltipComponent} from './tooltip.component';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set text content', () => {
    const text = 'Test Content';
    component.content = text;

    expect(component.text).toEqual(text);
  });

  it('should emit close event when closeTooltip is called', () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    component.closeTooltip();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit close event on window click outside the tooltip', () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    // Create a clickable element outside the tooltip
    const outsideElement = document.createElement('button');
    const event = new MouseEvent('click', {bubbles: true});
    Object.defineProperty(event, 'target', {value: outsideElement, writable: false});

    component.click(event);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should not emit close event on click inside tooltip', () => {
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

  it('should emit close event on escape key press', () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    component.onEscape({} as KeyboardEvent);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should handle mouseEnter', () => {
    component.mouseEnter(new MouseEvent('mouseenter'));
    expect(component.tooltipHovering).toBe(true);
  });

  it('should handle mouseLeave and emit close after delay if trigger not hovering', fakeAsync(() => {
    const spy = vi.spyOn(component.closePopover, 'emit');
    fixture.componentRef.setInput('triggerElementHovering', false);

    component.mouseLeave(new MouseEvent('mouseleave'));
    expect(component.tooltipHovering).toBe(false);

    tick(300);
    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should not emit close on mouseLeave if trigger element is hovering', fakeAsync(() => {
    const spy = vi.spyOn(component.closePopover, 'emit');
    fixture.componentRef.setInput('triggerElementHovering', true);

    component.mouseLeave(new MouseEvent('mouseleave'));
    expect(component.tooltipHovering).toBe(false);

    tick(300);
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should handle null event target in click handler', () => {
    const spy = vi.spyOn(component.closePopover, 'emit');

    const event = {target: null} as unknown as MouseEvent;
    component.click(event);

    expect(spy).not.toHaveBeenCalled();
  });
});
