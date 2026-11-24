# Upload transport configuration behind gateways

Applications own deployment topology, request deadlines and backend protocol limits. The upload queue owns slicing,
chunk scheduling, progress, cancellation and retry state. Keep gateway detection and transport policy in the consuming
application; no deployment-specific configuration belongs in the shared library.

## Choose chunk size and concurrency together

The rendered control defaults to `UPLOAD_CHUNK_25MB` and two concurrent chunks. The headless queue takes explicit
options. `UPLOAD_CHUNK_5MB` and `UPLOAD_CHUNK_25MB` are byte constants using binary MiB units, despite their existing
export names. They are presets, not guarantees that a request will finish before a particular deadline.

A gateway can impose an absolute deadline for each request even while bytes are flowing. This differs from an idle
socket timeout, which may reset when traffic arrives. Increasing a browser-side timeout or retrying an unchanged
oversized request does not remove a gateway deadline.

For a rough estimate with `C` simultaneous equal-size chunks sharing a link:

```text
request time ≈ chunk bytes × 8 × C / effective uplink bits per second
```

Use effective available bandwidth, not the nominal connection speed. Reserve substantial headroom for request overhead,
server work, variable bandwidth and gateway buffering. A payload-size ceiling can constrain the choice independently.

For example, two 5 MiB chunks require about 1.40 Mbps to transfer within 60 seconds under ideal equal sharing. At 1.5
Mbps, the estimated transfer alone takes about 56 seconds; this is insufficient evidence of reliable operation. Two 25
MiB chunks need about 6.99 Mbps under the same idealized assumptions. Smaller chunks improve deadline headroom but
increase request count; reducing concurrency can also help when streams compete for constrained bandwidth.

## Apply application-owned policy before enqueueing

The application can supply `[chunkSize]` and `[concurrency]` to `cll-upload`, or pass the same policy to the queue. For
example, an application deployment setting can choose between two validated policies:

```ts
import {type UploadAdapter, UploadQueueService, UPLOAD_CHUNK_5MB, UPLOAD_CHUNK_25MB} from 'ngx-lift';

function enqueueFiles(
  queue: UploadQueueService,
  files: readonly File[],
  adapter: UploadAdapter,
  constrainedGateway: boolean,
) {
  const policy = {
    chunkSize: constrainedGateway ? UPLOAD_CHUNK_5MB : UPLOAD_CHUNK_25MB,
    concurrency: 2,
  };
  return queue.enqueue(files, {
    adapter,
    ...policy,
    autoRetry: false,
    maxRetries: 3,
    pollIntervalMs: 10_000,
  });
}
```

The application must establish that either policy satisfies its backend contract and tested deployment conditions. Where
many upload entry points share the policy, an application-owned configuration service or injection token can centralize
the decision. A new library-wide provider API is not needed to pass these existing options.

Options are copied when each file is enqueued. Changing a component input or application configuration affects later
intake, not existing queued or running files. Chunk-phase retry preserves the upload session, acknowledged chunks,
numbering and original chunk boundaries. Do not change chunk size within an existing session unless the backend
explicitly supports repartitioning; starting a new session may require cleanup of the previous one.

`concurrency` counts chunks within one file. Files are processed serially. Byte slicing uses Blob views; the size of
in-flight request payloads is not a direct measurement of JavaScript heap usage. Adapters that hash or decode entire
files can have additional memory costs.

## Preserve the transport protocol

Generic slicing is useful only when the server accepts the corresponding numbered chunks and assembly protocol. The
[whole-object S3 example](./s3-object-uploads.md) must send exactly one complete PUT per file. Lowering its chunk size
would split the payload into unsupported requests; it needs a separately designed multipart adapter and backend before
that policy can apply. Other multipart protocols can impose minimum part sizes and maximum part counts.

Map a gateway rejection to a readable error with its transport diagnostic. Whether an ambiguous timeout can be retried
safely depends on idempotency and server reconciliation. Honor the supplied AbortSignal, and do not run assembly or
registration after a failed upload. A frontend progress bar reaching 100% does not prove server processing completed.

## Verify policy through behavior

- Exercise the application's actual configuration branches; adding an override only inside a test does not prove the
  production environment selected it. Avoid assertions against private dependency-injection internals.
- Check emitted chunk sizes, sequence numbers, total count and the final partial chunk. Verify configuration remains
  stable across changes to caller-owned options and retries, and acknowledged chunks are not resent unnecessarily.
- Use a controlled per-request deadline fixture to demonstrate that oversized concurrent chunks fail, repeating the same
  oversized request can fail again, and smaller chunks can finish the file over multiple requests. The fixture should
  allow total file duration to exceed one request's deadline.
- Verify failure prevents assembly, and cancellation and late callbacks cannot resume the session.
- Test representative deployments with their real proxy, backend and supported network conditions. Deterministic adapter
  tests prove queue behavior, not actual gateway throughput, buffering, timeout settings or production safety.

The queue's [transport regressions](../../libs/ngx-lift/src/lib/upload/upload-queue.service.spec.ts) cover a
deterministic shared-link/deadline model and immutable retry boundaries. They intentionally use small byte counts and
virtual time; they are not a performance benchmark or verification of any specific proxy product.
