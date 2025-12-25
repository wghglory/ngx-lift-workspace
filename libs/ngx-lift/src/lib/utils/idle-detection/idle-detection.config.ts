import {makeEnvironmentProviders} from '@angular/core';

/**
 * Configuration options for the idle detection service.
 * Used to customize the idle duration and timeout duration for user inactivity detection.
 */
export class IdleDetectionConfig {
  /**
   * The duration in seconds before the user is considered idle.
   * After this duration, the idle detection phase ends and countdown begins.
   * Defaults to 19 minutes (1140 seconds) if not provided.
   */
  idleDurationInSeconds?: number;

  /**
   * The duration in seconds for the countdown phase after idle detection.
   * During this phase, the user can still interact to reset the timer.
   * After this duration, the timeout event is emitted.
   * Defaults to 1 minute (60 seconds) if not provided.
   */
  timeoutDurationInSeconds?: number;
}

/**
 * Provides configuration for the idle detection service.
 * This function should be used in the application's providers array to configure idle detection.
 *
 * @param config - The idle detection configuration object.
 * @returns Environment providers for the idle detection configuration.
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideIdleDetectionConfig({
 *       idleDurationInSeconds: 15 * 60, // 15 minutes
 *       timeoutDurationInSeconds: 60 // 1 minute
 *     })
 *   ]
 * };
 * ```
 */
export function provideIdleDetectionConfig(config: IdleDetectionConfig) {
  return makeEnvironmentProviders([{provide: IdleDetectionConfig, useValue: config}]);
}
