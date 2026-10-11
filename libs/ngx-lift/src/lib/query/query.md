# Shared queries and explicit mutations

`queryResource` observes shared server data through an application-scoped `QueryClient`. Use `resourceAsync` for
independent local async state, and `mutationResource` for explicit writes. All APIs are exported from `ngx-lift`.

```typescript
import {inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {mutationResource, observableLoader, queryResource} from 'ngx-lift';

interface Pod {
  name: string;
}

// Inside a component or service injection context:
const http = inject(HttpClient);
const tenant = signal('tenant-a');
const pods = queryResource(
  () => {
    const scope = tenant();
    return {
      key: ['pods', scope],
      loader: observableLoader(() => http.get<Pod[]>(`/api/tenants/${scope}/pods`)),
      tags: [{type: 'Pods', scope}],
      staleTime: 30_000,
    };
  },
  {pollInterval: 60_000},
);

const renamePod = mutationResource((args: {scope: string; name: string}) => http.post<Pod>('/api/pods/rename', args), {
  invalidatesTags: (_result, args) => [{type: 'Pods', scope: args.scope}],
});

await renamePod.mutate({scope: tenant(), name: 'updated-name'});
await pods.execute();
```

## Keys, freshness, and lifecycle

Include every response-changing parameter and authorization scope in the key. Keys accept finite JSON values, plain
objects, and arrays; object property order is canonicalized. Dates, functions, accessors, sparse arrays, and circular
references are rejected. Equal keys must describe the same data and result type.

`staleTime` defaults to zero; `gcTime` defaults to five minutes. Policies for a shared key reconcile to the shortest
freshness and longest retention. A normal read joins pending transport, returns fresh cached data, or starts a read.
`execute()` and `reload()` bypass completed cache data while joining current valid work. Polling waits for completion,
uses the fastest observer interval, pauses while the browser document is hidden, and is disabled during server
rendering.

Capture signals in the definition factory; loader signal reads are untracked. Return `undefined` to disable the
resource. Changing the key hides old data immediately. Background errors retain the last successful value. `hasValue()`
narrows away `undefined`; a successful `undefined` response still has `QuerySnapshot.hasValue === true` at the client
layer.

Destroying an observer leaves other observers and shared reads active. `cancelOnNoObservers: true` opts into
cancellation when every reader of the key permits it. `removeQueries()` aborts all transport for matching entries and
clears observers; a query resource remains idle until explicitly reloaded or its key changes. `observeQueryObservable()`
completes on removal, including removal during its initial synchronous snapshot callback. Destroy the standalone client
when finished. The injected `QUERY_CLIENT` is destroyed with its Angular injector; use a separate injector/client per
server request.

## Invalidation and writes

Tags with no `id` invalidate every entity of the type within the same scope. An omitted scope is the unscoped namespace,
not every tenant. Invalidation detaches obsolete generations before refetching active queries, so responses started
before a write cannot replace newer cache state. Forward the loader context's `refresh` flag when fetching dependent
queries.

Mutations run only when `mutate(args)` is invoked. Parallel writes are the default; `exhaust` joins a pending write and
`concat` queues writes. Pass immutable argument snapshots. Successful writes invalidate tags without awaiting background
refetch. Only the latest invocation owns the displayed result; loading remains true while any accepted write is pending.
Disposal does not cancel an already submitted server write. Failed calls reject their Promise and update the error
signal.

Use `fetchQueryObservable()` for a cold finite read and `observeQueryObservable()` for a stream of shared snapshots.
`observableLoader()` preserves synchronous HttpClient dispatch and unsubscribes on cancellation or the first result. An
empty Observable rejects with `EmptyError`.
