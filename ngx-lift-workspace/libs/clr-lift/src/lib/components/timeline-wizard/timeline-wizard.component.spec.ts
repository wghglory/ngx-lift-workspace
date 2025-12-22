import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ChangeDetectorRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ClarityModule, ClrTimelineStepState} from '@clr/angular';
import {vi} from 'vitest';

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
      imports: [TimelineWizardComponent, TranslatePipe, ClarityModule, NoopAnimationsModule],
      providers: [
        TranslationService,
        ChangeDetectorRef,
        TimelineWizardService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
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
    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(true);
    const confirmedSpy = vi.spyOn(component.confirmed, 'emit');

    component.nextStep();

    expect(confirmedSpy).toHaveBeenCalled();
  });

  it('should handle previousStep for the first step', () => {
    vi.spyOn(component.timelineWizardService, 'isFirstStep', 'get').mockReturnValue(true);
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');

    component.previousStep();

    expect(renderComponentSpy).not.toHaveBeenCalled();
  });

  it('should handle previousStep for a non-first step (live = false)', () => {
    vi.spyOn(component.timelineWizardService, 'isFirstStep', 'get').mockReturnValue(false);
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');

    component.live = false;
    component.previousStep();

    expect(renderComponentSpy).toHaveBeenCalled();
  });

  it('should handle cancel', () => {
    const canceledSpy = vi.spyOn(component.canceled, 'emit');

    component.cancel();

    expect(canceledSpy).toHaveBeenCalled();
  });

  it('should handle ngAfterViewInit', () => {
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');

    component.ngAfterViewInit();

    expect(renderComponentSpy).toHaveBeenCalled();
  });

  it('should handle renderComponent (live = false)', () => {
    const clearSpy = vi.spyOn(component.container(), 'clear');

    component.live = false;
    component.renderComponent();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('should handle renderComponent (live = true)', () => {
    const clearSpy = vi.spyOn(component.container(), 'clear');

    component.live = true;
    component.renderComponent();

    expect(clearSpy).not.toHaveBeenCalled();
  });
});
