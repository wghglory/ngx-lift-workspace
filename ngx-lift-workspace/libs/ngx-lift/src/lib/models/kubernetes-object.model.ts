/* eslint-disable @typescript-eslint/no-explicit-any */
import {KubernetesObjectMetaV1} from './kubernetes-object-meta.model';

/**
 * Represents a Kubernetes object with standard API structure.
 * This interface defines the common structure for all Kubernetes resources.
 *
 * @template T - The type of the spec object (optional).
 * @template S - The type of the status object (optional).
 */
export interface KubernetesObject {
  /**
   * The API version of the Kubernetes object.
   * Example: "v1", "apps/v1", "networking.k8s.io/v1"
   */
  apiVersion: string;

  /**
   * The kind of the Kubernetes object.
   * Example: "Pod", "Deployment", "Service"
   */
  kind: string;

  /**
   * Metadata about the Kubernetes object, including name, namespace, labels, etc.
   */
  metadata: KubernetesObjectMetaV1;

  /**
   * The desired state of the object.
   * The structure depends on the specific Kubernetes resource type.
   */
  spec?: any;

  /**
   * The current state of the object.
   * The structure depends on the specific Kubernetes resource type.
   */
  status?: any;
}
