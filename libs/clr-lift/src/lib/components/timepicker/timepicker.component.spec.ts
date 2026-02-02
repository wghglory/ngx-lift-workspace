import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {TimepickerComponent} from './timepicker.component';

describe('TimepickerComponent', () => {
  let component: TimepickerComponent;
  let fixture: ComponentFixture<TimepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimepickerComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });

    fixture = TestBed.createComponent(TimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isOpen()).toBe(false);
      expect(component.selectedTime()).toBeNull();
      expect(component.focusedIndex()).toBe(0);
    });

    it('should generate time options with default interval', () => {
      const options = component.timeOptions();
      expect(options.length).toBeGreaterThan(0);
      expect(options[0].value.getHours()).toBe(0);
      expect(options[0].value.getMinutes()).toBe(0);
    });

    it('should use custom interval', () => {
      fixture.componentRef.setInput('interval', '1h');
      fixture.detectChanges();
      const options = component.timeOptions();
      expect(options.length).toBe(24);
    });

    it('should use custom options array', () => {
      const customOptions = [
        {value: new Date(2024, 0, 1, 9, 0), label: '9:00 AM'},
        {value: new Date(2024, 0, 1, 12, 0), label: '12:00 PM'},
        {value: new Date(2024, 0, 1, 15, 0), label: '3:00 PM'},
      ];
      fixture.componentRef.setInput('options', customOptions);
      fixture.detectChanges();
      const options = component.timeOptions();
      expect(options.length).toBe(3);
      expect(options).toEqual(customOptions);
    });
  });

  describe('Open/Close/Toggle', () => {
    it('should open the dropdown', () => {
      const openedSpy = vi.fn();
      component.opened.subscribe(openedSpy);

      component.open();

      expect(component.isOpen()).toBe(true);
      expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the dropdown', () => {
      const closedSpy = vi.fn();
      component.closed.subscribe(closedSpy);

      component.isOpen.set(true);
      component.close();

      expect(component.isOpen()).toBe(false);
      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('should toggle from closed to open', () => {
      component.isOpen.set(false);
      component.toggle();
      expect(component.isOpen()).toBe(true);
    });

    it('should toggle from open to closed', () => {
      component.isOpen.set(true);
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('should not emit opened if already open', () => {
      const openedSpy = vi.fn();
      component.opened.subscribe(openedSpy);

      component.isOpen.set(true);
      component.open();

      expect(openedSpy).not.toHaveBeenCalled();
    });

    it('should not emit closed if already closed', () => {
      const closedSpy = vi.fn();
      component.closed.subscribe(closedSpy);

      component.isOpen.set(false);
      component.close();

      expect(closedSpy).not.toHaveBeenCalled();
    });
  });

  describe('Option Selection', () => {
    it('should select an option and emit event', () => {
      const timeSelectedSpy = vi.fn();
      component.timeSelected.subscribe(timeSelectedSpy);

      const options = component.timeOptions();
      const option = options[0];

      component.selectOption(option);

      expect(component.selectedTime()).toEqual(option.value);
      expect(timeSelectedSpy).toHaveBeenCalledWith(option.value);
      expect(component.isOpen()).toBe(false);
    });

    it('should not select disabled option', () => {
      const timeSelectedSpy = vi.fn();
      component.timeSelected.subscribe(timeSelectedSpy);

      const disabledOption = {
        value: new Date(2024, 0, 1, 9, 0),
        label: '9:00 AM',
        disabled: true,
      };

      component.selectOption(disabledOption);

      expect(timeSelectedSpy).not.toHaveBeenCalled();
      expect(component.selectedTime()).toBeNull();
    });

    it('should close dropdown after selection', () => {
      component.isOpen.set(true);
      const options = component.timeOptions();

      component.selectOption(options[0]);

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('writeValue', () => {
    it('should write Date value', () => {
      const date = new Date(2024, 0, 1, 14, 30);
      component.writeValue(date);
      expect(component.selectedTime()).toEqual(date);
    });

    it('should write string value', () => {
      component.writeValue('2:30 PM');
      const selected = component.selectedTime();
      expect(selected?.getHours()).toBe(14);
      expect(selected?.getMinutes()).toBe(30);
    });

    it('should clear value when null', () => {
      component.selectedTime.set(new Date(2024, 0, 1, 14, 30));
      component.writeValue(null);
      expect(component.selectedTime()).toBeNull();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should move focus down with ArrowDown', () => {
      component.focusedIndex.set(0);
      const event = new KeyboardEvent('keydown', {key: 'ArrowDown'});

      component.onKeyDown(event);

      expect(component.focusedIndex()).toBe(1);
    });

    it('should move focus up with ArrowUp', () => {
      component.focusedIndex.set(2);
      const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});

      component.onKeyDown(event);

      expect(component.focusedIndex()).toBe(1);
    });

    it('should select focused option with Enter', () => {
      const timeSelectedSpy = vi.fn();
      component.timeSelected.subscribe(timeSelectedSpy);

      component.focusedIndex.set(0);
      const options = component.timeOptions();
      const event = new KeyboardEvent('keydown', {key: 'Enter'});

      component.onKeyDown(event);

      expect(timeSelectedSpy).toHaveBeenCalledWith(options[0].value);
      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown with Escape', () => {
      component.isOpen.set(true);
      const event = new KeyboardEvent('keydown', {key: 'Escape'});

      component.onKeyDown(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should move to first option with Home', () => {
      component.focusedIndex.set(10);
      const event = new KeyboardEvent('keydown', {key: 'Home'});

      component.onKeyDown(event);

      expect(component.focusedIndex()).toBe(0);
    });

    it('should move to last option with End', () => {
      component.focusedIndex.set(0);
      const options = component.timeOptions();
      const event = new KeyboardEvent('keydown', {key: 'End'});

      component.onKeyDown(event);

      expect(component.focusedIndex()).toBe(options.length - 1);
    });

    it('should wrap around when moving down from last option', () => {
      const options = component.timeOptions();
      component.focusedIndex.set(options.length - 1);
      const event = new KeyboardEvent('keydown', {key: 'ArrowDown'});

      component.onKeyDown(event);

      expect(component.focusedIndex()).toBe(0);
    });

    it('should wrap around when moving up from first option', () => {
      const options = component.timeOptions();
      component.focusedIndex.set(0);
      const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});

      component.onKeyDown(event);

      expect(component.focusedIndex()).toBe(options.length - 1);
    });
  });

  describe('Helper Methods', () => {
    it('should identify selected option', () => {
      const date = new Date(2024, 0, 1, 14, 30);
      component.selectedTime.set(date);

      const option = {value: new Date(2024, 0, 1, 14, 30), label: '2:30 PM'};
      expect(component.isSelected(option)).toBe(true);
    });

    it('should identify focused option', () => {
      component.focusedIndex.set(5);
      expect(component.isFocused(5)).toBe(true);
      expect(component.isFocused(4)).toBe(false);
    });

    it('should get option label', () => {
      const option = {value: new Date(2024, 0, 1, 14, 30), label: '2:30 PM'};
      expect(component.getOptionLabel(option)).toBe('2:30 PM');
    });
  });

  describe('Min/Max Bounds', () => {
    it('should respect min time', () => {
      fixture.componentRef.setInput('min', '9:00 AM');
      fixture.componentRef.setInput('interval', '1h');
      fixture.detectChanges();

      const options = component.timeOptions();
      expect(options[0].value.getHours()).toBe(9);
    });

    it('should respect max time', () => {
      fixture.componentRef.setInput('max', '5:00 PM');
      fixture.componentRef.setInput('interval', '1h');
      fixture.detectChanges();

      const options = component.timeOptions();
      const lastOption = options[options.length - 1];
      expect(lastOption.value.getHours()).toBeLessThanOrEqual(17);
    });
  });

  describe('ARIA Attributes', () => {
    it('should use provided aria label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Select meeting time');
      fixture.detectChanges();

      expect(component.computedAriaLabel()).toBe('Select meeting time');
    });

    it('should use default aria label', () => {
      const label = component.computedAriaLabel();
      expect(label).toBeTruthy();
    });
  });
});
