# S3 object uploads with the shared queue

The [upload demo](../../apps/demo/src/app/clr-lib/pages/upload-demo/s3-upload-demo.component.ts) includes a whole-object
S3-style PUT example at `/clr-lift/components/upload`. Start the existing demo app with `pnpm nx serve demo` and find
**S3 object uploads**.

The example uses the existing public upload contracts without changing either library. The
[application adapter](../../apps/demo/src/app/clr-lib/pages/upload-demo/s3-upload-demo.adapter.ts) is demo code, not a
supported S3 client or new library export.

## Try it

1. Select files, choose a bucket and object-key prefix, and click Upload.
2. Upload the same filename to the same destination with overwrite off: the simulated proxy returns HTTP 412.
3. Enable overwrite and upload it again.
4. Edit the bucket or prefix while a batch is running: queued files keep their original destination.
5. Cancel, minimize, retry a failed transfer, or navigate within the demo using the shared transfer panel.

The demo hashes actual file bytes and constructs real HttpClient requests. Its
[interceptor](../../apps/demo/src/app/clr-lib/pages/upload-demo/s3-upload-demo.fixture.ts) simulates progress and
conditional writes in memory; it stores keys only, discards file contents, and resets on reload. It does not contact an
S3 service. The completed-destinations list is local to this demo component; it is not a bucket listing.

## Mapping a whole-object PUT

| Queue method           | Application adapter responsibility                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `initiate(file)`       | Allocate a local ID and capture the File and destination URL. No server session is needed.                               |
| `uploadChunk(request)` | Hash the whole file, send one raw PUT, map progress, and abort HttpClient on signal cancellation.                        |
| `combine()`            | No remote assembly: PUT has already committed the object. Notify the application after the HTTP response.                |
| `cancel()`             | Release local state. Aborting a PUT is not proof that the server did not commit it; do not delete an object as rollback. |
| `getStatus()`          | Omit when a successful PUT response is the final acknowledgement.                                                        |

**A whole-object PUT must use exactly one chunk per file.** The demo sets `chunkSize: Number.MAX_SAFE_INTEGER` and
rejects multi-chunk calls in the adapter. Sending each generic queue chunk to the same object URL would repeatedly
replace the object, not assemble it.

The application captures bucket, prefix and overwrite policy when it enqueues a batch. It encodes key segments
independently and sends `Content-Type`, `x-amz-content-sha256`, and, with overwrite disabled, `If-None-Match: *`.
Authentication and S3 signing belong to the same-origin proxy. This endpoint is an example API contract; a real
application must map it to its own authenticated server. Path-based proxies also need an explicit policy for dot-only
key segments and other URL-normalized keys; use an opaque key parameter if arbitrary S3 keys must be preserved.

Hashing reads the entire file into memory, so the demo restricts each file to **16 MiB**. This is an example limit, not
a library or S3 object limit. Hashing runs in the phase receiving an AbortSignal. Web Crypto digest cannot itself be
interrupted, but checks before and after each asynchronous preparation step prevent a cancelled hash from starting a
PUT. Large objects need a separately designed hashing strategy and server-supported upload protocol.

## Adoption boundaries

| Requirement                                                                  | Current behavior                                                                                                                                                          |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multiple selected files, progress, cancel, retry, shared background panel    | Available through existing queue and rendered controls.                                                                                                                   |
| Several files uploading in parallel                                          | Not available: the queue processes files serially. `concurrency` means chunks within one file, not files.                                                                 |
| Destination, overwrite policy, permission checks, duplicate-key confirmation | Application-owned staging and adapter context. The shared panel displays filenames, not destination buckets.                                                              |
| Directory hierarchy                                                          | Recursive selection does not establish a relative-path contract. This adapter uses file.name under the chosen prefix; folder hierarchy is not preserved.                  |
| Bucket creation and empty-folder marker objects                              | Separate application operations; not file upload lifecycle methods.                                                                                                       |
| List refresh after navigation                                                | Use a root application success bridge with destination context. Component-owned output handlers and lists do not survive route teardown.                                  |
| Document unload warning                                                      | Application-owned; an in-page minimized panel does not survive browser reload.                                                                                            |
| Real S3 multipart                                                            | Requires create/upload-part/complete/abort operations, part ETags, ordering, limits and reconciliation in an adapter and backend. Generic chunking alone is insufficient. |
| Resume after reload                                                          | Not provided. Queue state and acknowledgements exist only in memory.                                                                                                      |

The demo disables automatic retry: an ambiguous PUT response can mean the server committed the object even when the
client saw failure. In particular, retrying a conditional write may return 412 after a successful but unacknowledged
first write. A production application needs reconciliation and a deliberate retry policy.

## Verification boundary

The [browser journeys](../../apps/demo-e2e/src/s3-upload.spec.ts) check staging, conditional overwrite, actual PUT
bodies and SHA-256 headers, encoded keys, frozen destinations, empty files, manual retry and cancellation during hashing
and transport. They exercise the queue and application adapter with simulated or intercepted responses. They do not
establish S3 backend interoperability, signing, proxy authorization, CORS, or production-scale performance.

For network integration tests, set `window.__s3UploadDemoStub = false` before application initialization and provide the
same-origin proxy or intercept its requests. The browser tests demonstrate this switch. If a real deployment uses
Angular's Fetch backend, verify progress behavior separately; Fetch does not provide XMLHttpRequest upload progress
events.
