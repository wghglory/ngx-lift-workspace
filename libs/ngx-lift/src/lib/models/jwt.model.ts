/**
 * Standard JWT claims payload structure.
 */
export interface JwtClaims {
  /** Expiration time in seconds since Unix epoch */
  exp?: number;
  /** Issued at time in seconds since Unix epoch */
  iat?: number;
  /** Subject identifier */
  sub?: string;
  /** Open custom claim properties */
  [key: string]: unknown;
}
