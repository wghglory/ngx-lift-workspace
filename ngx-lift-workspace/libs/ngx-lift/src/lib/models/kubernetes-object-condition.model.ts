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
