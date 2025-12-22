import {makeEnvironmentProviders} from '@angular/core';

export class IdleDetectionConfig {
  idleDurationInSeconds?: number;
  timeoutDurationInSeconds?: number;
}

export function provideIdleDetectionConfig(config: IdleDetectionConfig) {
  return makeEnvironmentProviders([{provide: IdleDetectionConfig, useValue: config}]);
}
