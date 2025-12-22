import {fqdnRegex, httpsPattern, ipRegex, urlPattern} from '../const';

/**
 * Check if hostname is IP
 * @param hostname new URL(your-url).hostname
 * @returns true if hostname is a IP
 */
export function isIP(hostname: string) {
  return ipRegex.test(hostname);
}

/**
 * Check if hostname is FQDN
 * @param hostname new URL(your-url).hostname
 * @returns true if hostname is a FQDN
 */
export function isFQDN(hostname: string) {
  return fqdnRegex.test(hostname);
}

/**
 * Check if url is valid
 * @param url
 * @returns true if valid
 */
export function isURL(url: string) {
  return urlPattern.test(url);
}

/**
 * Check if a url starts with https, the url must be a valid url.
 * @param url
 * @returns true if it's a https valid url
 */
export function isHttps(url: string) {
  return httpsPattern.test(url);
}
