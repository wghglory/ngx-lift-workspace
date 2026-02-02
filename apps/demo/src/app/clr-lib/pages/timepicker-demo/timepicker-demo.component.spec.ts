import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {TranslationService} from '../../../../../libs/clr-lift/src/lib/services/translation.service';
import {MockTranslationService} from '../../../../../libs/clr-lift/src/lib/services/translation.service.mock';
import {TimepickerDemoComponent} from './timepicker-demo.component';

describe('TimepickerDemoComponent', () => {
  let component: TimepickerDemoComponent;
  let fixture: ComponentFixture<TimepickerDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimepickerDemoComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });

    fixture = TestBed.createComponent(TimepickerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.basicForm).toBeTruthy();
    expect(component.intervalsForm).toBeTruthy();
    expect(component.validationForm).toBeTruthy();
    expect(component.customOptionsForm).toBeTruthy();
    expect(component.dateTimeForm).toBeTruthy();
    expect(component.customIconForm).toBeTruthy();
    expect(component.localeForm).toBeTruthy();
    expect(component.complexForm).toBeTruthy();
  });

  it('should have custom time options', () => {
    expect(component.customTimeOptions).toBeTruthy();
    expect(component.customTimeOptions.length).toBe(5);
  });

  it('should submit basic form', () => {
    component.basicForm.patchValue({time: new Date()});
    component.submitBasicForm();
    expect(component.basicForm.value.time).toBeTruthy();
  });

  it('should submit validation form', () => {
    component.validationForm.patchValue({meetingTime: new Date()});
    component.submitValidationForm();
    expect(component.validationForm.value.meetingTime).toBeTruthy();
  });

  it('should submit complex form', () => {
    component.complexForm.patchValue({
      startTime: new Date(),
      endTime: new Date(),
    });
    component.submitComplexForm();
    expect(component.complexForm.value.startTime).toBeTruthy();
  });
});
