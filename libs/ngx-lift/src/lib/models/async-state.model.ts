import {HttpErrorResponse} from '@angular/common/http';

import {ResourceStatus} from './resource-status.model';

/**
 * Represents the state of an asynchronous operation, including status, loading, error, and data.
 * @template T - The type of the data in the response.
 * @template E - The type of the error response, defaulting to `HttpErrorResponse`.
 *   For non-HTTP errors, you can specify `Error` or a custom error type.
 */
export interface AsyncState<T, E = HttpErrorResponse> {
  /**
   * The current status of the async operation.
   * Matches Angular's httpResource status values:
   * - `idle`: Operation has never been triggered
   * - `loading`: Initial fetch in progress (no previous value)
   * - `reloading`: Refetch in progress (previous value available)
   * - `resolved`: Operation completed successfully
   * - `error`: Operation failed
   */
  status: ResourceStatus;

  /**
   * Indicates whether the asynchronous operation is in progress.
   * True when status is 'loading' or 'reloading'.
   * Matches Angular's httpResource isLoading behavior.
   */
  isLoading: boolean;

  /**
   * Represents any error that occurred during the asynchronous operation.
   * Null if no error occurred.
   */
  error: E | null;

  /**
   * The data resulting from the asynchronous operation.
   * Null if the operation has not completed successfully.
   */
  data: T | null;
}
