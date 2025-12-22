/**
 * https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#objectmeta-v1-meta
 */
export interface KubernetesObjectMetaV1 {
  name: string;
  namespace?: string; // can be undefined for cluster-scoped resources
  selfLink?: string;
  uid?: string;
  resourceVersion?: string;
  generation?: number;
  creationTimestamp?: string;
  deletionTimestamp?: string; // only present if the object is being deleted
  deletionGracePeriodSeconds?: number; // only present if the object is being deleted
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  ownerReferences?: OwnerReference[];
  finalizers?: string[];
  clusterName?: string; // only present for objects in a cluster
  managedFields?: ManagedField[];
}

interface OwnerReference {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
  controller: boolean;
  blockOwnerDeletion?: boolean;
}

interface ManagedField {
  apiVersion: string;
  fieldsType: string;
  fieldsV1: Record<string, unknown>;
  manager: string;
  operation: string;
  subresource?: string;
  time: string;
}
