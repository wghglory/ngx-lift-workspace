/**
 * Status of a resource's async operation lifecycle.
 * Extends Angular's httpResource ResourceStatus with additional 'local' state.
 *
 * - `idle`: Initial state, operation has never been triggered (lazy resources only)
 * - `loading`: Initial fetch in progress with no previous value available
 * - `reloading`: Refetch in progress while previous value is still available
 * - `resolved`: Operation completed successfully with data
 * - `error`: Operation failed with an error
 * - `local`: Value was set manually via set() or update() (ngx-lift extension)
 *
 * @see https://angular.dev/api/core/ResourceStatus
 */
export type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local';
