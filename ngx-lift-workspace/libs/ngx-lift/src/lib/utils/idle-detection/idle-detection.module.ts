import {ModuleWithProviders, NgModule} from '@angular/core';

import {IdleDetectionConfig, provideIdleDetectionConfig} from './idle-detection.config';

/**
 * Idle detection module.
 * @deprecated use provideIdleDetectionConfig(config: IdleDetectionConfig) instead
 */
@NgModule({
  imports: [],
})
export class IdleDetectionModule {
  static forRoot(config: IdleDetectionConfig): ModuleWithProviders<IdleDetectionModule> {
    return {
      ngModule: IdleDetectionModule,
      providers: [provideIdleDetectionConfig(config)],
    };
  }
}
