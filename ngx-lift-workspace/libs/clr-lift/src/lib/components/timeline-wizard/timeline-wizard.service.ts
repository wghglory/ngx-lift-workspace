import {Injectable} from '@angular/core';
import {ClrTimelineStepState} from '@clr/angular';

import {TimelineStep} from './timeline-step.type';

@Injectable()
export class TimelineWizardService {
  // Source of truth: Maintaining all steps data. May change to a signal in the future.
  steps: TimelineStep[] = [];

  /**
   * Get the index of the current step, error, or processing step, as they can appear once at a time as the current step.
   * If all steps are finished, no currentStep any more.
   */
  get currentStepIndex() {
    return this.steps.findIndex((step) =>
      [ClrTimelineStepState.CURRENT, ClrTimelineStepState.ERROR, ClrTimelineStepState.PROCESSING].includes(step.state),
    );
  }

  get isFirstStep() {
    return this.currentStepIndex === 0;
  }

  get isLastStep() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  /**
   * Get the current step object.
   */
  get currentStep(): TimelineStep {
    return this.steps[this.currentStepIndex];
  }

  /**
   * Get the data of the current step.
   */
  get currentStepData() {
    return this.currentStep.data;
  }

  /**
   * Get all steps data to be reviewed. Usually, send it as payload for final submission.
   * Each step is represented by an object with identifier (step id with higher priority or step title) and data (step data).
   * If the last step is a review component which doesn't have a form, filter it out.
   */
  get allStepsData() {
    return this.steps.map((step) => ({id: step.id || step.title, data: step.data})).filter((step) => step.data);
  }

  /**
   * Get the data of a specific step by its title.
   * @param key - The id or title of the step to retrieve.
   * @throws Error if the step with the given title is not found.
   */
  getStepData<T>(key: string): T {
    const stepFound = this.steps.find((step) => step.id === key || step.title === key);
    if (!stepFound) {
      throw new Error(`Step with identifier ${key} not found`);
    }
    return stepFound.data as T;
  }
}
