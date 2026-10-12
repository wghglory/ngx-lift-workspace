import {SafeHtml} from '@angular/platform-browser';

/**
 * Represents the type of alert, which can be 'neutral', 'loading', 'unknown', 'success', 'info', 'warning', or 'danger'.
 */
export type AlertType = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'loading' | 'unknown';

/** A native button rendered by the alert container, separate from inline HTML. */
export type AlertAction = {
  /** Visible button label, rendered as text. */
  label: string;
  /** Called when the button is activated with a pointer or keyboard. */
  onClick: () => void;
};

/**
 * Represents an alert that developers can configure when calling alertService.addAlert()
 */
export type Alert = {
  /**
   * The content or message of the alert.
   * Can include HTML markup (like buttons or links).
   */
  content: string | SafeHtml;

  /**
   * A unique symbol representing the identifier of the alert instance.
   */
  readonly id?: symbol;

  /**
   * The type of alert, which can be 'neutral', 'loading', 'unknown', 'success', 'info', 'warning', or 'danger'.
   */
  alertType?: AlertType;

  /**
   * Indicates whether the alert is at the application level.
   */
  isAppLevel?: boolean;

  /**
   * Indicates whether the alert is lightweight.
   */
  isLightweight?: boolean;

  /** Actions rendered as Angular buttons in the alert actions section. */
  actions?: readonly AlertAction[];

  /**
   * Selector for a clickable element within the alert content (e.g. an inline button or link).
   */
  targetSelector?: string;

  /**
   * Called when a matching element within this alert's content is clicked.
   */
  onTargetClick?: () => void;
};

/**
 * Represents required properties for displaying an alert in the application.
 */
export type RequiredAlert = Required<Pick<Alert, 'alertType' | 'isAppLevel' | 'id'>> &
  Omit<Alert, 'content'> & {
    content: SafeHtml | string;
  };
