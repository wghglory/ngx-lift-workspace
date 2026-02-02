import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {describe, it, expect, beforeEach} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {TimepickerInputDirective} from './timepicker-input.directive';
import {TimepickerComponent} from './timepicker.component';

@Component({
  template: `
    <input [cllTimepicker]="timepicker" [formControl]="timeControl" />
    <cll-timepicker #timepicker />
  `,
  imports: [ReactiveFormsModule, TimepickerInputDirective, TimepickerComponent],
})
class TestHostComponent {
  timeControl = new FormControl();
}

describe('TimepickerInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inputElement = fixture.nativeElement.querySelector('input');
  });

  it('should create', () => {
    expect(inputElement).toBeTruthy();
  });

  describe('ARIA Attributes', () => {
    it('should set combobox role', () => {
      expect(inputElement.getAttribute('role')).toBe('combobox');
    });

    it('should set aria-expanded to false initially', () => {
      expect(inputElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-haspopup', () => {
      expect(inputElement.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should set autocomplete to off', () => {
      expect(inputElement.getAttribute('autocomplete')).toBe('off');
    });
  });

  describe('Form Control Integration', () => {
    it('should update form control when time is entered', () => {
      inputElement.value = '2:30 PM';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const value = component.timeControl.value;
      expect(value).toBeTruthy();
      expect(value?.getHours()).toBe(14);
      expect(value?.getMinutes()).toBe(30);
    });

    it('should update input when form control value changes', () => {
      const date = new Date(2024, 0, 1, 14, 30);
      component.timeControl.setValue(date);
      fixture.detectChanges();

      expect(inputElement.value).toBeTruthy();
      expect(inputElement.value).toContain('2:30');
    });

    it('should clear input when form control is cleared', () => {
      component.timeControl.setValue(new Date(2024, 0, 1, 14, 30));
      fixture.detectChanges();

      component.timeControl.setValue(null);
      fixture.detectChanges();

      expect(inputElement.value).toBe('');
    });
  });

  describe('Validation', () => {
    it('should not trigger parse error for empty value', () => {
      component.timeControl.setValue('');
      component.timeControl.updateValueAndValidity();

      expect(component.timeControl.errors).toBeNull();
    });

    it('should validate valid time strings', () => {
      inputElement.value = '2:30 PM';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      component.timeControl.updateValueAndValidity();
      expect(component.timeControl.errors).toBeNull();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown on ArrowDown', () => {
      inputElement.focus();
      const event = new KeyboardEvent('keydown', {key: 'ArrowDown'});
      inputElement.dispatchEvent(event);
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('should close dropdown on Escape', () => {
      inputElement.focus();
      // Open first
      inputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
      fixture.detectChanges();

      // Then close
      inputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
