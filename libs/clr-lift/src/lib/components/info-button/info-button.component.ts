import {ChangeDetectionStrategy, Component, computed, inject, input, output} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {ClarityModule, ClrIcon} from '@clr/angular';

import {TooltipDirective} from '../tooltip/tooltip.directive';
import {TooltipPosition} from '../tooltip/tooltip.model';

/**
 * An informational action button with optional router navigation and tooltip support.
 * When disabled with a `tooltipText`, displays an info icon and shows the tooltip on hover
 * explaining why the action is disabled.
 *
 * @example
 * ```html
 * <!-- Basic button with click event -->
 * <cll-info-button text="Generate Credentials" (clicked)="onGenerate()" />
 *
 * <!-- Router link navigation -->
 * <cll-info-button
 *   text="View Policy Details"
 *   [link]="['/policies', policyId]"
 *   [queryParams]="{ tab: 'rules' }"
 * />
 *
 * <!-- Disabled with explanatory tooltip -->
 * <cll-info-button
 *   text="Delete Volume"
 *   [disabled]="true"
 *   tooltipText="Cannot delete volume while attached to a database instance."
 * />
 * ```
 */
@Component({
  selector: 'cll-info-button',
  imports: [ClarityModule, ClrIcon, TooltipDirective],
  templateUrl: './info-button.component.html',
  styleUrl: './info-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoButtonComponent {
  private router = inject(Router, {optional: true});

  /** The button label text to display. */
  readonly text = input.required<string>();

  /** Explanatory tooltip text shown when disabled. */
  readonly tooltipText = input<string>('');

  /** Position of the tooltip relative to the button. */
  readonly tooltipPosition = input<TooltipPosition>('tooltip-right');

  /** Width of the tooltip in pixels. */
  readonly tooltipWidth = input<number>(240);

  /** Size of the info icon in pixels when shown. */
  readonly iconSize = input<string>('18');

  /**
   * Router link target. Can be a string path or array of route segments.
   * When provided, clicking the button triggers router navigation.
   * If omitted, the `clicked` output is emitted instead.
   */
  readonly link = input<string | string[] | null>(null);

  /** Optional query parameters for router navigation. */
  readonly queryParams = input<Record<string, unknown> | null>(null);

  /** Optional state object for router navigation. */
  readonly state = input<Record<string, unknown> | null>(null);

  /** Whether the button is disabled. */
  readonly disabled = input(false);

  /** Custom CSS class names applied to the button element. */
  readonly className = input<string>();

  /** Event emitted when the button is clicked and `link` is not set. */
  readonly clicked = output<void>();

  /**
   * Tooltip text active only when disabled and `tooltipText` is non-empty.
   */
  readonly effectiveTooltip = computed(() => {
    return this.disabled() && this.tooltipText() ? this.tooltipText() : '';
  });

  /**
   * Handles button click. Navigates via Router if `link` is present, or emits `clicked`.
   */
  onButtonClick(): void {
    if (this.disabled()) {
      return;
    }

    const targetLink = this.link();
    if (targetLink && this.router) {
      const extras: NavigationExtras = {
        queryParams: this.queryParams() || undefined,
        state: (this.state() as Record<string, unknown> | undefined) || undefined,
      };
      this.router.navigate(Array.isArray(targetLink) ? targetLink : [targetLink], extras);
    } else {
      this.clicked.emit();
    }
  }
}
