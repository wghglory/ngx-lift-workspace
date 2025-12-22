import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ChangeDetectorRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ClarityModule, ClrTimelineStepState} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {TimelineBaseComponent} from './timeline-base.component';
import {TimelineWizardComponent} from './timeline-wizard.component';
import {TimelineWizardService} from './timeline-wizard.service';

class MockTimelineBaseComponent extends TimelineBaseComponent {}

describe('TimelineWizardComponent', () => {
  let component: TimelineWizardComponent;
  let fixture: ComponentFixture<TimelineWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimelineWizardComponent, TranslatePipe, ClarityModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [TranslationService, ChangeDetectorRef, TimelineWizardService],
    });

    fixture = TestBed.createComponent(TimelineWizardComponent);

    component = fixture.componentInstance;
    component.timelineSteps = [
      {state: ClrTimelineStepState.SUCCESS, title: 'Step 1', component: MockTimelineBaseComponent, data: {}},
      {state: ClrTimelineStepState.ERROR, title: 'Step 2', component: MockTimelineBaseComponent, data: {}},
      {state: ClrTimelineStepState.NOT_STARTED, title: 'Step 3', component: MockTimelineBaseComponent, data: {}},
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle nextStep for the last step', () => {
    spyOnProperty(component.timelineWizardService, 'isLastStep').and.returnValue(true);
    spyOn(component.confirmed, 'emit');

    component.nextStep();

    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should handle previousStep for the first step', () => {
    spyOnProperty(component.timelineWizardService, 'isFirstStep').and.returnValue(true);
    spyOn(component, 'renderComponent');

    component.previousStep();

    expect(component.renderComponent).not.toHaveBeenCalled();
  });

  it('should handle previousStep for a non-first step (live = false)', () => {
    spyOnProperty(component.timelineWizardService, 'isFirstStep').and.returnValue(false);
    spyOn(component, 'renderComponent');

    component.live = false;
    component.previousStep();

    expect(component.renderComponent).toHaveBeenCalled();
  });

  it('should handle cancel', () => {
    spyOn(component.canceled, 'emit');

    component.cancel();

    expect(component.canceled.emit).toHaveBeenCalled();
  });

  it('should handle ngAfterViewInit', () => {
    spyOn(component, 'renderComponent');

    component.ngAfterViewInit();

    expect(component.renderComponent).toHaveBeenCalled();
  });

  it('should handle renderComponent (live = false)', () => {
    spyOn(component.container(), 'clear');

    component.live = false;
    component.renderComponent();

    expect(component.container().clear).toHaveBeenCalled();
  });

  it('should handle renderComponent (live = true)', () => {
    spyOn(component.container(), 'clear');

    component.live = true;
    component.renderComponent();

    expect(component.container().clear).not.toHaveBeenCalled();
  });
});
