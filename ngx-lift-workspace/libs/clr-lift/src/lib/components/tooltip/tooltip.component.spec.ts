import {ComponentFixture, TestBed} from '@angular/core/testing';

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
    const spy = spyOn(component.closePopover, 'emit');

    component.closeTooltip();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit close event on window click outside the tooltip', () => {
    const spy = spyOn(component.closePopover, 'emit');

    const event = new MouseEvent('click');
    component.click(event);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit close event on escape key press', () => {
    const spy = spyOn(component.closePopover, 'emit');

    component.onEscape({} as KeyboardEvent);

    expect(spy).toHaveBeenCalledWith(true);
  });
});
