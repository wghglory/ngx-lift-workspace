import {AsyncPipe, NgClass} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  EventEmitter,
  inject,
  Input,
  Output,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {ClarityModule, ClrTimelineStepState} from '@clr/angular';
import {createAsyncState, isEqual} from 'ngx-lift';
import {debounceTime, distinctUntilChanged, Subject, Subscription, switchMap, tap} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {TimelineBaseComponent} from './timeline-base.component';
import {TimelineStep} from './timeline-step.type';
import {timelineWizardTranslations} from './timeline-wizard.l10n';
import {TimelineWizardService} from './timeline-wizard.service';

@Component({
  selector: 'cll-timeline-wizard',
  standalone: true,
  imports: [ClarityModule, TranslatePipe, AsyncPipe, NgClass],
  providers: [TimelineWizardService],
  templateUrl: './timeline-wizard.component.html',
  styleUrls: ['./timeline-wizard.component.scss'],
})
export class TimelineWizardComponent implements AfterViewInit {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  public timelineWizardService = inject(TimelineWizardService);

  // Dynamic component container
  container = viewChild.required('container', {read: ViewContainerRef});

  /**
   * Controls whether to destroy step components when clicking prev/next buttons.
   * By default, live is false, and it will destroy the step component.
   * If live is true, moving to a new step won't destroy the previous component.
   */
  @Input() live = false;
  @Input() confirmButtonText = '';

  @Input({required: true}) set timelineSteps(value: TimelineStep[]) {
    this.timelineWizardService.steps = value;
  }

  // Emit all data (type any) when clicking the finish button in the last step
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() confirmed = new EventEmitter<any>();
  @Output() canceled = new EventEmitter();
  @Output() finished = new EventEmitter();

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
    switchMap(() =>
      // Fly into the component and switch to next$ stream (e.g. API call when clicking next button)
      this.currentComponentRef!.instance.next$.pipe(
        createAsyncState({
          next: () => {
            this.timelineWizardService.isLastStep ? this.finish() : this.moveToNextStep();
          },
          error: (err) => this.setStepAsError(err),
        }),
      ),
    ),
  );

  constructor() {
    this.translationService.loadTranslationsForComponent('timeline-wizard', timelineWizardTranslations);
    this.confirmButtonText = this.translationService.translate('timeline-wizard.confirm');
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
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    if (!this.live) {
      this.container().clear();
    }

    // Create dynamic component
    const componentRef = this.container().createComponent(this.timelineWizardService.currentStep.component);

    // Save current component ref to know if the form is valid
    this.componentRefMap = {...this.componentRefMap, [this.timelineWizardService.currentStepIndex]: componentRef};

    this.initComponent(componentRef);
  }

  cancel() {
    this.canceled.emit();
  }

  // Click next step button
  nextStep() {
    if (this.timelineWizardService.isLastStep) {
      // Emit all previous steps' data to the parent
      this.confirmed.emit(this.timelineWizardService.allStepsData);
    }

    this.nextAction.next();
  }

  // Click previous step button
  previousStep() {
    if (this.timelineWizardService.isFirstStep) {
      return;
    }

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
    if (this.live) {
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

  /**
   * container.clear() will destroy the component, but we want to display the previous form data like clicking prev button.
   * This function will save and populate data.
   * each component's form data will be saved into the corresponding step. Again, steps are the single source of truth.
   * If the last step is a review component, input all previous steps' data into it. So review component can display them and send API.
   * @param cmpRef a component ref
   */
  private initComponent(cmpRef: ComponentRef<TimelineBaseComponent>) {
    // for a form step component, fill in the step data
    if (cmpRef.instance.form) {
      // defer patchValue, wait for component's form initialization
      setTimeout(
        () =>
          cmpRef.instance.form!.patchValue(
            cmpRef.instance.dataToFormValue(this.timelineWizardService.currentStep.data),
          ),
        // 1. execute
      );

      // hook form data into step data
      this.subscriptions.push(
        // 2. patchValue will pass dataToFormValue result
        cmpRef.instance.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged(isEqual)).subscribe(() => {
          this.timelineWizardService.steps = this.timelineWizardService.steps.map((step, index) => {
            if (index === this.timelineWizardService.currentStepIndex) {
              return {
                ...step,
                data: cmpRef.instance.formValueToData(), // 3. simple step form value is the emitted data (form shape is the data model shape). For complex form like FormArray, need the step component to override formValueToData function
              };
            } else {
              return step;
            }
          });
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
    if (this.live) {
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
