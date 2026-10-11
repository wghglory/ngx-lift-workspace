import {AsyncPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  DestroyRef,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  output,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ClarityModule, ClrTimelineStepState} from '@clr/angular';
import {createAsyncState, isEqual} from 'ngx-lift';
import {debounceTime, distinctUntilChanged, shareReplay, Subject, Subscription, switchMap, tap} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {TimelineBaseComponent} from './timeline-base.component';
import {TimelineStep} from './timeline-step.type';
import {timelineWizardTranslations} from './timeline-wizard.l10n';
import {TimelineWizardService} from './timeline-wizard.service';

@Component({
  selector: 'cll-timeline-wizard',
  imports: [ClarityModule, TranslatePipe, AsyncPipe],
  providers: [TimelineWizardService],
  templateUrl: './timeline-wizard.component.html',
  styleUrls: ['./timeline-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineWizardComponent implements AfterViewInit {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private patchTimers = new Set<ReturnType<typeof setTimeout>>();
  public timelineWizardService = inject(TimelineWizardService);

  // Dynamic component container
  container = viewChild.required('container', {read: ViewContainerRef});

  /**
   * Controls whether to destroy step components when clicking prev/next buttons.
   * By default, live is false, and it will destroy the step component.
   * If live is true, moving to a new step won't destroy the previous component.
   */
  live = input(false);

  /**
   * Text for the confirm button in the last step.
   * Pass a translation key (e.g., 'timeline-wizard.finish') or custom text.
   * Defaults to 'timeline-wizard.finish'.
   */
  confirmButtonText = input('timeline-wizard.finish');

  /**
   * Timeline steps configuration (required).
   * When this value changes, the timeline wizard service is updated.
   */
  timelineSteps = input.required<TimelineStep[]>();

  // Emit all data (type any) when clicking the finish button in the last step
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirmed = output<any>();
  canceled = output<void>();
  finished = output<void>();

  // Step index as key, componentRef as value
  private componentRefMap: Record<number, ComponentRef<TimelineBaseComponent>> = {};

  private subscriptions: Subscription[] = [];

  // Next step button click trigger
  private nextAction = new Subject<void>();

  /**
   * When clicking next/finish button:
   * 1) Clear previous error, set state as PROCESSING.
   * 2) Hook into the specific component's observable that could be either synchronous or asynchronous.
   */
  next$ = this.nextAction.pipe(
    tap(() => this.beforeAsyncOperation()),
    switchMap(() => {
      const currentRef = this.currentComponentRef;
      if (!currentRef) {
        throw new Error('Current component reference is not available');
      }
      // Fly into the component and switch to next$ stream (e.g. API call when clicking next button)
      return currentRef.instance.next$.pipe(
        createAsyncState({
          next: () => {
            if (this.timelineWizardService.isLastStep) {
              this.finish();
            } else {
              this.moveToNextStep();
            }
          },
          error: (err) => this.setStepAsError(err),
        }),
      );
    }),
    takeUntilDestroyed(this.destroyRef),
    shareReplay({bufferSize: 1, refCount: true}),
  );

  constructor() {
    this.translationService.loadTranslationsForComponent('timeline-wizard', timelineWizardTranslations);
    this.destroyRef.onDestroy(() => {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions = [];
      this.patchTimers.forEach((timer) => clearTimeout(timer));
      this.patchTimers.clear();
      this.nextAction.complete();
    });

    // Effect to update timeline wizard service when timelineSteps input changes
    effect(() => {
      this.timelineWizardService.steps = this.timelineSteps();
    });
  }

  get currentComponentRef() {
    return this.componentRefMap[this.timelineWizardService.currentStepIndex];
  }

  get currentStepFormInvalid() {
    return !this.currentComponentRef || this.currentComponentRef.instance.stepInvalid;
  }

  // Wait for the container to exist in the DOM
  ngAfterViewInit() {
    this.renderComponent();

    // 1. Make sure Clarity inputs are rendered correctly if OnPush.
    // 2. Fix step component form expressed value error.
    this.cdr.detectChanges();
  }

  renderComponent() {
    if (!this.live()) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions = [];
      this.patchTimers.forEach((timer) => clearTimeout(timer));
      this.patchTimers.clear();
      this.container().clear();
      this.componentRefMap = {};
    }

    // Create dynamic component
    const componentRef = this.container().createComponent(this.timelineWizardService.currentStep.component);

    // Save current component ref to know if the form is valid
    this.componentRefMap = {
      ...this.componentRefMap,
      [this.timelineWizardService.currentStepIndex]: componentRef,
    };

    this.initComponent(componentRef);
  }

  cancel() {
    this.canceled.emit();
  }

  // Click next step button
  nextStep() {
    const currentRef = this.currentComponentRef;
    if (!currentRef || this.timelineWizardService.currentStep.state === ClrTimelineStepState.PROCESSING) {
      return;
    }
    if (currentRef.instance.stepInvalid) {
      currentRef.instance.form?.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }
    this.syncCurrentStepData();
    if (currentRef.instance.form) {
      const form = currentRef.instance.form;
      if (form.invalid) {
        // Mark all fields as touched to trigger Clarity validation error displays
        form.markAllAsTouched();
        this.cdr.detectChanges();
        return;
      }
    }

    if (this.timelineWizardService.isLastStep) {
      // Emit all previous steps' data to the parent
      this.confirmed.emit(this.timelineWizardService.allStepsData);
    }

    this.nextAction.next();
  }

  // Click previous step button
  previousStep() {
    if (
      !this.currentComponentRef ||
      this.timelineWizardService.isFirstStep ||
      this.timelineWizardService.currentStep.state === ClrTimelineStepState.PROCESSING
    ) {
      return;
    }

    this.syncCurrentStepData();

    // Change data source, update timeline; this should execute first before other logic
    // it change CURRENT, which affect currentStepIndex!
    this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
      // Change current step as "not started"
      if (index === this.timelineWizardService.currentStepIndex) {
        return {
          ...step,
          state: ClrTimelineStepState.NOT_STARTED,
          description: '', // Clear error
        };
      }
      // Move to prev step, set it as "current"
      else if (index === this.timelineWizardService.currentStepIndex - 1) {
        return {
          ...step,
          state: ClrTimelineStepState.CURRENT,
        };
      } else {
        return step;
      }
    });

    // Update dynamic components; note that currentStepIndex was changed above.
    // If live is true, change display of old and new components.
    // else renderComponent by destroying old one.
    if (this.live()) {
      // change DOM display
      // Accessing DOM elements using this.container.get() can be expensive in terms of performance, especially if the DOM is large or complex.
      // const currentElement = this.container.get(this.currentStepIndex + 1) as EmbeddedViewRef<TimelineBaseComponent>;
      // const prevElement = this.container.get(this.currentStepIndex) as EmbeddedViewRef<TimelineBaseComponent>;
      const currentElement = this.componentRefMap[this.timelineWizardService.currentStepIndex + 1]
        .hostView as EmbeddedViewRef<TimelineBaseComponent>;
      const prevElement = this.componentRefMap[this.timelineWizardService.currentStepIndex]
        .hostView as EmbeddedViewRef<TimelineBaseComponent>;

      currentElement.rootNodes[0].style.display = 'none';
      prevElement.rootNodes[0].style.display = 'block';
    } else {
      this.renderComponent();
    }
  }

  /** Saves edits before navigation so a pending debounce cannot lose the latest form data. */
  private syncCurrentStepData() {
    const index = this.timelineWizardService.currentStepIndex;
    const component = this.currentComponentRef?.instance;
    if (component?.form) {
      this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, stepIndex) =>
        stepIndex === index ? {...step, data: component.formValueToData()} : step,
      );
    }
  }

  /** Binds form changes and delayed initialization to their owning step. */
  private initComponent(cmpRef: ComponentRef<TimelineBaseComponent>) {
    const stepIndex = this.timelineWizardService.currentStepIndex;
    const stepData = this.timelineWizardService.currentStep.data;
    // for a form step component, fill in the step data
    if (cmpRef.instance.form) {
      const form = cmpRef.instance.form;
      // defer patchValue, wait for component's form initialization
      const timer = setTimeout(() => {
        this.patchTimers.delete(timer);
        if (!cmpRef.hostView.destroyed) {
          form.patchValue(cmpRef.instance.dataToFormValue(stepData));
        }
      });
      this.patchTimers.add(timer);

      // hook form data into step data
      this.subscriptions.push(
        // 2. patchValue will pass dataToFormValue result
        cmpRef.instance.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged(isEqual)).subscribe(() => {
          this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
            if (index === stepIndex) {
              return {
                ...step,
                data: cmpRef.instance.formValueToData(), // 3. simple step form value is the emitted data (form shape is the data model shape). For complex form like FormArray, need the step component to override formValueToData function
              };
            } else {
              return step;
            }
          });
          this.cdr.markForCheck();
        }),
      );
    }

    cmpRef.setInput('allStepsData', this.timelineWizardService.allStepsData);

    if (this.timelineWizardService.currentStep.data) {
      cmpRef.setInput('currentStepData', cmpRef.instance.dataToFormValue(this.timelineWizardService.currentStep.data));
    }
  }

  /**
   *  when clicking next/finish button, clear error (description = ''), set processing state
   */
  private beforeAsyncOperation() {
    this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
      if (index === this.timelineWizardService.currentStepIndex) {
        return {
          ...step,
          state: ClrTimelineStepState.PROCESSING,
          description: '',
        };
      } else {
        return step;
      }
    });
  }

  /**
   * set current step error
   * @param err
   */
  private setStepAsError(err: HttpErrorResponse) {
    this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
      if (index === this.timelineWizardService.currentStepIndex) {
        return {
          ...step,
          state: ClrTimelineStepState.ERROR,
          description: err.message,
        };
      } else {
        return step;
      }
    });
  }

  private finish() {
    this.finished.emit();

    this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
      // Change current step as "success"
      if (index === this.timelineWizardService.currentStepIndex) {
        return {
          ...step,
          state: ClrTimelineStepState.SUCCESS,
        };
      } else {
        return step;
      }
    });
  }

  /**
   * Move to the next step in the process.
   *
   * This function changes the data source and updates the timeline. It should execute
   * before any other logic because it changes the value of CURRENT, which affects
   * the currentStepIndex.
   *
   * @return {void}
   */
  private moveToNextStep() {
    if (this.timelineWizardService.isLastStep) {
      return;
    }

    /**
     * change data source, update timeline, this should execute first before other logic,
     * because it change CURRENT, which affect currentStepIndex
     */
    this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
      // Change current step as "success"
      if (index === this.timelineWizardService.currentStepIndex) {
        return {
          ...step,
          state: ClrTimelineStepState.SUCCESS,
        };
      }
      // Move to next step, set it as "current"
      else if (index === this.timelineWizardService.currentStepIndex + 1) {
        return {
          ...step,
          state: ClrTimelineStepState.CURRENT,
        };
      } else {
        return step;
      }
    });

    /**
     * update dynamic components. Note currentStepIndex was changed above.
     * if live is true, change display of old and new components.
     * else renderComponent by destroying old one.
     */
    if (this.live()) {
      //  Accessing DOM elements using this.container.get() can be expensive in terms of performance, especially if the DOM is large or complex.
      // const nextElement = this.container.get(this.currentStepIndex) as EmbeddedViewRef<TimelineBaseComponent>;
      // const currentElement = this.container.get(this.currentStepIndex - 1) as EmbeddedViewRef<TimelineBaseComponent>;
      const nextElement = this.componentRefMap[this.timelineWizardService.currentStepIndex]
        ?.hostView as EmbeddedViewRef<TimelineBaseComponent>;
      const currentElement = this.componentRefMap[this.timelineWizardService.currentStepIndex - 1]
        .hostView as EmbeddedViewRef<TimelineBaseComponent>;

      currentElement.rootNodes[0].style.display = 'none';

      if (nextElement) {
        // Next element exists, no need to create component
        nextElement.rootNodes[0].style.display = 'block';
      } else {
        // Next button click will create a new component
        this.renderComponent();
      }
    } else {
      this.renderComponent();
    }
  }
}
