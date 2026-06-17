import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

/**
 * Common test providers for components that need HTTP client
 */
export const provideTestHttpClient = () => [provideHttpClient(), provideHttpClientTesting()];

/**
 * Common test providers for components that need animations (no-op for unit tests)
 */
export const provideTestAnimations = () => [provideNoopAnimations()];

/**
 * Common test providers for components that need ActivatedRoute
 */
export const provideTestRouter = () => [provideRouter([])];

/**
 * Comprehensive test providers for common Angular dependencies
 */
export const provideCommonTesting = () => [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideNoopAnimations(),
  provideRouter([]),
];
