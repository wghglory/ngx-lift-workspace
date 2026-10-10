/**
 * Standard Kubernetes resource status condition reasons.
 * Derived from common Kubernetes API and custom resource definition condition `reason` fields.
 */
export const K8S_STATUS_REASON = {
  READY: 'Ready',
  FAILED: 'Failed',
  INPROGRESS: 'InProgress',
  PENDING: 'Pending',
  CONNECTING: 'Connecting',
  DELETING: 'Deleting',
  QUEUED: 'Queued',
  UPGRADE_ABORTED: 'UpgradeAborted',
  UPGRADING: 'Upgrading',
  DEGRADED: 'Degraded',
  DOWN: 'Down',
  INVALID: 'Invalid',
  SCALING_VM_CLASS: 'ScalingVmClass',
  SCALING_REPLICAS: 'ScalingReplicas',
  NOT_OPERATIONAL: 'NotOperational',
  EXPIRED: 'Expired',
  PARTIAL_SUCCESS: 'PartialSuccess',
  RESTORING: 'Restoring',
  ALL_BACKUPS_RESTORED: 'AllBackupsRestored',
  PROMOTING: 'Promoting',
  PROMOTED: 'Promoted',
  RESTORE_FAILED: 'RestoreFailed',
  PROMOTION_FAILED: 'PromotionFailed',
} as const;

/** Default status reason when no conditions are present or no Ready condition is found. */
export const DEFAULT_STATUS_REASON = K8S_STATUS_REASON.QUEUED;
