import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {ClarityModule, ClrIcon} from '@clr/angular';
import {ClarityIcons, infoCircleIcon} from '@clr/angular/icon';
import {KubernetesObjectCondition} from 'ngx-lift';

import {DEFAULT_STATUS_REASON, K8S_STATUS_REASON} from './k8s-status.constants';

ClarityIcons.addIcons(infoCircleIcon);

/**
 * A Kubernetes status visualizer that displays resource status text styled by status type
 * (success, error, warning, info) alongside an informative Clarity Signpost displaying raw condition details.
 *
 * @example
 * ```html
 * <cll-k8s-object-status-signpost
 *   [conditions]="database.status.conditions"
 *   resourceName="production-postgres"
 *   [bold]="true"
 * />
 * ```
 */
@Component({
  selector: 'cll-k8s-object-status-signpost',
  imports: [ClarityModule, ClrIcon, JsonPipe],
  templateUrl: './k8s-object-status-signpost.component.html',
  styleUrls: ['./k8s-object-status-signpost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class K8sObjectStatusSignpostComponent {
  /** Array of Kubernetes status conditions for the resource. */
  readonly conditions = input<KubernetesObjectCondition[]>([]);

  /** Custom CSS class to apply to the status label instead of auto-computed color classes. */
  readonly statusClass = input<string>();

  /** Title displayed in the signpost popover header. */
  readonly signpostTitle = input<string>('Status Conditions');

  /** Whether to render the status text with medium bold weight (font-weight: 500). Defaults to `false`. */
  readonly bold = input<boolean>(false);

  /** Icon size for the signpost trigger icon. Defaults to `'20'`. */
  readonly iconSize = input<string>('20');

  /** Placement position for the signpost content. Defaults to `'right-bottom'`. */
  readonly position = input<string>('right-bottom');

  /** Optional resource name included in the signpost title. */
  readonly resourceName = input<string>('');

  /** Whether to render the signpost trigger button. Defaults to `true`. */
  readonly showSignpost = input<boolean>(true);

  /**
   * The status reason derived from conditions.
   * Matches condition type 'Ready' first, falling back to the first available condition reason, or 'Queued'.
   */
  readonly statusReason = computed(() => {
    const conds = this.conditions();
    if (!conds || conds.length === 0) {
      return DEFAULT_STATUS_REASON;
    }
    const readyCond = conds.find((c) => c.type === 'Ready');
    return readyCond?.reason || conds[0].reason || DEFAULT_STATUS_REASON;
  });

  /**
   * Auto-computed Clarity semantic text color classes based on the status reason.
   */
  readonly defaultStatusClass = computed(() => {
    const reason = this.statusReason();

    const successStatuses: string[] = [
      K8S_STATUS_REASON.READY,
      K8S_STATUS_REASON.ALL_BACKUPS_RESTORED,
      K8S_STATUS_REASON.PROMOTED,
    ];

    const errorStatuses: string[] = [
      K8S_STATUS_REASON.FAILED,
      K8S_STATUS_REASON.DOWN,
      K8S_STATUS_REASON.INVALID,
      K8S_STATUS_REASON.RESTORE_FAILED,
      K8S_STATUS_REASON.PROMOTION_FAILED,
    ];

    const warningStatuses: string[] = [K8S_STATUS_REASON.DEGRADED, K8S_STATUS_REASON.UPGRADE_ABORTED];

    const infoStatuses: string[] = [
      K8S_STATUS_REASON.INPROGRESS,
      K8S_STATUS_REASON.PENDING,
      K8S_STATUS_REASON.CONNECTING,
      K8S_STATUS_REASON.DELETING,
      K8S_STATUS_REASON.QUEUED,
      K8S_STATUS_REASON.UPGRADING,
      K8S_STATUS_REASON.PARTIAL_SUCCESS,
      K8S_STATUS_REASON.EXPIRED,
      K8S_STATUS_REASON.RESTORING,
      K8S_STATUS_REASON.PROMOTING,
    ];

    return {
      'text-success': successStatuses.includes(reason),
      'text-error': errorStatuses.includes(reason),
      'text-warning': warningStatuses.includes(reason),
      'text-info': infoStatuses.includes(reason),
    };
  });

  /**
   * Effective status classes applied to the status label.
   */
  readonly statusClasses = computed(() => {
    const custom = this.statusClass();
    if (custom) {
      return {[custom]: true};
    }
    return this.defaultStatusClass();
  });

  /**
   * Whether to display the signpost popover trigger.
   */
  readonly shouldShowSignpost = computed(() => {
    if (!this.showSignpost()) {
      return false;
    }
    const conds = this.conditions();
    return Array.isArray(conds) && conds.length > 0;
  });
}
