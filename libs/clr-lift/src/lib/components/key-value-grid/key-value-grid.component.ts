import {ChangeDetectionStrategy, Component, input} from '@angular/core';

/**
 * A responsive multi-column CSS grid container designed for key-value pair displays.
 * Automatically adapts column count from 1 to 4 columns across breakpoints, or accepts
 * a fixed column count.
 *
 * @example
 * ```html
 * <cll-key-value-grid gap="1.5rem">
 *   <cll-key-value-item key="Cluster Name" value="prod-eu-central" />
 *   <cll-key-value-item key="Status">
 *     <span value class="badge badge-success">Running</span>
 *   </cll-key-value-item>
 * </cll-key-value-grid>
 * ```
 */
@Component({
  selector: 'cll-key-value-grid',
  templateUrl: './key-value-grid.component.html',
  styleUrl: './key-value-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueGridComponent {
  /**
   * The CSS gap between grid cells.
   * @default '1.5rem'
   */
  readonly gap = input<string>('1.5rem');

  /**
   * Number of columns to display. If 'auto', automatically responds to screen size:
   * 1 col (mobile), 2 cols (tablet), 3 cols (desktop), 4 cols (wide screens).
   * @default 'auto'
   */
  readonly columns = input<number | 'auto'>('auto');
}
