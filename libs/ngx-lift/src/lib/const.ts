/**
 * Regular expression pattern for validating email addresses.
 * Supports standard email formats including subdomains and various TLDs.
 *
 * @see {@link https://regex101.com/library/mX1xW0 | Regex Pattern Reference}
 *
 * @example
 * ```typescript
 * emailPattern.test('user@example.com'); // true
 * emailPattern.test('invalid-email'); // false
 * ```
 */
export const emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

/**
 * Regular expression pattern for validating HTTP and HTTPS URLs.
 * Supports URLs with or without www subdomain, various protocols, and query parameters.
 *
 * @example
 * ```typescript
 * urlPattern.test('https://example.com'); // true
 * urlPattern.test('http://www.example.com/path?query=1'); // true
 * urlPattern.test('invalid-url'); // false
 * ```
 */
export const urlPattern =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

/**
 * Regular expression pattern for validating HTTPS URLs only.
 * Similar to `urlPattern` but requires the HTTPS protocol.
 *
 * @example
 * ```typescript
 * httpsPattern.test('https://example.com'); // true
 * httpsPattern.test('http://example.com'); // false
 * ```
 */
export const httpsPattern =
  /^https:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

/**
 * Regular expression pattern for validating IPv4 addresses.
 * Supports all valid IPv4 address ranges (0.0.0.0 to 255.255.255.255).
 *
 * @see {@link https://regex101.com/library/dT0vT3?orderBy=RELEVANCE&search=ip | Regex Pattern Reference}
 *
 * @example
 * ```typescript
 * ipRegex.test('192.168.1.1'); // true
 * ipRegex.test('256.1.1.1'); // false
 * ipRegex.test('not-an-ip'); // false
 * ```
 */
export const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Regular expression pattern for validating Fully Qualified Domain Names (FQDN).
 * A FQDN is a domain name that specifies its exact location in the tree hierarchy of the Domain Name System (DNS).
 * The pattern validates domain names between 4 and 253 characters with proper formatting.
 *
 * @see {@link https://www.regextester.com/103452 | Regex Pattern Reference}
 *
 * @example
 * ```typescript
 * fqdnRegex.test('example.com'); // true
 * fqdnRegex.test('subdomain.example.com'); // true
 * fqdnRegex.test('invalid..domain'); // false
 * ```
 */
export const fqdnRegex = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/;
