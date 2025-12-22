/* eslint-disable @typescript-eslint/no-explicit-any */
import {Type} from '@angular/core';
import {ClrTimelineStepDescription, ClrTimelineStepHeader, ClrTimelineStepState} from '@clr/angular';

import {TimelineBaseComponent} from './timeline-base.component';

/**
 * Represents a step in a timeline.
 */
export interface TimelineStep {
  /**
   * The state of the timeline step.
   */
  state: ClrTimelineStepState;

  /**
   * The header of the timeline step.
   */
  header?: ClrTimelineStepHeader;

  /**
   * The title of the timeline step, acting as an identifier (should be unique within the array).
   */
  title: string;

  /**
   * optional identifier of the timeline step.
   */
  id?: string;

  /**
   * The description of the timeline step.
   */
  description?: ClrTimelineStepDescription;

  /**
   * The component associated with the timeline step.
   */
  component: Type<TimelineBaseComponent>;

  /**
   * Step data, will be converted to form data by timeline wizard component, and write back whenever form changes.
   */
  data?: any;
}
