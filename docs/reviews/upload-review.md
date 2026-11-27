# Upload code review

> Historical review of baseline `e0facfd7` (2026-11-26), with fixes recorded on 2026-11-27. Findings below describe that
> baseline, not outstanding defects. See the [review index](upload-and-reactive-apis.md) for fix disposition,
> compatibility notes, and verification boundaries. Architecture specs own current contracts.

This review records **7 historical findings**.

## Upload files

### P1 · A pending folder drop can move to a different destination

Drop a folder while adapter A and scope A are bound. Switch both bindings to B while the directory reader is pending,
then let it finish. The probe observed one initiation on B and zero on A. The picker captures a selection version before
the await but reads the adapter and scope afterward. The spec says a scope change affects new selections only. Capture
the destination at drop time or discard the pending selection on a destination change. Keep the two-adapter test and
assert that B receives no file from A's drop.
[Drop handler](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L184) ·
[Destination lookup](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L223) ·
[Scope contract](../design/clr-lift/upload-design-spec.md#L1087)

### P1 · Resetting the form can still start the discarded upload

A real Reactive Forms host reset its control synchronously from `valueChanges` when a file was selected. The control
ended with an empty array, yet the adapter ran and the queue reported success. The picker calls the CVA change handler
and emits `filesChange` before it enqueues and records ownership. During those callbacks, `writeValue` can clear the
selection while there is still nothing to remove from the queue. Check the selection version after synchronous user
callbacks and before committing transport. Exercise both a form reset and a `filesChange` handler that clears the
picker. [Selection and enqueue](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L270) ·
[Owner reset](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L324) ·
[Form contract](../design/clr-lift/upload-design-spec.md#L690)

### P2 · Concurrent chunk failures can retry a permanent rejection

With two chunks in flight, the first failed with `retryable: true` and the second with `retryable: false`. Both chunks
were sent a second time. Each worker records only the first failure in a shared slot, and that failure decides whether
every outstanding chunk is retried. Preserve the non-retryable outcome when concurrent requests disagree. Test both
settlement orders and assert that the permanently rejected chunk is sent once and its error is available to the caller.
[Chunk workers and retry](../../libs/ngx-lift/src/lib/upload/upload-queue.service.ts#L439) ·
[Retry contract](../design/clr-lift/upload-design-spec.md#L896)

### P2 · The picker can enable itself while its form control is disabled

The `disabled` input and `setDisabledState` write to one linked signal. With both sources disabled, clearing the input
binding enabled the native picker while `FormControl.disabled` remained true. Track the two sources separately and
derive the effective disabled state from both. Bind a real control and toggle each source independently. Check the
native file input, folder button, and drop path.
[Input state](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L83) ·
[CVA setter](../../libs/clr-lift/src/lib/components/upload/upload.component.ts#L171)

### P2 · Unreadable folder entries disappear from a successful batch

A directory containing a readable file and a file whose browser read callback failed produced one successful upload, a
valid control, and no rejection output. Both file-read and directory-read failures become empty arrays. A failure on a
later directory page is therefore indistinguishable from reaching the end. Preserve readable siblings and report the
failed path or directory beside the picker. Test a failed file and a failed second page. The current helper test
explicitly expects the failed file to disappear.
[Folder traversal](../../libs/clr-lift/src/lib/components/upload/drop-files.ts#L38) ·
[Existing skip test](../../libs/clr-lift/src/lib/components/upload/drop-files.spec.ts#L103)

### P2 · A server-reported failure displays English in a translated panel

With French active, an adapter returning a status of `error` displayed “Server reported a failed upload.” The queue
creates that English message, and the renderer prefers any readable message over its translated fallback. Give this
library-owned outcome a localized message that distinguishes a failed server job from an unavailable status check.
Preserve adapter-authored details. Test the rendered row and its announcement in a second locale.
[Queue error](../../libs/ngx-lift/src/lib/upload/upload-queue.service.ts#L520) ·
[Panel message selection](../../libs/clr-lift/src/lib/components/upload/upload-panel-window.component.ts#L275)

### P3 · Chunk scheduling allocates a worklist proportional to the file's chunk count

Before sending even the first chunk, the queue enumerates every unacknowledged number into an array. It repeats the full
scan after a retry. Peak scheduling memory and time to first request therefore grow with total chunk count even when
concurrency is one. This matters most for custom small chunk sizes. Use a shared next-number cursor that skips
acknowledged chunks. Verify request order, retained acknowledgements, and bounded work before the first dispatch. This
is a source-level performance finding.
[Pending chunk allocation](../../libs/ngx-lift/src/lib/upload/upload-queue.service.ts#L431)
