import {DOCUMENT} from '@angular/common';
import {DestroyRef, inject, InjectionToken} from '@angular/core';

import {QueryClient} from './query-client';

/** Application-scoped client. Each server request must use its own Angular injector. */
export const QUERY_CLIENT = new InjectionToken<QueryClient>('QUERY_CLIENT', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    const client = new QueryClient({
      // Server rendering may fetch initially, but should never schedule background polling.
      isVisible: () => !!document.defaultView && document.visibilityState !== 'hidden',
      subscribeVisibility: (listener) => {
        if (!document.defaultView) {
          return () => undefined;
        }
        document.addEventListener('visibilitychange', listener);
        return () => document.removeEventListener('visibilitychange', listener);
      },
    });
    inject(DestroyRef).onDestroy(() => client.destroy());
    return client;
  },
});
