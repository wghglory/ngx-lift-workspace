import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {TimepickerToggleComponent} from './timepicker-toggle.component';
import {TimepickerComponent} from './timepicker.component';

@Component({
  template: `<cll-timepicker-toggle [for]="timepicker" [disabled]="isDisabled" /> <cll-timepicker #timepicker />`,
  imports: [TimepickerToggleComponent, TimepickerComponent],
})
class TestHostComponent {
  isDisabled = false;
}

describe('TimepickerToggleComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let toggleButton: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    toggleButton = fixture.nativeElement.querySelector('button');
  });

  it('should create', () => {
    expect(toggleButton).toBeTruthy();
  });

  describe('Toggle Functionality', () => {
    it('should toggle timepicker on click', () => {
      toggleButton.click();
      fixture.detectChanges();

      // Timepicker should be open after first click
      expect(toggleButton.getAttribute('aria-pressed')).toBe('true');

      toggleButton.click();
      fixture.detectChanges();

      // Timepicker should be closed after second click
      expect(toggleButton.getAttribute('aria-pressed')).toBe('false');
    });

    it('should not toggle when disabled', () => {
      component.isDisabled = true;
      fixture.detectChanges();

      expect(toggleButton.disabled).toBe(true);

      toggleButton.click();
      fixture.detectChanges();

      expect(toggleButton.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('ARIA Attributes', () => {
    it('should have aria-label', () => {
      const ariaLabel = toggleButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    it('should update aria-pressed when toggled', () => {
      expect(toggleButton.getAttribute('aria-pressed')).toBe('false');

      toggleButton.click();
      fixture.detectChanges();

      expect(toggleButton.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled input is true', () => {
      component.isDisabled = true;
      fixture.detectChanges();

      expect(toggleButton.disabled).toBe(true);
    });

    it('should enable button when disabled input is false', () => {
      component.isDisabled = false;
      fixture.detectChanges();

      expect(toggleButton.disabled).toBe(false);
    });
  });

  describe('Icon', () => {
    it('should display clock icon by default', () => {
      const icon = toggleButton.querySelector('cds-icon');
      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('shape')).toBe('clock');
    });
  });
});
