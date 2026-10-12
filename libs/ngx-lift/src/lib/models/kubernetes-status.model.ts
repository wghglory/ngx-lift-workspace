/**
 * Represents details about why a Kubernetes operation failed, such as
 * the resource involved or suggested retry duration.
 */
export interface KubernetesStatusDetails {
  /** The name attribute of the resource associated with the status. */
  name?: string;
  /** The group of the resource associated with the status. */
  group?: string;
  /** The kind attribute of the resource associated with the status. */
  kind?: string;
  /** The UID attribute of the resource associated with the status. */
  uid?: string;
  /** The Causes array includes more details associated with the StatusFailure. */
  causes?: Array<{
    reason?: string;
    message?: string;
    field?: string;
  }>;
  /**
   * If specified, the number of seconds the client should wait before attempting this request again.
   * Commonly returned with HTTP 429 (TooManyRequests), for example when the watch cache is (re)initializing.
   */
  retryAfterSeconds?: number;
}

/**
 * Represents a Kubernetes Status object returned by the API server on errors or status operations.
 */
export interface KubernetesStatus {
  /** APIVersion defines the versioned schema of this representation of an object. */
  apiVersion?: string;
  /** Kind is a string value representing the REST resource this object represents. */
  kind?: string;
  /** Standard list metadata. */
  metadata?: {
    resourceVersion?: string;
    selfLink?: string;
  };
  /** Status of the operation. One of: "Success" or "Failure". */
  status?: 'Success' | 'Failure' | string;
  /** A human-readable description of the status of this operation. */
  message?: string;
  /** A machine-readable description of why this operation is in the "Failure" status. */
  reason?: string;
  /** Extended data associated with the reason. */
  details?: KubernetesStatusDetails;
  /** Suggested HTTP return code for this status, 0 if not used. */
  code?: number;
}
