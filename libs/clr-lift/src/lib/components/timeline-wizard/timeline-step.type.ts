/* eslint-disable @typescript-eslint/no-explicit-any */
import {Type} from '@angular/core';
import {ClrTimelineStepDescription, ClrTimelineStepHeader, ClrTimelineStepState} from '@clr/angular';

import {TimelineBaseComponent} from './timeline-base.component';

/**
 * Represents a step in a timeline wizard.
 * Each step can have its own component, state, and data that is managed by the TimelineWizardComponent.
 *
 * @example
 * ```typescript
 * const step: TimelineStep = {
 *   state: 'current',
 *   title: 'Step 1: Configuration',
 *   component: ConfigurationStepComponent,
 *   data: { config: 'value' }
 * };
 * ```
 */
export interface TimelineStep {
  /**
   * The state of the timeline step.
   * Determines the visual appearance and behavior of the step.
   * Valid states: 'not-started', 'current', 'success', 'error', 'processing'
   */
  state: ClrTimelineStepState;

  /**
   * Optional header configuration for the timeline step.
   * Used to customize the step header display.
   */
  header?: ClrTimelineStepHeader;

  /**
   * The title of the timeline step, acting as an identifier.
   * Should be unique within the timeline steps array.
   * Used for navigation and step identification.
   */
  title: string;

  /**
   * Optional unique identifier for the timeline step.
   * Can be used for programmatic step navigation.
   */
  id?: string;

  /**
   * Optional description of the timeline step.
   * Provides additional context or instructions for the step.
   */
  description?: ClrTimelineStepDescription;

  /**
   * The Angular component class to render for this step.
   * Must extend TimelineBaseComponent to work with the timeline wizard.
   */
  component: Type<TimelineBaseComponent>;

  /**
   * Optional step-specific data.
   * This data is converted to form data by the timeline wizard component
   * and is automatically written back whenever the form changes.
   */
  data?: any;
}
