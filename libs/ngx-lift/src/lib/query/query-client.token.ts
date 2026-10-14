import {DOCUMENT} from '@angular/common';
import {
  DestroyRef,
  EnvironmentProviders,
  ErrorHandler,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

import {QueryClientOptions} from './query.models';
import {QueryClient} from './query-client';

/** Application-scoped client. Each server request must use its own Angular injector. */
export const QUERY_CLIENT = new InjectionToken<QueryClient>('QUERY_CLIENT', {
  providedIn: 'root',
  factory: () => createAngularQueryClient(),
});

/** Configure an application-scoped client while retaining Angular visibility, recovery, and disposal wiring. */
export function provideQueryClient(options: QueryClientOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{provide: QUERY_CLIENT, useFactory: () => createAngularQueryClient(options)}]);
}

function createAngularQueryClient(options: QueryClientOptions = {}): QueryClient {
  const document = inject(DOCUMENT);
  const errorHandler = inject(ErrorHandler);
  const listen = (target: EventTarget | null, event: string, listener: () => void) => {
    target?.addEventListener(event, listener);
    return () => target?.removeEventListener(event, listener);
  };
  const client = new QueryClient({
    ...options,
    // Server rendering may fetch initially, but should never schedule background polling.
    isVisible: options.isVisible ?? (() => !!document.defaultView && document.visibilityState !== 'hidden'),
    subscribeVisibility:
      options.subscribeVisibility ??
      ((listener) => listen(document.defaultView ? document : null, 'visibilitychange', listener)),
    subscribeFocus: options.subscribeFocus ?? ((listener) => listen(document.defaultView, 'focus', listener)),
    subscribeReconnect: options.subscribeReconnect ?? ((listener) => listen(document.defaultView, 'online', listener)),
    onDiagnostic: options.onDiagnostic ?? ((error) => errorHandler.handleError(error)),
  });
  inject(DestroyRef).onDestroy(() => client.destroy());
  return client;
}
