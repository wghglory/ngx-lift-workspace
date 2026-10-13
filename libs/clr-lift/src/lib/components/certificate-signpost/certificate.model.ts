import {InjectionToken} from '@angular/core';

/**
 * Clock provider function returning the current date or timestamp.
 * Used for deterministic time testing and simulated clocks.
 */
export type CertificateClock = () => Date | number;

/**
 * Injection token for providing a custom clock to CertificateService and CertificateSignpostComponent.
 *
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   providers: [{provide: CERTIFICATE_CLOCK, useValue: () => new Date('2026-01-01T00:00:00Z')}],
 * });
 * ```
 */
export const CERTIFICATE_CLOCK = new InjectionToken<CertificateClock>('CERTIFICATE_CLOCK');

/**
 * Represents the status information for a certificate.
 * Used to display certificate validation status with appropriate styling and icons.
 */
export type CertificateStatus = {
  /**
   * The text label to display for the certificate status.
   */
  labelText: string;

  /**
   * CSS class to apply to the status label for styling.
   */
  labelClass: string;

  /**
   * The status type, which determines the color scheme and icon.
   * - `'info'`: Informational status (blue)
   * - `'success'`: Valid/positive status (green)
   * - `'warning'`: Warning status (yellow/orange)
   * - `'danger'`: Error/invalid status (red)
   */
  status: 'info' | 'success' | 'warning' | 'danger';

  /**
   * The Clarity icon shape to display.
   * - `'error-standard'`: Error icon
   * - `'exclamation-triangle'`: Warning icon
   * - `'success-standard'`: Success icon
   */
  shape: 'error-standard' | 'exclamation-triangle' | 'success-standard';
};
