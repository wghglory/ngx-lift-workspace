/**
 * Represents the type of toast notification.
 * - `'success'`: Success notification (green)
 * - `'error'`: Error notification (red)
 * - `'info'`: Informational notification (blue)
 * - `'warning'`: Warning notification (yellow/orange)
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Represents a toast notification configuration.
 * Used when creating toast notifications via ToastService.
 */
export type Toast = {
  /**
   * The title of the toast notification.
   */
  title: string;

  /**
   * The description or message body of the toast notification.
   */
  description: string;

  /**
   * Optional unique identifier for the toast.
   * If not provided, one will be generated automatically.
   */
  id?: symbol;

  /**
   * The type of toast notification.
   * Defaults to 'info' if not specified.
   */
  toastType?: ToastType;

  /**
   * Whether the toast can be manually closed by the user.
   * Defaults to `true` if not specified.
   */
  manualClosable?: boolean;

  /**
   * The number of seconds before the toast automatically closes.
   * If not specified, the toast will not auto-close.
   */
  timeoutSeconds?: number;

  /**
   * Text for the primary action button.
   * If provided, a primary button will be displayed.
   */
  primaryButtonText?: string;

  /**
   * Text for the secondary action button.
   * If provided, a secondary button will be displayed.
   */
  secondaryButtonText?: string;

  /**
   * Optional date string to display in the toast.
   * Typically used to show when an event occurred.
   */
  date?: string;

  /**
   * Callback function executed when the toast is closed.
   */
  closed?: () => void;

  /**
   * Callback function executed when the primary button is clicked.
   */
  primaryButtonClick?: () => void;

  /**
   * Callback function executed when the secondary button is clicked.
   */
  secondaryButtonClick?: () => void;
};

/**
 * Represents a toast notification with all required properties.
 * This type is used internally after a toast is created by the ToastService.
 */
export type CreatedToast = Required<Pick<Toast, 'title' | 'description' | 'id' | 'toastType'>> & Toast;
