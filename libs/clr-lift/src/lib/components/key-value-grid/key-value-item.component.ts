import {ChangeDetectionStrategy, Component, input} from '@angular/core';

/**
 * An individual key-value cell component for use inside `cll-key-value-grid`.
 * Supports both direct input properties (`key`, `value`) and content projection
 * via `[key]` and `[value]` attributes.
 *
 * @example
 * ```html
 * <!-- Using inputs -->
 * <cll-key-value-item key="Cluster IP" value="10.0.0.1" />
 *
 * <!-- Using projection -->
 * <cll-key-value-item>
 *   <span key>Status</span>
 *   <span value class="badge badge-success">Running</span>
 * </cll-key-value-item>
 * ```
 */
@Component({
  selector: 'cll-key-value-item',
  templateUrl: './key-value-item.component.html',
  styleUrl: './key-value-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueItemComponent {
  /** Optional key title text if not using `[key]` projection. */
  readonly key = input<string>();

  /** Optional value content if not using `[value]` projection. */
  readonly value = input<string | number>();
}
