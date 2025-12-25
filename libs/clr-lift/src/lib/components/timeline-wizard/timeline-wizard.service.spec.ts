import {TestBed} from '@angular/core/testing';
import {ClrTimelineStepState} from '@clr/angular';
import {vi} from 'vitest';

import {TimelineBaseComponent} from './timeline-base.component';
import {TimelineStep} from './timeline-step.type';
import {TimelineWizardService} from './timeline-wizard.service';

// Mock component for testing purposes
class MockTimelineBaseComponent extends TimelineBaseComponent {}

describe('TimelineWizardService', () => {
  let service: TimelineWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineWizardService],
    });
    service = TestBed.inject(TimelineWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly retrieve step data by id and update form data', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {formData: 'value2'},
      },
    ];

    service.steps = mockSteps;

    const data = service.getStepData<{formData: string}>('Step 2');
    expect(data.formData).toEqual('value2');
  });

  it('should initialize with an empty steps array', () => {
    expect(service.steps).toEqual([]);
  });

  it('should correctly determine the current step index', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.ERROR,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 3',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];

    service.steps = mockSteps;

    expect(service.currentStepIndex).toEqual(1);
  });

  it('should correctly determine if it is the first step', () => {
    vi.spyOn(service, 'currentStepIndex', 'get').mockReturnValue(0);
    expect(service.isFirstStep).toBeTruthy();
  });

  it('should correctly determine if it is the last step', () => {
    service.steps = [
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];
    vi.spyOn(service, 'currentStepIndex', 'get').mockReturnValue(0);
    expect(service.isLastStep).toBeTruthy();
  });

  it('should correctly retrieve the current step', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];

    service.steps = mockSteps;

    expect(service.currentStep).toEqual(mockSteps[1]);
  });

  it('should correctly retrieve the data of the current step', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {exampleData: 'value'},
      },
    ];

    service.steps = mockSteps;

    expect(service.currentStepData).toEqual({exampleData: 'value'});
  });

  it('should correctly retrieve all steps data for review', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {formData: 'value2'},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 3',
        component: MockTimelineBaseComponent,
        data: {formData: 'value3'},
      },
    ];

    service.steps = mockSteps;

    expect(service.allStepsData).toEqual([
      {id: 'Step 1', data: {formData: 'value1'}},
      {id: 'Step 2', data: {formData: 'value2'}},
      {id: 'Step 3', data: {formData: 'value3'}},
    ]);
  });

  it('should correctly retrieve step data by title', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.PROCESSING,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {formData: 'value2'},
      },
    ];

    service.steps = mockSteps;

    expect(service.getStepData<{formData: string}>('Step 2')).toEqual({
      formData: 'value2',
    });
  });

  it('should throw an error when trying to retrieve step data with an invalid title', () => {
    expect(() => service.getStepData('Invalid Step')).toThrowError('Step with identifier Invalid Step not found');
  });

  it('should return -1 for currentStepIndex when no current step exists', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];

    service.steps = mockSteps;

    expect(service.currentStepIndex).toBe(-1);
  });

  it('should correctly retrieve step data by id', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        id: 'step-1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 2',
        id: 'step-2',
        component: MockTimelineBaseComponent,
        data: {formData: 'value2'},
      },
    ];

    service.steps = mockSteps;

    const data = service.getStepData<{formData: string}>('step-2');
    expect(data.formData).toEqual('value2');
  });

  it('should prioritize id over title when retrieving step data', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        id: 'step-1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 1', // Same title but different id
        id: 'step-2',
        component: MockTimelineBaseComponent,
        data: {formData: 'value2'},
      },
    ];

    service.steps = mockSteps;

    const data = service.getStepData<{formData: string}>('step-2');
    expect(data.formData).toEqual('value2');
  });

  it('should filter out steps with empty data in allStepsData', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: null as never, // Empty data
      },
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 3',
        component: MockTimelineBaseComponent,
        data: undefined as never, // Empty data
      },
    ];

    service.steps = mockSteps;

    expect(service.allStepsData).toEqual([{id: 'Step 1', data: {formData: 'value1'}}]);
  });

  it('should use id when available in allStepsData, otherwise use title', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        id: 'custom-id-1',
        component: MockTimelineBaseComponent,
        data: {formData: 'value1'},
      },
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {formData: 'value2'},
      },
    ];

    service.steps = mockSteps;

    expect(service.allStepsData).toEqual([
      {id: 'custom-id-1', data: {formData: 'value1'}},
      {id: 'Step 2', data: {formData: 'value2'}},
    ]);
  });

  it('should correctly determine currentStepIndex for PROCESSING state', () => {
    const mockSteps: TimelineStep[] = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.PROCESSING,
        title: 'Step 2',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];

    service.steps = mockSteps;

    expect(service.currentStepIndex).toBe(1);
  });

  it('should throw error when currentStep is accessed but no current step exists', () => {
    service.steps = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];

    expect(() => service.currentStep).toThrow();
  });

  it('should throw error when currentStepData is accessed but no current step exists', () => {
    service.steps = [
      {
        state: ClrTimelineStepState.SUCCESS,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ];

    expect(() => service.currentStepData).toThrow();
  });
});
