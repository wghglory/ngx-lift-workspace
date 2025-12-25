/**
 * Animation constants for atomic-level animations in the Clarity Design System.
 * These constants define timing functions and durations for enter/leave animations.
 */

/**
 * Cubic bezier curve for atomic primary enter animations.
 * Creates a smooth, slightly bouncy entrance effect.
 */
export const atomicPrimaryEnterCurve = 'cubic-bezier(0, 1.5, 0.5, 1)';

/**
 * Duration in milliseconds for atomic primary enter animations.
 */
export const atomicPrimaryEnterTiming = 200;

/**
 * Cubic bezier curve for atomic primary leave animations.
 * Creates a smooth exit effect.
 */
export const atomicPrimaryLeaveCurve = 'cubic-bezier(0,.99,0,.99)';

/**
 * Duration in milliseconds for atomic primary leave animations.
 */
export const atomicPrimaryLeaveTiming = 200;

/**
 * Cubic bezier curve for atomic secondary enter animations.
 */
export const atomicSecondaryEnterCurve = 'cubic-bezier(0, 1.5, 0.5, 1)';

/**
 * Duration in milliseconds for atomic secondary enter animations.
 */
export const atomicSecondaryEnterTiming = 400;

/**
 * Cubic bezier curve for atomic secondary leave animations.
 */
export const atomicSecondaryLeaveCurve = 'cubic-bezier(0, 1.5, 0.5, 1)';

/**
 * Duration in milliseconds for atomic secondary leave animations.
 */
export const atomicSecondaryLeaveTiming = 100;

/**
 * Animation constants for component-level animations.
 */

/**
 * Cubic bezier curve for component primary enter animations.
 */
export const componentPrimaryEnterCurve = 'cubic-bezier(0,.99,0,.99)';

/**
 * Duration in milliseconds for component primary enter animations.
 */
export const componentPrimaryEnterTiming = 400;

/**
 * Cubic bezier curve for component primary leave animations.
 */
export const componentPrimaryLeaveCurve = 'cubic-bezier(0,.99,0,.99)';

/**
 * Duration in milliseconds for component primary leave animations.
 */
export const componentPrimaryLeaveTiming = 300;

/**
 * Animation constants for page-level animations.
 */

/**
 * Cubic bezier curve for page primary enter animations.
 */
export const pagePrimaryEnterCurve = 'cubic-bezier(0,.99,0,.99)';

/**
 * Duration in milliseconds for page primary enter animations.
 */
export const pagePrimaryEnterTiming = 250;

/**
 * Cubic bezier curve for page primary leave animations.
 */
export const pagePrimaryLeaveCurve = 'cubic-bezier(0,.99,0,.99)';

/**
 * Duration in milliseconds for page primary leave animations.
 */
export const pagePrimaryLeaveTiming = 200;

/**
 * Animation constants for progress indicators.
 */

/**
 * Cubic bezier curve for progress primary animations.
 */
export const progressPrimaryCurve = 'cubic-bezier(.17,.4,.8,.79)';

/**
 * Duration in milliseconds for progress primary animations.
 */
export const progressPrimaryTiming = 790;

/**
 * Cubic bezier curve for progress secondary animations.
 */
export const progressSecondaryCurve = 'cubic-bezier(.34,.01,.39,1)';

/**
 * Duration in milliseconds for progress secondary animations.
 */
export const progressSecondaryTiming = 200;

/**
 * Animation constants for icon animations.
 */

/**
 * Timing function for line/icon primary enter animations (linear).
 */
export const linePrimaryEnterCurve = 'linear';

/**
 * Duration in milliseconds for line primary enter animations.
 */
export const linePrimaryEnterTiming = 250;

/**
 * Delay in milliseconds before line primary enter animations start.
 */
export const linePrimaryEnterDelay = 200;

/**
 * Timing function for line/icon secondary enter animations (linear).
 */
export const lineSecondaryEnterCurve = 'linear';

/**
 * Duration in milliseconds for line secondary enter animations.
 */
export const lineSecondaryEnterTiming = 400;

/**
 * Delay in milliseconds before line secondary enter animations start.
 */
export const lineSecondaryEnterDelay = 200;

/**
 * Animation constants specific to clr-lift (CLL) components.
 */

/**
 * Duration in milliseconds for close icon animations.
 */
export const CLOSE_ICON_DURATION = 300;

/**
 * Delay in milliseconds before close icon animations start.
 */
export const CLOSE_ICON_DELAY = 350;

/**
 * Cubic bezier curve for close icon animations.
 */
export const CLOSE_ICON_CURVE = 'cubic-bezier(0, 1.2, 0.7, 1)';

/**
 * Duration in milliseconds for gradient animations.
 */
export const GRADIENT_DURATION = 500;

/**
 * Delay in milliseconds before gradient animations start.
 */
export const GRADIENT_DELAY = 100;

/**
 * Cubic bezier curve for gradient leave animations.
 */
export const GRADIENT_LEAVE_CURVE = 'cubic-bezier(0, 1.2, 0.7, 1)';

/**
 * Duration in milliseconds for stagger animations (sequential element animations).
 */
export const STAGGER_DURATION = 200;

/**
 * Multiplier used for animation debugging.
 * Set to 1 for normal speed, increase to slow down animations, decrease to speed up.
 */
const ANIMATION_MULTIPLIER = 1;

/**
 * Multiplies an animation timing value by the animation multiplier.
 * Useful for debugging animations by adjusting their speed globally.
 *
 * @param value - The animation timing value in milliseconds.
 * @returns The multiplied timing value.
 *
 * @example
 * ```typescript
 * const duration = multiply(200); // Returns 200 * ANIMATION_MULTIPLIER
 * ```
 */
export function multiply(value: number) {
  return value * ANIMATION_MULTIPLIER;
}
