import {Pipe, PipeTransform} from '@angular/core';

import {isHttps} from '../utils';

/**
 * Angular pipe that checks if a URL string uses the HTTPS protocol.
 *
 * @example
 * ```html
 * <!-- Check if URL is HTTPS -->
 * <div>{{ 'https://example.com' | isHttps }}</div>
 * <!-- Output: true -->
 *
 * <div>{{ 'http://example.com' | isHttps }}</div>
 * <!-- Output: false -->
 * ```
 */
@Pipe({
  name: 'isHttps',
})
export class IsHttpsPipe implements PipeTransform {
  /**
   * Transforms a URL string into a boolean indicating whether it uses HTTPS.
   *
   * @param value - The URL string to check
   * @returns `true` if the URL uses HTTPS protocol, `false` otherwise
   */
  transform(value: string): boolean {
    return isHttps(value);
  }
}
