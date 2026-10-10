import {JwtClaims} from '../models/jwt.model';

/**
 * Default safety buffer offset in seconds when verifying JWT token expiration.
 */
export const DEFAULT_JWT_EXPIRY_OFFSET_SECONDS = 60;

/**
 * Safely decodes a single Base64 or Base64URL-encoded JWT segment (such as header or payload)
 * into a typed JSON object with UTF-8 support.
 *
 * @template T Expected type of the parsed JSON object. Defaults to `Record<string, unknown>`.
 * @param part Base64 or Base64URL encoded string segment.
 * @returns The decoded object, or `undefined` if parsing fails or input is invalid.
 *
 * @example
 * ```typescript
 * const payload = decodeJwtPart<{ sub: string }>('eyJzdWIiOiIxMjM0NTY3ODkwIn0');
 * ```
 */
export function decodeJwtPart<T = Record<string, unknown>>(part?: string | null): T | undefined {
  if (!part || typeof part !== 'string' || !part.trim()) {
    return undefined;
  }

  try {
    let base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (base64.length % 4)) % 4;
    base64 += '='.repeat(padding);

    const atobFn =
      typeof window !== 'undefined' && typeof window.atob === 'function'
        ? window.atob.bind(window)
        : (globalThis as unknown as {atob?: (s: string) => string}).atob;

    if (!atobFn) {
      return undefined;
    }

    const binaryString = atobFn(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);

    return JSON.parse(jsonString) as T;
  } catch {
    return undefined;
  }
}

/**
 * Safely extracts and decodes the payload segment from a full JWT token string (`header.payload.signature`)
 * into a typed JSON object with UTF-8 support.
 *
 * @template T Expected type of the decoded payload object. Defaults to `JwtClaims`.
 * @param token Complete JWT token string.
 * @returns The decoded payload object, or `undefined` if the token is invalid or parsing fails.
 *
 * @example
 * ```typescript
 * const claims = decodeJwtPayload('header.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNzM1Njg5NjAwfQ.signature');
 * console.log(claims?.sub); // '1234567890'
 * ```
 */
export function decodeJwtPayload<T = JwtClaims>(token?: string | null): T | undefined {
  if (!token || typeof token !== 'string') {
    return undefined;
  }

  const parts = token.split('.');
  if (parts.length < 2 || !parts[1]) {
    return undefined;
  }

  return decodeJwtPart<T>(parts[1]);
}

/**
 * Checks if a JWT token is expired based on parsed claims and a safety buffer offset.
 *
 * @param claims The JWT claims object containing `exp`.
 * @param offsetSeconds Safety buffer offset in seconds (defaults to `DEFAULT_JWT_EXPIRY_OFFSET_SECONDS`, 60s).
 * @returns `true` if expired, missing, or missing an `exp` claim; `false` otherwise.
 *
 * @example
 * ```typescript
 * const claims = decodeJwtPayload(myToken);
 * if (isJwtExpiredByClaims(claims)) {
 *   console.log('Token expired or about to expire in 60s');
 * }
 * ```
 */
export function isJwtExpiredByClaims(
  claims?: JwtClaims | null,
  offsetSeconds = DEFAULT_JWT_EXPIRY_OFFSET_SECONDS,
): boolean {
  if (!claims || typeof claims.exp !== 'number') {
    return true;
  }

  const currentEpochSeconds = Math.floor(Date.now() / 1000);
  return claims.exp - offsetSeconds <= currentEpochSeconds;
}
