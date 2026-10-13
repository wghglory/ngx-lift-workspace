import {flushEffects} from '../../../test-setup';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpErrorResponse} from '@angular/common/http';
import {ClarityModule, ClrTimelineStepState} from '@clr/angular';
import {delay, of, Subject, Subscription, throwError} from 'rxjs';
import {vi, beforeEach, afterEach} from 'vitest';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {TimelineBaseComponent} from './timeline-base.component';
import {TimelineWizardComponent} from './timeline-wizard.component';
import {TimelineWizardService} from './timeline-wizard.service';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

@Component({template: ''})
class MockTimelineBaseComponent extends TimelineBaseComponent {
  override form = new FormGroup({
    field1: new FormControl(''),
  });

  override next$ = of(true);
}

describe('TimelineWizardComponent', () => {
  let component: TimelineWizardComponent;
  let fixture: ComponentFixture<TimelineWizardComponent>;
  let nextSubscription: Subscription | null = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimelineWizardComponent, TranslatePipe, ClarityModule, NoopAnimationsModule, ReactiveFormsModule],
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
    fixture.componentRef.setInput('timelineSteps', [
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 1',
        component: MockTimelineBaseComponent,
        data: {field1: 'value1'},
      },
      {state: ClrTimelineStepState.NOT_STARTED, title: 'Step 2', component: MockTimelineBaseComponent, data: {}},
      {state: ClrTimelineStepState.NOT_STARTED, title: 'Step 3', component: MockTimelineBaseComponent, data: {}},
    ]);
    fixture.detectChanges();

    // Subscribe to next$ observable to ensure it's active
    // Add error handling to prevent unhandled errors when component ref is not available
    nextSubscription = component.next$.subscribe({
      error: (err) => {
        // Silently handle errors that occur when component ref is not available
        // This can happen in test scenarios where the component isn't fully initialized
        if (err instanceof Error && err.message === 'Current component reference is not available') {
          // Expected error in some test scenarios, ignore it
          return;
        }
        // Re-throw unexpected errors
        throw err;
      },
    });
  });

  afterEach(() => {
    // Clean up subscription to prevent unhandled errors
    if (nextSubscription) {
      nextSubscription.unsubscribe();
      nextSubscription = null;
    }
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should handle nextStep for the last step', async () => {
    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(true);
    const confirmedSpy = vi.spyOn(component.confirmed, 'emit');

    component.nextStep();

    expect(confirmedSpy).toHaveBeenCalled();
  });

  it('should handle nextStep for non-last step', async () => {
    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(false);
    const nextActionSpy = vi.spyOn(component['nextAction'], 'next');

    component.nextStep();

    expect(nextActionSpy).toHaveBeenCalled();
  });

  it('should handle previousStep for the first step', async () => {
    vi.spyOn(component.timelineWizardService, 'isFirstStep', 'get').mockReturnValue(true);
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');

    component.previousStep();

    expect(renderComponentSpy).not.toHaveBeenCalled();
  });

  it('renders the previous component when navigating back with live disabled', async () => {
    fixture.componentRef.setInput('live', false);
    await flushEffects();
    component.nextStep();
    await flushEffects();
    const secondRef = component.currentComponentRef;
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');

    component.previousStep();

    expect(renderComponentSpy).toHaveBeenCalledOnce();
    expect(secondRef?.hostView.destroyed).toBe(true);
    expect(component.timelineWizardService.currentStepIndex).toBe(0);
  });

  it('navigates back to the same live component without recreating its form', async () => {
    fixture.componentRef.setInput('live', true);
    await flushEffects();
    const firstRef = component.currentComponentRef;
    component.nextStep();
    await flushEffects();
    const secondRef = component.currentComponentRef;
    expect(component.timelineWizardService.currentStepIndex).toBe(1);

    component.previousStep();
    expect(component.currentComponentRef).toBe(firstRef);
    expect(firstRef?.location.nativeElement.style.display).toBe('block');
    expect(secondRef?.location.nativeElement.style.display).toBe('none');
  });

  it('should handle cancel', async () => {
    const canceledSpy = vi.spyOn(component.canceled, 'emit');

    component.cancel();

    expect(canceledSpy).toHaveBeenCalled();
  });

  it('should handle ngAfterViewInit', async () => {
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');
    const detectChangesSpy = vi.spyOn(component['cdr'], 'detectChanges');

    component.ngAfterViewInit();

    expect(renderComponentSpy).toHaveBeenCalled();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should handle renderComponent (live = false)', async () => {
    const clearSpy = vi.spyOn(component.container(), 'clear');

    fixture.componentRef.setInput('live', false);
    component.renderComponent();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('should handle renderComponent (live = true)', async () => {
    const clearSpy = vi.spyOn(component.container(), 'clear');

    fixture.componentRef.setInput('live', true);
    component.renderComponent();

    expect(clearSpy).not.toHaveBeenCalled();
  });

  it('should initialize component with form data', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    fixture.detectChanges(); // Let Angular initialize the component
    await flushEffects(1);
    fixture.detectChanges(); // Let change detection run after patchValue

    const currentRef = component.currentComponentRef;
    expect(currentRef).toBeDefined();
    if (currentRef) {
      expect(currentRef.instance.form).toBeDefined();
      // The form.patchValue should have been called with dataToFormValue result
      // dataToFormValue({field1: 'value1'}) should return {field1: 'value1'}
      // So patchValue({field1: 'value1'}) should set field1 to 'value1'
      // The patchValue is called in setTimeout(0), so we need to wait for it
      // Since we already ticked(1), the setTimeout should have executed
      // The form should have the control and the value should be set
      expect(currentRef.instance.form?.get('field1')?.value).toBe('value1');
    }
  });

  it('should sync form value changes to step data', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects();

    const currentRef = component.currentComponentRef;
    if (currentRef && currentRef.instance.form) {
      currentRef.instance.form.get('field1')?.setValue('new value');
      await flushEffects(400);

      const currentStep = component.timelineWizardService.steps[component.timelineWizardService.currentStepIndex];
      expect(currentStep.data).toEqual({field1: 'new value'});
    }
  });

  it('should handle next$ observable with success', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects();

    const currentRef = component.currentComponentRef;
    if (currentRef) {
      vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(false);
      const moveToNextStepSpy = vi.spyOn(component as never, 'moveToNextStep');

      component.nextStep();
      await flushEffects();

      expect(moveToNextStepSpy).toHaveBeenCalled();
    }
  });

  it('should handle next$ observable with error', async () => {
    @Component({template: ''})
    class ErrorComponent extends TimelineBaseComponent {
      override form = new FormGroup({
        field1: new FormControl(''),
      });
      override next$ = throwError(() => new HttpErrorResponse({error: 'Test error', status: 500}));
    }

    fixture.componentRef.setInput('timelineSteps', [
      {state: ClrTimelineStepState.CURRENT, title: 'Step 1', component: ErrorComponent, data: {}},
    ]);
    fixture.detectChanges();
    // Ensure ngAfterViewInit has been called so the container is available
    component.ngAfterViewInit();
    fixture.detectChanges();

    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects(1);
    fixture.detectChanges();

    // Ensure component ref exists and is properly set up in componentRefMap
    const currentStepIndex = component.timelineWizardService.currentStepIndex;
    expect(currentStepIndex).toBe(0);
    const currentRef = component.currentComponentRef;
    expect(currentRef).toBeDefined();
    expect(currentRef?.instance).toBeDefined();
    // Verify the ref is stored in componentRefMap at the correct index
    expect(component['componentRefMap'][currentStepIndex]).toBe(currentRef);
    // Also verify that currentComponentRef getter returns the same ref
    expect(component.currentComponentRef).toBe(currentRef);

    // The next$ subscription from beforeEach is unsubscribed by renderComponent()
    // So we need to resubscribe
    const errorSubscription = component.next$.subscribe({
      error: () => {
        // Error is expected, handled by setStepAsError
      },
    });

    component.nextStep();
    await flushEffects(100);
    fixture.detectChanges();

    const currentStep = component.timelineWizardService.steps[currentStepIndex];
    expect(currentStep.state).toBe(ClrTimelineStepState.ERROR);
    expect(currentStep.description).toContain('500');

    errorSubscription.unsubscribe();
  });

  it('should finish wizard on last step', async () => {
    // Ensure ngAfterViewInit has been called so the container is available
    component.ngAfterViewInit();
    fixture.detectChanges();

    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects(1);
    fixture.detectChanges();

    // Ensure component ref exists and is properly set up in componentRefMap
    const currentStepIndex = component.timelineWizardService.currentStepIndex;
    expect(currentStepIndex).toBe(0);
    const currentRef = component.currentComponentRef;
    expect(currentRef).toBeDefined();
    expect(currentRef?.instance).toBeDefined();
    // Verify the ref is stored in componentRefMap at the correct index
    expect(component['componentRefMap'][currentStepIndex]).toBe(currentRef);
    // Also verify that currentComponentRef getter returns the same ref
    expect(component.currentComponentRef).toBe(currentRef);

    // The next$ subscription from beforeEach is unsubscribed by renderComponent()
    // So we need to resubscribe
    component.next$.subscribe();

    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(true);
    const finishedSpy = vi.spyOn(component.finished, 'emit');

    component.nextStep();
    await flushEffects(100);
    fixture.detectChanges();

    expect(finishedSpy).toHaveBeenCalled();
    const currentStep = component.timelineWizardService.steps[currentStepIndex];
    expect(currentStep.state).toBe(ClrTimelineStepState.SUCCESS);
  });

  it('should set step as processing before async operation', async () => {
    // Use a delayed observable so we can check the PROCESSING state before it completes
    @Component({template: ''})
    class DelayedComponent extends TimelineBaseComponent {
      override form = new FormGroup({
        field1: new FormControl(''),
      });
      override next$ = of(true).pipe(delay(100));
    }

    fixture.componentRef.setInput('timelineSteps', [
      {state: ClrTimelineStepState.CURRENT, title: 'Step 1', component: DelayedComponent, data: {}},
    ]);
    fixture.detectChanges();
    // Ensure ngAfterViewInit has been called so the container is available
    component.ngAfterViewInit();
    fixture.detectChanges();

    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects(1);
    fixture.detectChanges();

    // Ensure component ref exists and is properly set up
    const currentRef = component.currentComponentRef;
    expect(currentRef).toBeDefined();
    expect(currentRef?.instance).toBeDefined();

    // Capture the state before calling nextStep
    const stepIndexBefore = component.timelineWizardService.currentStepIndex;
    expect(stepIndexBefore).toBe(0);

    // The next$ subscription from beforeEach is unsubscribed by renderComponent()
    // So we need to resubscribe
    component.next$.subscribe();

    component.nextStep();
    // The beforeAsyncOperation is called synchronously in tap when nextAction emits
    // Since tap executes synchronously, we can check immediately without ticking
    // But we need to ensure the steps array has been updated
    await flushEffects();
    fixture.detectChanges();

    // Check state immediately - before the delayed observable completes
    const currentStepIndex = component.timelineWizardService.currentStepIndex;
    expect(currentStepIndex).toBe(stepIndexBefore); // Should still be the same step
    expect(currentStepIndex).toBe(0); // Should be 0
    const currentStep = component.timelineWizardService.steps[currentStepIndex];
    expect(currentStep.state).toBe(ClrTimelineStepState.PROCESSING);
    expect(currentStep.description).toBe('');
  });

  it('should move to next step correctly (live = false)', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects();

    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(false);
    vi.spyOn(component.timelineWizardService, 'currentStepIndex', 'get').mockReturnValue(0);

    component['moveToNextStep']();
    await flushEffects();

    expect(component.timelineWizardService.steps[0].state).toBe(ClrTimelineStepState.SUCCESS);
    expect(component.timelineWizardService.steps[1].state).toBe(ClrTimelineStepState.CURRENT);
  });

  it('should move to next step correctly (live = true)', async () => {
    fixture.componentRef.setInput('live', true);
    component.renderComponent();
    await flushEffects(100);

    // Create mock component refs with instance property
    const currentRootNode = document.createElement('div');
    currentRootNode.style.display = 'block';
    const nextRootNode = document.createElement('div');
    nextRootNode.style.display = 'none';
    const currentRef = {
      hostView: {
        rootNodes: [currentRootNode],
      } as EmbeddedViewRef<TimelineBaseComponent>,
      instance: {
        stepInvalid: false,
      } as TimelineBaseComponent,
    } as unknown as ComponentRef<TimelineBaseComponent>;
    const nextRef = {
      hostView: {
        rootNodes: [nextRootNode],
      } as EmbeddedViewRef<TimelineBaseComponent>,
      instance: {
        stepInvalid: false,
      } as TimelineBaseComponent,
    } as unknown as ComponentRef<TimelineBaseComponent>;

    // Set up component ref map - initially at index 0, after moveToNextStep currentStepIndex becomes 1
    component['componentRefMap'] = {
      0: currentRef,
      1: nextRef,
    };

    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(false);

    component['moveToNextStep']();
    await flushEffects(100);

    // After moveToNextStep, currentStepIndex is 1, so we check the refs at indices 0 and 1
    const prevRef = component['componentRefMap'][0];
    const newCurrentRef = component['componentRefMap'][1];
    expect(prevRef).toBeDefined();
    expect(newCurrentRef).toBeDefined();
    if (prevRef && newCurrentRef) {
      expect((prevRef.hostView as EmbeddedViewRef<TimelineBaseComponent>).rootNodes[0].style.display).toBe('none');
      expect((newCurrentRef.hostView as EmbeddedViewRef<TimelineBaseComponent>).rootNodes[0].style.display).toBe(
        'block',
      );
    }
  });

  it('should not move to next step if already on last step', async () => {
    vi.spyOn(component.timelineWizardService, 'isLastStep', 'get').mockReturnValue(true);
    const renderComponentSpy = vi.spyOn(component, 'renderComponent');

    component['moveToNextStep']();

    expect(renderComponentSpy).not.toHaveBeenCalled();
  });

  it('should handle component without form', async () => {
    @Component({template: ''})
    class NoFormComponent extends TimelineBaseComponent {
      override form = null;
    }

    fixture.componentRef.setInput('timelineSteps', [
      {state: ClrTimelineStepState.CURRENT, title: 'Step 1', component: NoFormComponent, data: {}},
    ]);
    fixture.detectChanges();
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects();

    const currentRef = component.currentComponentRef;
    expect(currentRef).toBeDefined();
    if (currentRef) {
      expect(currentRef.instance.form).toBeNull();
    }
  });

  it('should set allStepsData and currentStepData on component', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects();

    const currentRef = component.currentComponentRef;
    if (currentRef) {
      expect(currentRef.instance.allStepsData).toBeDefined();
      expect(currentRef.instance.currentStepData).toBeDefined();
    }
  });

  it('should unsubscribe from subscriptions when rendering new component', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();
    await flushEffects();

    const initialSubscriptionsLength = component['subscriptions'].length;

    component.renderComponent();
    await flushEffects();

    // Subscriptions should be unsubscribed and reset
    expect(component['subscriptions'].length).toBeLessThanOrEqual(initialSubscriptionsLength);
  });

  it('should handle currentStepFormInvalid getter', async () => {
    fixture.componentRef.setInput('live', false);
    component.renderComponent();

    // When no component ref, should return true
    component['componentRefMap'] = {};
    expect(component.currentStepFormInvalid).toBe(true);

    // When component ref exists and form is invalid
    const mockRef = {
      instance: {
        stepInvalid: true,
      },
    } as unknown as ComponentRef<TimelineBaseComponent>;
    component['componentRefMap'] = {0: mockRef};
    vi.spyOn(component.timelineWizardService, 'currentStepIndex', 'get').mockReturnValue(0);
    expect(component.currentStepFormInvalid).toBe(true);
  });
  it('saves the latest form data when next is clicked before the debounce finishes', async () => {
    await flushEffects();
    const ref = component.currentComponentRef;
    expect(ref?.instance.form).toBeDefined();
    ref?.instance.form?.get('field1')?.setValue('typed immediately');
    component.nextStep();

    expect(component.timelineWizardService.steps[0].data).toEqual({field1: 'typed immediately'});
  });

  it('saves edits when navigating back before the debounce finishes', async () => {
    await flushEffects();
    component.nextStep();
    await flushEffects();
    const ref = component.currentComponentRef;
    expect(ref?.instance.form).toBeDefined();
    ref?.instance.form?.get('field1')?.setValue('second step edit');
    component.previousStep();

    expect(component.timelineWizardService.steps[1].data).toEqual({field1: 'second step edit'});
  });

  it('closes form subscriptions when the wizard is destroyed', async () => {
    await flushEffects();
    const subscriptions = [...component['subscriptions']];
    expect(subscriptions.length).toBeGreaterThan(0);
    fixture.destroy();

    expect(subscriptions.every((subscription) => subscription.closed)).toBe(true);
  });

  it('runs one transition when both the template and another subscriber observe next$', async () => {
    await flushEffects();
    component.nextStep();

    expect(component.timelineWizardService.currentStepIndex).toBe(1);
  });

  it('keeps a hidden live form bound to its original step', async () => {
    fixture.componentRef.setInput('live', true);
    await flushEffects();
    const firstRef = component.currentComponentRef;
    component.nextStep();
    await flushEffects();
    firstRef?.instance.form?.get('field1')?.setValue('background edit');
    await flushEffects(400);

    expect(component.timelineWizardService.steps[0].data).toEqual({field1: 'background edit'});
    expect(component.timelineWizardService.steps[1].data).not.toEqual({field1: 'background edit'});
  });

  it('keeps the owning step current and disables previous navigation during a pending next operation', async () => {
    await flushEffects();
    component.nextStep();
    await flushEffects();
    const ref = component.currentComponentRef;
    if (!ref) {
      throw new Error('Expected the second step component');
    }
    const pending = new Subject<boolean>();
    ref.instance.next$ = pending;
    component.nextStep();
    fixture.detectChanges();
    expect(component.timelineWizardService.currentStep.state).toBe(ClrTimelineStepState.PROCESSING);
    expect(fixture.nativeElement.querySelector('.btn-outline').disabled).toBe(true);

    component.previousStep();

    expect(component.timelineWizardService.currentStepIndex).toBe(1);
    pending.next(true);
    expect(component.timelineWizardService.currentStepIndex).toBe(2);
  });

  it('cancels a pending next operation when destroyed', async () => {
    await flushEffects();
    const pending = new Subject<boolean>();
    const ref = component.currentComponentRef;
    expect(ref).toBeDefined();
    if (ref) {
      ref.instance.next$ = pending;
    }
    component.nextStep();
    expect(pending.observed).toBe(true);
    fixture.destroy();

    expect(pending.observed).toBe(false);
  });

  it('transitions to ERROR state on async failure and allows user retry to succeed', async () => {
    await flushEffects();
    const ref = component.currentComponentRef;
    if (!ref) {
      throw new Error('Expected currentComponentRef');
    }

    // First attempt fails
    ref.instance.next$ = throwError(() => new Error('Server validation timeout'));
    component.nextStep();
    await flushEffects();

    expect(component.timelineWizardService.currentStep.state).toBe(ClrTimelineStepState.ERROR);
    expect(component.timelineWizardService.currentStep.description).toBe('Server validation timeout');
    expect(component.timelineWizardService.currentStepIndex).toBe(0);

    // Retry attempt succeeds
    ref.instance.next$ = of(true);
    component.nextStep();
    await flushEffects();

    expect(component.timelineWizardService.steps[0].state).toBe(ClrTimelineStepState.SUCCESS);
    expect(component.timelineWizardService.currentStepIndex).toBe(1);
  });

  it('ignores repeated next clicks while an async step operation is already in PROCESSING state', async () => {
    await flushEffects();
    const ref = component.currentComponentRef;
    if (!ref) {
      throw new Error('Expected currentComponentRef');
    }

    const pending = new Subject<boolean>();
    ref.instance.next$ = pending;

    // First click puts step into PROCESSING
    component.nextStep();
    expect(component.timelineWizardService.currentStep.state).toBe(ClrTimelineStepState.PROCESSING);
    expect(component.timelineWizardService.currentStepIndex).toBe(0);

    // Second click during PROCESSING should return early
    component.nextStep();
    expect(component.timelineWizardService.currentStep.state).toBe(ClrTimelineStepState.PROCESSING);

    // Resolving pending completes single transition
    pending.next(true);
    await flushEffects();

    expect(component.timelineWizardService.currentStepIndex).toBe(1);
    expect(component.timelineWizardService.steps[0].state).toBe(ClrTimelineStepState.SUCCESS);
  });

  it('dynamically adapts to updated timelineSteps signal input (branching wizard)', async () => {
    await flushEffects();
    expect(component.timelineWizardService.steps.length).toBe(3);

    // Dynamic branching: Insert an approval compliance step between step 1 and step 2
    fixture.componentRef.setInput('timelineSteps', [
      {
        state: ClrTimelineStepState.CURRENT,
        title: 'Step 1: Configuration',
        component: MockTimelineBaseComponent,
        data: {field1: 'prod-cluster'},
      },
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 1.5: Security Approval',
        component: MockTimelineBaseComponent,
        data: {complianceChecked: true},
      },
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 2: Deployment',
        component: MockTimelineBaseComponent,
        data: {},
      },
      {
        state: ClrTimelineStepState.NOT_STARTED,
        title: 'Step 3: Verification',
        component: MockTimelineBaseComponent,
        data: {},
      },
    ]);
    fixture.detectChanges();
    await flushEffects();

    expect(component.timelineWizardService.steps.length).toBe(4);
    expect(component.timelineWizardService.steps[1].title).toBe('Step 1.5: Security Approval');

    // Advance to the newly inserted step
    component.nextStep();
    await flushEffects();

    expect(component.timelineWizardService.currentStepIndex).toBe(1);
    expect(component.timelineWizardService.currentStep.title).toBe('Step 1.5: Security Approval');
    expect(component.timelineWizardService.currentStep.data).toEqual({complianceChecked: true});
  });

  it('blocks next transition and does not enter PROCESSING when current form is invalid', async () => {
    await flushEffects();
    const ref = component.currentComponentRef;
    if (!ref) {
      throw new Error('Expected currentComponentRef');
    }

    const form = ref.instance.form;
    if (!form) {
      throw new Error('Expected form instance');
    }

    // Mark form as invalid by adding required validator with empty value
    form.get('field1')?.setValidators(Validators.required);
    form.get('field1')?.setValue('');
    form.updateValueAndValidity();
    expect(form.invalid).toBe(true);

    const markAllTouchedSpy = vi.spyOn(form, 'markAllAsTouched');

    component.nextStep();
    await flushEffects();

    expect(markAllTouchedSpy).toHaveBeenCalled();
    expect(component.timelineWizardService.currentStep.state).not.toBe(ClrTimelineStepState.PROCESSING);
    expect(component.timelineWizardService.currentStepIndex).toBe(0);
  });

  it('preserves component instances in live mode when navigating back and forth', async () => {
    fixture.componentRef.setInput('live', true);
    await flushEffects();

    const initialRef = component.currentComponentRef;
    expect(initialRef).toBeDefined();

    // Navigate to step 2
    component.nextStep();
    await flushEffects();
    expect(component.timelineWizardService.currentStepIndex).toBe(1);
    const secondRef = component.currentComponentRef;
    expect(secondRef).toBeDefined();
    expect(secondRef).not.toBe(initialRef);

    // Navigate back to step 1
    component.previousStep();
    await flushEffects();
    expect(component.timelineWizardService.currentStepIndex).toBe(0);

    // Initial component ref should be preserved and re-used
    expect(component.currentComponentRef).toBe(initialRef);
  });
});
