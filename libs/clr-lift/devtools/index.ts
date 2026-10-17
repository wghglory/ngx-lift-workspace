import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

// Workspace production alias mirrors the installed package's default export condition.
export function provideQueryDevtools(): EnvironmentProviders {
  return makeEnvironmentProviders([]);
}
