import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {SvgIconRegistryService} from 'angular-svg-icon';

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
 * Common test providers for components that need SvgIconRegistryService
 */
export const provideTestSvgIcon = () => [
  {
    provide: SvgIconRegistryService,
    useValue: {
      loadSvg: () => {
        // Mock implementation
      },
    },
  },
];

/**
 * Comprehensive test providers for common Angular dependencies
 */
export const provideCommonTesting = () => [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideNoopAnimations(),
  provideRouter([]),
  {
    provide: SvgIconRegistryService,
    useValue: {
      loadSvg: () => {
        // Mock implementation
      },
    },
  },
];
