import {KubernetesObject} from './kubernetes-object.model';

/**
 * Represents a list of Kubernetes objects, typically returned from list/watch API endpoints.
 *
 * @template T - The type of Kubernetes objects in the list. Must extend `KubernetesObject`.
 */
export interface KubernetesList<T extends KubernetesObject> {
  /**
   * The API version of the Kubernetes list object.
   * Example: "v1", "apps/v1"
   */
  apiVersion: string;

  /**
   * Metadata about the list, including pagination information.
   */
  metadata: {
    /**
     * A token that can be used to retrieve the next page of results.
     * Empty string if there are no more results.
     */
    continue: string;

    /**
     * The resource version of the list.
     * Used for optimistic concurrency control and watch operations.
     */
    resourceVersion: string;
  };

  /**
   * The kind of the list object.
   * Typically the plural form of the object kind, e.g., "PodList", "DeploymentList"
   */
  kind: string;

  /**
   * The array of Kubernetes objects in the list.
   */
  items: T[];
}
