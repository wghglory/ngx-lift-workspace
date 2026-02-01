/**
 * Status of a resource's async operation lifecycle.
 * Matches Angular's httpResource ResourceStatus for consistency.
 *
 * - `idle`: Initial state, operation has never been triggered (lazy resources only)
 * - `loading`: Initial fetch in progress with no previous value available
 * - `reloading`: Refetch in progress while previous value is still available
 * - `resolved`: Operation completed successfully with data
 * - `error`: Operation failed with an error
 *
 * @see https://angular.dev/api/core/ResourceStatus
 */
export type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';
