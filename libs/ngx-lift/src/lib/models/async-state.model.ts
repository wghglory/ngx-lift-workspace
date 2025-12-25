import {HttpErrorResponse} from '@angular/common/http';

/**
 * Represents the state of an asynchronous operation, including loading, error, and data.
 * @template T - The type of the data in the response.
 * @template E - The type of the error response, defaulting to `HttpErrorResponse`.
 */
export interface AsyncState<T, E = HttpErrorResponse> {
  /**
   * Indicates whether the asynchronous operation is in progress.
   */
  loading: boolean;

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
