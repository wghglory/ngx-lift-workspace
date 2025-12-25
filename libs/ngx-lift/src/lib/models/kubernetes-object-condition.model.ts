/**
 * Represents a condition of a Kubernetes object.
 * Conditions provide a standard way to represent the status of an object and its components.
 *
 * @template T - The type of the condition type (e.g., 'Ready', 'Available', 'Progressing').
 * @template R - The type of the reason string (e.g., 'PodScheduled', 'ContainersReady').
 *
 * @example
 * ```typescript
 * const condition: KubernetesObjectCondition = {
 *   type: 'Ready',
 *   status: 'True',
 *   reason: 'PodReady',
 *   message: 'Pod is ready',
 *   lastTransitionTime: '2024-01-01T00:00:00Z'
 * };
 * ```
 */
export interface KubernetesObjectCondition<T = string, R = string> {
  /**
   * lastTransitionTime is a string representing the last time the condition transitioned from one status to another.
   * If the underlying condition change is unknown, the time when the API field changed is used.
   */
  lastTransitionTime: string;

  /**
   * message is a string providing a human - readable message about the transition. It can be an empty string.
   */
  message: string;

  /**
   * reason is a string containing a programmatic identifier indicating the reason for the condition's last transition.
   * Producers of specific condition types may define expected values and meanings for this field.
   */
  reason: R;

  /**
   * status is an enum with possible values 'True', 'False', or 'Unknown' representing the current status of the condition.
   */
  status: 'True' | 'False' | 'Unknown';
  /**
   * type is a string representing the type of condition in CamelCase or in foo.example.com/CamelCase format.
   */
  type: T;

  /**
   * observedGeneration is an integer representing the.metadata.generation that the condition was set based upon.
   */
  observedGeneration?: number;
}
