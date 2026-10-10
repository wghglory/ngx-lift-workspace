import type {Observable} from 'rxjs';

/**
 * Generic resource state metadata for tracking created, modified, or superseded resources
 * during multi-step or parallel transactional operations.
 */
export interface ResourceState {
  /**
   * Name or unique identifier of the resource.
   */
  name: string;

  /**
   * Resource type identifier (e.g., 'secret', 'configMap', 'cluster', or a custom entity).
   */
  type: string;

  /**
   * Target namespace, region, or container where the resource is located.
   */
  namespace?: string;

  /**
   * Indicates whether the resource was newly created during the current operation attempt.
   * If an error occurs, newly created resources are rolled back.
   */
  isNew?: boolean;

  /**
   * Indicates whether this record is a tombstone representing a resource removed from configuration.
   * Tombstones are tracked solely for cleanup on success and are sanitized before active payloads.
   */
  isTombstone?: boolean;

  /**
   * Name of the previous resource that was superseded or replaced and should be cleaned up on success.
   */
  replacedOldName?: string;
}

/**
 * Function signature for handling the deletion or rollback of a single resource during automated cleanup.
 */
export type ResourceDeleteHandler = (res: ResourceState) => Observable<unknown>;
