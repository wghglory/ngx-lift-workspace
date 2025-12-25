import {ChangeDetectionStrategy, Component} from '@angular/core';

/**
 * A callout component built on top of Clarity Design System.
 * Displays informational callouts with various styles and content.
 *
 * @example
 * ```html
 * <cll-callout>
 *   <p>This is a callout message with important information.</p>
 * </cll-callout>
 * ```
 */
@Component({
  selector: 'cll-callout',
  templateUrl: './callout.component.html',
  styleUrl: './callout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutComponent {}
