import {fqdnRegex, ipRegex} from '../const';

/**
 * Checks if a hostname is a valid IPv4 address.
 *
 * @param hostname - The hostname to check. Should be extracted from `new URL(url).hostname`
 * @returns `true` if the hostname is a valid IPv4 address, `false` otherwise
 *
 * @example
 * ```typescript
 * const url = new URL('http://192.168.1.1');
 * isIP(url.hostname); // true
 *
 * const url2 = new URL('http://example.com');
 * isIP(url2.hostname); // false
 * ```
 */
export function isIP(hostname: string): boolean {
  return ipRegex.test(hostname);
}

/**
 * Checks if a hostname is a valid Fully Qualified Domain Name (FQDN).
 *
 * @param hostname - The hostname to check. Should be extracted from `new URL(url).hostname`
 * @returns `true` if the hostname is a valid FQDN, `false` otherwise
 *
 * @example
 * ```typescript
 * const url = new URL('http://example.com');
 * isFQDN(url.hostname); // true
 *
 * const url2 = new URL('http://192.168.1.1');
 * isFQDN(url2.hostname); // false
 * ```
 */
export function isFQDN(hostname: string): boolean {
  return fqdnRegex.test(hostname);
}

/**
 * Checks if a string is a valid URL.
 *
 * @param url - The URL string to validate
 * @returns `true` if the string is a valid URL, `false` otherwise
 *
 * @example
 * ```typescript
 * isURL('https://example.com'); // true
 * isURL('not-a-url'); // false
 * ```
 */
export function isURL(url: string): boolean {
  return parseHttpUrl(url) !== null;
}

/**
 * Checks if a URL string uses the HTTPS protocol.
 * The URL must be a valid URL format.
 *
 * @param url - The URL string to check
 * @returns `true` if the URL is valid and uses HTTPS protocol, `false` otherwise
 *
 * @example
 * ```typescript
 * isHttps('https://example.com'); // true
 * isHttps('http://example.com'); // false
 * ```
 */
export function isHttps(url: string): boolean {
  return parseHttpUrl(url)?.protocol === 'https:';
}

/** Strict absolute HTTP(S) parsing. Single-label hostnames remain rejected for compatibility. */
function parseHttpUrl(value: string): URL | null {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value) || /\s/.test(value)) return null;
  try {
    const url = new URL(value);
    const host = url.hostname;
    return (url.protocol === 'http:' || url.protocol === 'https:') && (host.includes('.') || host.startsWith('['))
      ? url
      : null;
  } catch {
    return null;
  }
}
