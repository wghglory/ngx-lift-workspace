# Upload files design specification

Status: UX feedback finalized 2026-11-24; D1-D4 and the discussed refinements accepted by maintainer. No further UX
preference confirmations are pending. Designer alignment and engineering verification remain; implementation is
authorized by the maintainer and implemented; validation results and limits are recorded below. The original API was
approved in [PR #243](https://github.com/wghglory/ngx-lift-workspace/pull/243) (merged 2026-11-20); implementation work
continues in [PR #252](https://github.com/wghglory/ngx-lift-workspace/pull/252) (open when checked 2026-11-24). Owner:
Maintainer. Updated: 2026-11-24. Package: `ngx-lift` (headless lifecycle) and `clr-lift` (rendered UI).

This document records the agreed behavior and its implementation contract; the dated validation section identifies what
has actually been verified. The 2026-11-24 revision supersedes earlier window-control, close-confirmation and
demo-default recommendations. Historical review and validation records below apply only to their dated revisions. The
maintainer authorized implementation, iterative code review, commit and push after finalizing the UX decisions. The
validation record below distinguishes implemented changes from checks still in progress.

## Native folder authorization and application confirmation

The folder input uses `webkitdirectory`. A browser may display its own folder-sharing authorization before returning
files to the component. This is browser-owned UI, not a library/application upload confirmation; neither can suppress
that security prompt. Browse and folder selection otherwise share the default automatic validation/enqueue path. Any
additional business review dialog belongs to the application, using `autoEnqueue=false` when staging is required.

## Validation alert spacing: 2026-11-24

Keep visible external spacing between the selection dropzone and the validation alert (0.75rem). The Clarity alert host
must participate as a block for this margin to apply; the summary paragraph inside the alert retains zero top margin.

## Selection and telemetry refinement: 2026-11-24

- Apply the file-count limit to each new selection after duplicate filtering, for both files and folders. If it exceeds
  the limit, reject that entire selection with one aggregate error. Preserve the existing queue and running requests.
  Never silently accept the first N files. Hints explicitly describe the limit as per selection.
- Within the count limit, reject unsupported types and oversized files individually; valid siblings continue uploading.
- Hide the selected-count/clear-X summary in automatic upload mode. Keep it for manual staging only; the shared transfer
  list already describes automatically queued files. Do not show a cumulative used/limit ratio for a per-selection
  limit.
- Failed files retain the same type badge, filename, progress and action alignment as uploading files. Show one
  meaningful server/client error, falling back to the localized phase error when no meaningful detail exists.
  Replacement guidance remains available for application-classified non-retryable errors.
- Reserve stable telemetry slots for bytes, rate and estimated transfer time. Keep row telemetry on one line and the
  compact dock on two lines as estimates appear or disappear. Show short durations with the full localized estimate in
  the tooltip and accessible label; truncate long byte text instead of wrapping and changing panel height.

## Latest verification: screenshot refinements (2026-11-24)

- Upload component/renderer/drop helpers: 63 unit tests passed, including atomic count rejection preserving existing
  work, individual size rejection, duplicate feedback, shared modal rendering and focus restoration.
- Upload and S3 browser regressions: 108 passed across Chromium, Firefox and WebKit, including compact height stability
  with/without estimates, native Clarity colors, shared modal rows, count overflow and per-file size errors.
- Upload route light/dark accessibility checks: 6 passed across the three browsers.
- Configured lint/typecheck for clr-lift, demo and demo-e2e, translation completeness, formatting, development demo
  build and production library build passed. Existing lint warnings remain; Nx Cloud remote cache was unavailable.
- Both independent standards and spec reviews are clear after fixing misleading duplicate notices for rejected batches.
- Earlier full-suite/coverage results remain dated evidence. This refinement does not claim a fresh full validation or
  fresh installed-consumer package check: the previously recorded npm connectivity limitation remains. Human visual and
  language acceptance, CI at the pushed revision and package publication remain separate gates.

## Current recommendation and decisions

- Make validated selection start uploading automatically in the primary workflow. Remove routine pre-upload review and
  confirmation dialogs from that workflow. Preserve `autoEnqueue=false` as an advanced application-controlled staging
  capability for required metadata or a real business decision; do not require it merely to repeat file names.
- Keep one root queue and one transfer surface with expanded and compact presentations. Active work has a collapse
  action and an explicit Cancel all action, without an X/Close action or a close-to-background confirmation dialog.
- Place Clear completed beside the successful-items disclosure and remove only successful records. Preserve failure
  details and retry actions. Explicit Close on a settled batch ends that displayed session and clears its records;
  minimizing never does.
- Show queued, uploading, processing, failed and successful states truthfully. Byte transfer percentage and estimated
  transfer time must not imply that server processing has finished.
- Keep application-specific dialogs, file limits, folder affordances, cross-feature scope and browser departure
  protection in the consuming application. No new runtime dependency is proposed.

The maintainer accepted D1, revised D2, D3 and D4 on 2026-11-24, including per-file folder rejection feedback and
incremental additions during upload. The maintainer subsequently authorized implementation, review until green, commit
and push. No further preference decision is needed for the defaults recorded below. The maintainer accepts the design
frames as illustrations of the idea; placeholder counts and dimensions are not additional approval gates. Replace the
illustrative 512 MiB label with the actual application-supported limit once verified, without inventing a new limit.

| Decision                       | Recommended option                                                                                                         | Alternatives                                                                      | Approval state                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------- |
| D1: Start behavior             | Automatic upload in the primary product/demo flow; retain optional manual staging                                          | Remove staging entirely; retain confirmation as the primary workflow              | Accepted by maintainer, 2026-11-24 |
| D2: Settled Close              | Explicit Close ends the displayed settled batch and clears its terminal records; no permanent Uploads/history entry        | Clear successes only and keep failures in a compact dock until explicitly removed | Accepted by maintainer, 2026-11-24 |
| D3: Background failure         | Expand once for a newly observed failed attempt, without moving focus; respect subsequent manual collapse for that failure | Badge/count and announcement only; expand on every failure event                  | Accepted by maintainer, 2026-11-24 |
| D4: Suspected duplicate intake | Skip a metadata-matching file in the same destination scope; explain and locate its row, or offer Retry for an error       | Accept every valid selection; ask on every suspected duplicate                    | Accepted by maintainer, 2026-11-24 |

Product integration facts remain with the application/backend and UX owners: actual maximum bundle size and formats,
server support for independent upload sessions and name/version conflicts, destination identity, and the final
responsive dimensions. Folder selection and partial acceptance are part of the accepted UX; this does not imply archive
creation or server-side folder hierarchy. Verify these integration facts rather than asking the maintainer to guess
numeric limits. The concise designer feedback was finalized separately in the review conversation.

## Visual feedback revision: 2026-11-24

The maintainer's rendered review supersedes the earlier cancellation-confirmation and separate modal-list choices:

- Cancel all immediately cancels the current active snapshot. Do not display any confirmation in the dock or dialog.
- Use the design's Uploading {count} files headline for unfinished transfer work; show a separate failed suffix only
  when failures exist. Processing-only and terminal queues receive accurate status titles, never 0 active / 0 failed.
- The compact dock is a neutral two-line card with a disclosure caret, status title, byte/percentage telemetry and a
  bottom-edge progress track. It is not an outlined primary-action button. Carets inherit the same neutral text color in
  expanded, compact and success-disclosure states; keyboard focus remains visibly outlined.
- Reuse the existing upload panel renderer inside the application dialog. Add optional `UploadPanelComponent.inline`
  (boolean, default false): render the same list/progress/success UI in place, without floating chrome or dock controls,
  and suppress the floating presentation while this inline owner exists. Root queue/network ownership is unchanged. This
  member is admitted for the real dialog composition: it removes duplicated product markup without adding a domain
  protocol, dependency, root export or modal API. A modal does not maintain a second file-list implementation.
- Validation alert summaries start at the top without paragraph top margin. Clear validation errors is the standard
  Clarity `btn-link` action, with no custom text color. Place this action immediately below the tinted alert so default
  action color and contrast remain valid. Use standard Clarity alert markup, bounded details and explicit spacing.
- Application dialog content uses explicit vertical gaps between banner, picker and the shared inline panel. The shared
  list has a bounded scroll height; the native dialog body can also scroll on constrained screens. Successful rows use
  the same compact anatomy as the dock.

Earlier 2026-11-24 passing results below establish the preceding revision only. This rendered-feedback revision must
receive new focused unit/browser/visual validation and code review before it is reported as green.

## Applicable contracts

| Contract               | Applies | Reason                                                                                                                                  |
| ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Value/form integration | Yes     | `cll-upload` is a value control for `readonly File[]`; CVA, typed Reactive Forms, ngModel and the existing `toSignalForm` facade apply. |
| Rendered UI            | Yes     | Non-modal Clarity-styled panel, focus, keyboard, touch, responsive layout, light/dark, RTL and localization apply.                      |
| Reactive/async APIs    | Yes     | Chunk uploads, cancellation, retries, combine and task polling are async with races and disposal duties.                                |
| Shared state/cache     | Yes     | The root queue service owns session state that survives in-app navigation; observer ownership and scope isolation apply.                |
| Other utilities        | No      | The adapter is transport-agnostic; no browser storage or global cache is introduced.                                                    |

This is a value control and an overlay owner at the same time. Form value (`readonly File[]`) stays independent from
interaction state (queue, progress, minimized panel), following the shared
[forms contract](forms-compatibility-design-spec.md).

## Admission decision

Check date: 2026-11-20. Consumer evidence was supplied in the design review from a downstream enterprise UI codebase
outside this repository; public documentation intentionally describes the consumer generically. Named consumer details
and interview notes are recorded in the PR, not in this public spec. Three real services were observed for
release/update bundle upload (including data-plane and data-service bundles), container image tarball upload, and a
newer signals-based reimplementation. They duplicate `initiate -> chunks -> combine -> poll -> cancel` logic and report
hardcoded chunk-size technical debt.

| Symbol                                      | Admission evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Verdict         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `UploadAdapter`, `UploadChunkRequest`       | Consumer: three downstream chunked services need a transport seam. Native API: `XMLHttpRequest.upload` and `abort()` provide progress/cancellation but no lifecycle contract. Existing export: none. Domain-neutral: `uploadId`, `chunkNumber`, `totalChunks` are protocol roles, not vendor fields. Private API/global side effects: none; adapter owns I/O. Timing/purity: state-driven, no fixed delays. Accessibility: no UI owned. Language: no UI text owned. Dependency: none. Fit: root `ngx-lift` export from `lib/upload`; no secondary entry point.                                                                                                                                                                                          | Proceed to spec |
| `UploadQueueService`                        | Consumer: duplicated queue/state logic across three services. Native API: no Angular queue for chunk lifecycle. Existing export: none. Domain-neutral: generic chunk lifecycle, no vendor fields. Private API/global side effects: root-scoped service; no DOM mutation or global styles. Timing/purity: no fixed UI delays; polling interval is an explicit option. Accessibility: exposes state for UI symbols; owns no DOM. Language: no UI text owned. Dependency: none. Fit: root `ngx-lift` export from `lib/upload`; no secondary entry point.                                                                                                                                                                                                   | Proceed to spec |
| `UploadQueueService.completion(id)`         | Consumer: the downstream registration flow needs to await a transfer before writing bundle metadata; maintainer requested a promise completion path on 2026-11-20. Native API: signals plus `firstValueFrom` can observe a transition but cannot express terminal-state, removal and retry semantics without injector-bound glue, and `resourceAsync.execute()` observes a different model. Existing export: none. Domain-neutral: id-based terminal-state await. Private API/global side effects: uses queue state transitions only; no DOM or timers. Timing/purity: settles on state transitions, no delays. Accessibility: no UI owned. Language: no strings owned. Dependency: none. Fit: method on the admitted root service; no new entry point. | Proceed to spec |
| `UploadItem`, `UploadStatus`, `UploadError` | Consumer: observed services need `uploading/done/error` plus cancelled and processing states. Native API: none. Existing export: none. Domain-neutral: lifecycle roles only. Private API/global side effects: none; plain data contracts. Timing/purity: immutable snapshots driven by queue state. Accessibility: no UI owned; `UploadPanelComponent` exposes names and states. Language: error codes are English API identifiers; display text is owned by UI. Dependency: none. Fit: typed public contract in `ngx-lift`.                                                                                                                                                                                                                            | Proceed to spec |
| `UPLOAD_CHUNK_5MB`, `UPLOAD_CHUNK_25MB`     | Consumer: downstream uses 25 MB by default and 5 MB in proxy mode. Native API: none. Existing export: none. Domain-neutral: numeric presets with no vendor fields. Private API/global side effects: none; static constants. Timing/purity: pure values. Accessibility: no UI owned. Language: no UI text owned. Dependency: none. Fit: shared defaults in `ngx-lift`.                                                                                                                                                                                                                                                                                                                                                                                   | Proceed to spec |
| `UploadComponent` (`cll-upload`)            | Consumer: file selection, validation and CVA needed by the same callers. Native API: native input alone lacks queue/error/success state. Existing export: `cll-file-reader` explicitly excludes upload. Domain-neutral: generic file input and queue, no vendor fields. Private API/global side effects: scoped host only; overlay is owned by the panel. Timing/purity: state-driven, no fixed delays. Accessibility: keyboard, focus and names specified below. Language: all owned strings listed below. Dependency: none. Fit: `clr-lift` component.                                                                                                                                                                                                | Proceed to spec |
| `UploadPanelComponent` (`cll-upload-panel`) | Consumer: callers want progress visible while using the rest of the page and want minimize/restore. Native API: `clr-modal` is blocking; no built-in non-modal task panel. Existing export: none. Domain-neutral: generic progress surface. Private API/global side effects: CDK overlay with no backdrop, disposed on teardown, no global styles. Timing/purity: state-driven; no animation-dependent behavior. Accessibility: focus ownership, Escape and announcements specified below. Language: all owned strings listed below. Dependency: CDK already present. Fit: `clr-lift` component.                                                                                                                                                        | Proceed to spec |

No proposed symbol is rejected. The admission gate result is **Proceed to spec** for all seven rows.

## Background

The downstream release/update flow lets an operator select a bundle, shows upload progress, allows cancellation, reports
errors, and surfaces completion through an application-level alert. The same application uploads container image
tarballs with the same four-step protocol. A newer signals-based service reimplements the flow instead of sharing it.
Chunk size is 25 MB by default, 5 MB in proxy mode, with concurrency 2. At the original consumer review, those
downstream implementations supported neither retry, byte-offset resume, nor a minimizable progress window; cancellation
is a confirmation modal followed by a server-side delete.

Clarity supplies the visual pieces (file input container, progress bar, alerts, modals) but not the lifecycle.
`cll-file-reader` documents uploads and progress reporting as non-goals. The smallest useful delivery is therefore a
transport-agnostic lifecycle in `ngx-lift` plus a non-modal Clarity panel in `clr-lift`.

## Terminology

- **File**: a `File` selected by the user and represented as one queue item.
- **Chunk**: a `Blob` slice of a file, identified by 1-based `chunkNumber` and `totalChunks`.
- **Upload lifecycle**: `initiate -> uploadChunk (repeated) -> combine -> optional status polling`, ending in success,
  error or cancellation.
- **Adapter**: consumer-supplied implementation that performs one lifecycle request; it does not own queue state.
- **Queue item**: an `UploadItem` with identity, value (`File`), status, progress and optional error.
- **Processing**: the post-upload server phase (`combine` plus optional `getStatus` polling). Byte progress is no longer
  derived from chunks; optional task progress is reported by `getStatus`.
- **Panel / dock**: one non-modal transfer surface for the root queue, with expanded details and a compact bar. Restore
  expands the same queue; it never starts or duplicates transfers.
- **Presentation actions**: collapse/minimize preserves records and transfers; restore expands the compact dock. No
  active-state Close/X is offered. Explicit settled Close ends the displayed batch and clears its terminal records; it
  neither deletes uploaded artifacts nor requires a permanent history/reopening entry.
- **Batch cancellation**: an immediate action over the active snapshot in the displayed scope. No confirmation is shown;
  successful records and existing failures remain available until explicit clearing or settled Close.
- **Success summary row**: the collapsed representation of all `success` items ("Uploaded {0} files · {1}") with an
  expand toggle; failed items are never collapsed into it.

## Goals

- G1: An operator can select one or many files, watch per-file and aggregate progress, cancel (per item or in bulk),
  retry failures, collapse finished uploads, and switch between expanded details and a compact dock without leaving the
  current page. Presentation actions never cancel transfers or silently remove failure records.
- G2: An application developer can integrate any backend protocol through a typed adapter and reuse one lifecycle
  instead of reimplementing chunking, progress, cancellation and error state.
- G3: The API fits Angular 21 forms, all 11 supported locales, and the existing Clarity token and overlay conventions
  without new runtime dependencies.

## Non-Goals

### Not now

- Cross-full-page-reload resume or persisted queue state. The session is in-memory only; in-app navigation is covered.
- Automatic network detection or dynamic chunk-size adaptation. Chunk size and concurrency are explicit inputs with
  documented presets.
- Built-in `tus`, S3 multipart or object-storage clients. Consumers can implement them behind `UploadAdapter`; they add
  protocol dependencies this increment does not justify.
- Paste-to-upload (clipboard `paste` intake). The dropzone and the native input cover selection; clipboard intake can be
  a later additive listener.
- A library-installed `beforeunload` guard. Global side effects stay opt-in at the application layer.
- Virus scanning, authorization, storage lifecycle, checksum verification and server-side deduplication.

### Outside this API

Backend endpoints, field names, authentication, task schemas and retention policies. The adapter is the only boundary;
the library never parses a vendor response format.

## Use cases and acceptance

| ID   | Actor and task                                    | Initial data/state                              | Action                                                                        | Observable outcome                                                                                                                           | Failure/recovery                                                                                        | Demo/test                                                       |
| ---- | ------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| UC1  | Operator uploads one release/update bundle        | Idle page, single-selection trigger             | Choose an allowed file                                                        | Accepted selection automatically enqueues; item moves queued -> uploading -> processing -> success; no routine confirmation                  | Invalid files never enqueue; failures retain details and Retry                                          | Planned primary demo + transition test                          |
| UC2  | Operator uploads several files                    | `multiple=true`, empty queue                    | Choose multiple allowed files                                                 | One item per file, aggregate progress; one active file in enqueue order with up to `concurrency` chunk requests for it                       | `maxFiles` or `maxSize` rejection is visible and does not start a request                               | Planned playground + E2E multi-file fixture                     |
| UC3  | Operator cancels an active upload                 | One item `uploading`, `queued`, or `processing` | Click Cancel                                                                  | Chunk/polling aborted where applicable, adapter `cancel(uploadId)` called only when an `uploadId` exists, item `cancelled`                   | Failed abort still marks local cancellation and reports an error event                                  | Planned unit race test + E2E                                    |
| UC4  | Operator retries a failed chunk                   | Item `error` after chunk 3 of 10                | Click Retry                                                                   | Upload re-sends only unacknowledged chunks, beginning with the lowest unacknowledged chunk; auto-retry respects `retryable`                  | Exhausted retries remain `error` with visible message                                                   | Planned unit test with stub adapter                             |
| UC5  | Operator keeps working during upload              | Active panel                                    | Collapse, navigate in-app, restore                                            | Same queue continues; compact bar retains active and failed counts; no Close/X prompt                                                        | Focus returns safely; application-shell ownership survives host teardown                                | Planned keyboard/focus E2E                                      |
| UC10 | Operator manages a mixed queue                    | Active, successful and failed items             | Cancel all, Retry failed, Clear completed, then explicitly Close when settled | Cancel affects explicit active scope; Clear completed removes successes only; settled Close dismisses the displayed terminal batch           | Failures remain available for retry until explicit Remove or Close; no automatic clearing on settlement | Planned mixed-state unit + E2E                                  |
| UC6  | Developer validates selection before upload       | `accept`, `maxSize=512` MiB, `maxFiles=3`       | Choose oversized or disallowed files                                          | Count overflow rejects the new selection once; otherwise type/size errors reject individual files and valid siblings enqueue                 | Clear validation errors removes rejections without changing form value or queue                         | Planned unit + i18n check                                       |
| UC7  | Developer binds the chosen files to a form        | Reactive form with `formControlName`            | Select and reset files                                                        | Control value is `readonly File[]`; owner reset yields a new empty array and removes its queue items; touched/disabled reflected             | Invalid selection sets a validation error on the control                                                | Planned form demo + type test                                   |
| UC8  | Operator reads progress with assistive technology | Panel open                                      | Start, fail, retry, succeed                                                   | Named progress, status changes and errors announced once per transition                                                                      | Repeated renders do not re-announce identical state                                                     | Planned interaction test; manual AT decision tracked separately |
| UC9  | Developer awaits a transfer programmatically      | Queue has the id returned by `enqueue`          | `await queue.completion(id)`, then register metadata                          | Promise resolves with the terminal item on success and rejects on error, cancellation or removal; the business write runs only after success | Unknown id rejects immediately; `retry(id)` re-arms a new promise for the next phase                    | Planned headless unit test + Composition demo tab               |
| UC11 | Operator adds files by dragging or from a folder  | Dropzone visible, `multiple=true`               | Drag files or a folder onto the dropzone, or activate "Add folder"            | Dropped files run the same validation and enqueue path as the native input; the dropzone shows a drag-over state, per-selection limit hints  | Invalid files are rejected with the same localized validation errors and never enqueue                  | Planned unit + E2E drop fixture                                 |

## Industry evidence and current gaps

All sources checked on 2026-11-20, except the Uppy row checked on 2026-11-21.

| Existing implementation / primary source                                                                                                                                                 | Verified behavior                                                                                                                                                                                                                                                                                                       | Adopt, adapt, or reject            | Our gap and reason                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clarity File Picker, current docs (v18): https://clarity.design/documentation/file-picker/overview                                                                                       | Clarity-styled file input with label, helper, success and error states and multiple selection; no upload lifecycle.                                                                                                                                                                                                     | Adapt                              | Reuse Clarity tokens and input container; add queue, progress and completion state.                                                                                                  |
| Clarity Progress Bar, current AI guide (v18): https://clarity.design/documentation/progress/ai and v16 guide: https://v16.clarity.design/documentation/progress                          | Determinate progress is recommended for file downloads/uploads; indeterminate/loop for unknown duration.                                                                                                                                                                                                                | Adopt                              | Byte progress is determinate; `processing` uses reported task progress or indeterminate state.                                                                                       |
| Angular Material inputs: https://material.angular.dev/components/inputs/overview                                                                                                         | Native input/component docs only; no dedicated upload lifecycle component; CDK primitives are generic.                                                                                                                                                                                                                  | Reject as basis                    | Confirms the gap; adding an orchestration layer is not duplicating Material.                                                                                                         |
| NG-ZORRO Upload v22: https://ng.ant.design/components/upload/en                                                                                                                          | `nzMultiple`, `nzAccept`, `nzBeforeUpload`, `nzCustomRequest`, file list with `uploading/done/error`, callbacks for progress/error/success. No built-in chunking, resume, cancel or retry API.                                                                                                                          | Adapt                              | Borrow the status model and custom-request seam; add lifecycle, bounded concurrency and non-modal panel.                                                                             |
| tus resumable upload protocol 1.0: https://tus.io/protocols/resumable-upload                                                                                                             | `PATCH` with `Upload-Offset`, `HEAD` for resume, `DELETE` termination, feature discovery via `OPTIONS`; chunk size is client-chosen and not negotiated.                                                                                                                                                                 | Reject as built-in; adapt concepts | No new protocol dependency; keep adapter-agnostic lifecycle without byte-offset resume in v1.                                                                                        |
| MDN `XMLHttpRequest.upload`: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload and `abort()`: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort | Widely available upload `progress`, error, abort and timeout events; listeners must be attached before send.                                                                                                                                                                                                            | Adopt in adapter examples only     | Adapter authors feed progress events into `onProgress` and cancellation into `signal`.                                                                                               |
| Uppy React integration and tus plugin: https://uppy.io/docs/react/ and https://uppy.io/docs/tus/                                                                                         | Full resumable dashboard with crash recovery and large-upload support through a React wrapper.                                                                                                                                                                                                                          | Reject as built-in                 | Heavyweight optional stack; a consumer may wrap it in `UploadAdapter` if needed.                                                                                                     |
| React Dropzone, current docs: https://react-dropzone.js.org/                                                                                                                             | Drag-and-drop and file selection hooks only; no chunk lifecycle, queue, progress panel or retry API.                                                                                                                                                                                                                    | Adapt                              | Adopts the dropzone interaction pattern (drag-over state, folder traversal via entries); the queue, progress panel and retry API remain our own.                                     |
| Uppy Dashboard, current docs: https://uppy.io/docs/dashboard                                                                                                                             | Status bar shows "Uploading: 45% - 43 MB of 101 MB - 8s left" with `showProgressDetails`; per-file retry/cancel plus `retryAll()`/`cancelAll()`; a Done button replaces pause/resume/cancel after finishing; `closeAfterFinish` auto-closes only when every upload succeeded, otherwise the panel stays open for retry. | Adapt                              | Adopt the progress meta line (bytes, speed, remaining time), footer batch actions and the failures-keep-the-panel-open ordering; keep our own non-modal panel and adapter lifecycle. |

The current recommendation separates presentation from cancellation: active work offers collapse/minimize, while
explicit Cancel actions stop work. It does not use a desktop-window analogy to justify ambiguous active-state X buttons.

### UX revision evidence (checked 2026-11-24)

- [Uppy core](https://uppy.io/docs/uppy/#autoproceed) supports both automatic starts and explicit starts. Adapt the
  separation of capability from product default; Uppy defaults to manual start, which is not a requirement for this
  consumer's automatic-upload workflow.
- [NG-ZORRO Upload](https://ng.ant.design/components/upload/en) documents manual upload through `nzBeforeUpload`. Retain
  optional staging for genuine application decisions, without imposing a second confirmation on all uploads.
- [Uppy Dashboard](https://uppy.io/docs/dashboard/#closeafterfinish) keeps unsuccessful batches open when automatic
  close is enabled. Adapt visible failure recovery; do not automatically discard failures or prohibit a deliberate
  explicit settled Close that dismisses its records.
- [MDN beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) documents unreliable
  delivery and recommends installing listeners only while needed. The application opts into a departure guard; it does
  not guarantee background transfer or reload recovery.
- Maintainer-supplied design frames were inspected through authenticated design API export on 2026-11-24. Findings:
  empty-state disabled Cancel all differs from the hide rule; expanded dock is nearly modal width; completed summary and
  visible success-row counts are illustrative. The maintainer accepts these as examples, not blockers. Implement the
  agreed empty/queued/processing/settled behavior and responsive layout; update the 512 MiB placeholder to a verified
  limit. Product-specific source links and credentials are deliberately excluded from this public specification.

The industry gap is not file selection or progress display; it is a small, transport-agnostic lifecycle plus a
non-blocking progress surface with cancellation and retry.

## Developer learning journey and pedagogy plan

| Reader task / prerequisites                     | Learning outcome                                                      | Destination / page type      | Working example and expected result                                                       | Validation                            |
| ----------------------------------------------- | --------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| Angular forms and a backend upload endpoint     | Integrate a minimal single-file upload                                | `cll-upload` demo, Basic tab | Copyable TS/HTML with a stub adapter; one success row                                     | Focused unit + browser check          |
| Need multiple bundles and chunk-size control    | Configure `multiple`, `accept`, `maxSize`, `chunkSize`                | Demo, Configuration tab      | 25 MB default and 5 MB proxy preset; visible validation errors                            | Unit + E2E fixture                    |
| Need cancellation and retry                     | Explain lifecycle states and recovery                                 | Demo, Failure handling tab   | Fail a stub chunk, observe error, retry, cancel another item                              | Unit race test + E2E                  |
| Need progress while using the page              | Minimize and restore the panel                                        | Demo, Panel tab              | Collapse, navigate, restore, explicit settled Close                                       | Keyboard/focus E2E                    |
| Using typed Reactive Forms                      | Bind `readonly File[]` through CVA and `toSignalForm`                 | Demo, Forms tab              | ngModel, typed `FormGroup`, `toSignalForm` examples                                       | Form type test + browser check        |
| Awaiting a transfer and refreshing related data | Use `completion(id)`, promise adapters and query/mutation composition | Demo, Composition tab        | `await completion(id)` then `mutateResource.mutate()`, with a `queryResource`-backed list | Headless promise test + browser check |

The upload route and examples are implemented; the current verification record below describes tested states.

## Public API and examples

All signatures below are proposed.

### `ngx-lift` exports

```ts
export type UploadStatus = 'queued' | 'uploading' | 'processing' | 'success' | 'error' | 'cancelled';

export interface UploadError {
  readonly code: string;
  readonly message?: string;
  readonly phase: 'validation' | 'initiate' | 'chunk' | 'combine' | 'status' | 'cancel';
  readonly retryable?: boolean; // default false; only `chunk` errors with true are auto-retried
  readonly recovery?: 'retry' | 'replace'; // manual recovery guidance, independent from auto-retry
  readonly fileName?: string; // rejected file name for phase `validation`
}

export interface UploadStatusResult {
  readonly status: Extract<UploadStatus, 'processing' | 'success' | 'error' | 'cancelled'>;
  readonly progress: number; // 0..100 during processing
}

export interface UploadItem {
  readonly id: string;
  readonly file: File;
  readonly status: UploadStatus;
  readonly progress: number; // 0..100 aggregate across upload and processing
  readonly uploadedBytes: number; // acknowledged bytes plus reported in-flight bytes
  readonly attempt: number; // 1-based attempt for the current phase; increments on retry
  readonly processingProgress?: number; // present after numeric server processing progress is reported
  uploadId?: string;
  error?: UploadError;
}

export interface UploadChunkRequest {
  readonly uploadId: string;
  readonly chunk: Blob;
  readonly chunkNumber: number; // 1-based
  readonly totalChunks: number;
  readonly signal: AbortSignal;
  onProgress(loadedBytes: number): void; // in-flight bytes clamped to the chunk's byte length
}

export interface UploadAdapter {
  initiate(file: File): Promise<{uploadId: string}>;
  uploadChunk(request: UploadChunkRequest): Promise<void>;
  combine(request: {uploadId: string; totalChunks: number}): Promise<void>;
  cancel(uploadId: string): Promise<void>;
  getStatus?(uploadId: string): Promise<UploadStatusResult>;
}

export const UPLOAD_CHUNK_5MB = 5 * 1024 * 1024;
export const UPLOAD_CHUNK_25MB = 25 * 1024 * 1024;

export interface UploadQueueOptions {
  adapter: UploadAdapter;
  chunkSize: number;
  concurrency: number;
  autoRetry: boolean;
  maxRetries: number;
  pollIntervalMs: number; // default 10000, clamped to >=1000
}
```

`UploadQueueService` is `providedIn: 'root'` and exposes:

```ts
readonly items: Signal<readonly UploadItem[]>;
readonly aggregate: Signal<{total: number; active: number; progress: number}>;
readonly minimized: Signal<boolean>;

enqueue(files: readonly File[], options: UploadQueueOptions): readonly UploadItem[];
completion(id: string): Promise<UploadItem>;
retry(id: string): void;
cancel(id: string): void;
remove(id: string): void;
clearCompleted(): void;
minimize(): void;
restore(): void;
```

`progress` is derived from acknowledged bytes plus the latest clamped `onProgress` bytes for in-flight chunks during
upload. When processing starts, it advances only from the optional `getStatus()` result's `progress` field; without
`getStatus()` it stays at 100 and the UI shows the indeterminate processing state. `uploadedBytes` reverts to
acknowledged bytes when an in-flight chunk fails or is cancelled. `items()` returns immutable snapshots with stable `id`
values; every state change emits a new array so signal consumers observe it.

### Headless queue example (proposed)

```ts
import {UploadQueueService, UPLOAD_CHUNK_25MB} from 'ngx-lift';

const items = queue.enqueue(files, {
  adapter,
  chunkSize: UPLOAD_CHUNK_25MB,
  concurrency: 2,
  autoRetry: false,
  maxRetries: 3,
  pollIntervalMs: 10_000,
});
```

### Awaiting completion (proposed)

`completion(id)` is the programmatic counterpart to the `uploadComplete`, `uploadError` and `uploadCancelled` outputs.
It settles from queue state rather than a timer and needs no injection context:

```ts
const [item] = queue.enqueue(files, options);
try {
  const finished = await queue.completion(item.id);
  await register.mutate([finished]);
} catch (error) {
  /* UploadError on failure, AbortError on cancellation or removal */
}
```

Contract:

- Resolves with the terminal `UploadItem` snapshot when the item reaches `success`.
- Rejects with the item's `UploadError` when it reaches `error`. Rejects with a `DOMException` named `AbortError` when
  the item is cancelled or removed before completion, and with an `Error` named `UploadItemNotFoundError` for an unknown
  id. No rejection is swallowed and no promise is left pending when an item leaves the queue.
- Repeated calls for the same id and phase observe the same outcome. `retry(id)` starts a new phase: a later
  `completion(id)` call returns a new promise for that phase, while promises already settled are unchanged.
- `clearCompleted()` only removes terminal items, so it cannot strand a pending promise. The method owns no DOM,
  overlay, global listener or delay; it is SSR-safe and independent of `clr-lift`.

### `clr-lift` exports

```ts
@Component({selector: 'cll-upload' /* ... */})
export class UploadComponent implements ControlValueAccessor {
  /* proposed */
}

@Component({selector: 'cll-upload-panel' /* ... */})
export class UploadPanelComponent {
  /* proposed */
}
```

`cll-upload` inputs and outputs:

| Name               | Kind            | Default             | Meaning                                                                                                        |
| ------------------ | --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `adapter`          | input, required | -                   | Transport implementation; passed to each `enqueue` call.                                                       |
| `multiple`         | input           | `false`             | Allow multi-selection.                                                                                         |
| `accept`           | input           | `''`                | Native `accept` expression passed to the file input.                                                           |
| `maxSize`          | input           | `Infinity`          | MiB per file; `Infinity` means unlimited, matching `cll-file-reader`; `0` rejects all files.                   |
| `maxFiles`         | input           | `0`                 | Maximum accepted files per selection/batch; `0` means unlimited.                                               |
| `chunkSize`        | input           | `UPLOAD_CHUNK_25MB` | Bytes per chunk.                                                                                               |
| `concurrency`      | input           | `2`                 | In-flight chunk requests for the active file, clamped to 1..4; values above 1 require independent chunks.      |
| `autoRetry`        | input           | `false`             | Retry `chunk` errors marked `retryable: true` automatically.                                                   |
| `autoEnqueue`      | input           | `true`              | `false` validates and emits `filesChange` only; advanced application staging, not the primary upload workflow. |
| `maxRetries`       | input           | `3`                 | Automatic attempts per failing chunk.                                                                          |
| `pollIntervalMs`   | input           | `10000`             | Server status poll interval for adapters that implement `getStatus`.                                           |
| `disabled`         | input           | `false`             | Disable selection and queue actions; CVA disabling also cancels this control's in-flight items.                |
| `controlId`        | input           | `''`                | Stable id for label/input association.                                                                         |
| `filesChange`      | output          | -                   | Emits the current `readonly File[]` value.                                                                     |
| `validationErrors` | output          | -                   | Emits rejected files as `UploadError[]` with phase `validation`.                                               |
| `uploadComplete`   | output          | -                   | Emits items that reached `success`.                                                                            |
| `uploadError`      | output          | -                   | Emits items that reached `error`.                                                                              |
| `uploadCancelled`  | output          | -                   | Emits items that reached `cancelled`.                                                                          |

### Minimal example (proposed)

```ts
import {Component} from '@angular/core';
import {UploadAdapter, UploadChunkRequest, UploadItem, UPLOAD_CHUNK_25MB} from 'ngx-lift';
import {UploadComponent} from 'clr-lift';

@Component({
  selector: 'app-bundle-upload',
  imports: [UploadComponent],
  template: `
    <cll-upload
      [adapter]="adapter"
      [multiple]="true"
      accept=".zip,.tar"
      [maxSize]="512"
      [chunkSize]="chunkSize"
      (uploadComplete)="onComplete($event)"
    />
  `,
})
export class BundleUploadComponent {
  readonly chunkSize = UPLOAD_CHUNK_25MB;

  readonly adapter: UploadAdapter = {
    initiate: async (file) => ({uploadId: await this.createUpload(file)}),
    uploadChunk: async (request) => this.sendChunk(request),
    combine: async (request) => this.finish(request),
    cancel: async (uploadId) => this.removeUpload(uploadId),
  };

  private async createUpload(file: File): Promise<string> {
    /* endpoint-specific */ return file.name;
  }
  private async sendChunk(request: UploadChunkRequest): Promise<void> {
    /* FormData + progress */
  }
  private async finish(request: {uploadId: string; totalChunks: number}): Promise<void> {
    /* endpoint-specific */
  }
  private async removeUpload(uploadId: string): Promise<void> {
    /* endpoint-specific */
  }
  onComplete(items: readonly UploadItem[]): void {
    /* application action */
  }
}
```

### Advanced configuration (proposed)

```html
<cll-upload
  [adapter]="adapter"
  [multiple]="true"
  [maxFiles]="3"
  [chunkSize]="chunk5Mb"
  [concurrency]="4"
  [autoRetry]="true"
  [maxRetries]="3"
  [formControl]="bundles"
/>
```

`chunk5Mb` is `UPLOAD_CHUNK_5MB`. This preset keeps roughly 20 MB in flight on a fast direct connection. The default
`25 MB x 2` preset keeps roughly 50 MB in flight and matches the observed downstream default. Proxy or fragile links use
`5 MB x 1`. In-flight memory is approximately `chunkSize x concurrency`; automatic network probing is not part of this
API.

### Form integration (proposed)

```html
<!-- ngModel -->
<cll-upload [(ngModel)]="files" [adapter]="adapter" name="bundles" />

<!-- typed Reactive Forms -->
<cll-upload [formControl]="bundles" [adapter]="adapter" />

<!-- Reactive Forms observed with the existing facade -->
@if (formFacade(); as facade) {
<cll-upload [formControl]="facade.controls.bundles" [adapter]="adapter" />
}
```

The control value is `readonly File[]`; accepted selections emit a new array and owner reset supplies a new empty array.
Queue state, progress and panel visibility are not form state. Owner writes are authoritative: `writeValue([])` and
`FormControl.reset()` clear the accepted value and cancel/remove queue items created from that value without emitting
`onChange` or touch. `setDisabledState(true)` and `disabled=true` cancel in-flight items for this control while
preserving the committed value. A UI "Clear validation errors" action only drops validation results; it does not change
the form value or queue. Native Signal Forms support is deferred until the platform upgrade, as required by the forms
contract.

### Transport examples: promises and `HttpClient` (proposed)

Adapter methods are plain promises, so any promise client implements them directly. `fetch` accepts the `AbortSignal`
but does not expose upload progress events; byte progress still advances per acknowledged chunk:

```ts
readonly adapter: UploadAdapter = {
  initiate: async (file) => {
    const response = await fetch('/api/uploads', {method: 'POST', body: JSON.stringify({name: file.name})});
    const {uploadId} = (await response.json()) as {uploadId: string};
    return {uploadId};
  },
  uploadChunk: async (r) => {
    const response = await fetch(`/api/uploads/${r.uploadId}/chunks/${r.chunkNumber}`, {
      method: 'POST',
      body: r.chunk,
      signal: r.signal,
    });
    if (!response.ok) throw new Error(`chunk ${r.chunkNumber} failed`);
  },
  combine: async ({uploadId, totalChunks}) => {
    await fetch(`/api/uploads/${uploadId}/combine`, {method: 'POST', body: JSON.stringify({totalChunks})});
  },
  cancel: async (uploadId) => {
    await fetch(`/api/uploads/${uploadId}`, {method: 'DELETE'});
  },
};
```

For in-flight byte progress, wrap `HttpClient` in the adapter. The queue has no `@angular/common/http` dependency;
providing `HttpClient` is an application concern. Map `HttpEventType.UploadProgress` to `onProgress` and reject the
promise on abort, because unsubscribing alone leaves the adapter promise pending:

```ts
import {HttpClient, HttpEventType, HttpUploadProgressEvent} from '@angular/common/http';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';

private readonly http = inject(HttpClient);

readonly adapter: UploadAdapter = {
  initiate: async (file) => ({uploadId: await firstValueFrom(this.http.post<string>('/api/uploads', {name: file.name}))}),
  uploadChunk: (r) =>
    new Promise<void>((resolve, reject) => {
      const body = new FormData();
      body.append('chunk', r.chunk, `chunk-${r.chunkNumber}`);
      const sub = this.http
        .post(`/api/uploads/${r.uploadId}/chunks/${r.chunkNumber}`, body, {reportProgress: true, observe: 'events'})
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              r.onProgress((event as HttpUploadProgressEvent).loaded);
            }
          },
          error: (error: unknown) => reject(error),
          complete: () => resolve(),
        });
      r.signal.addEventListener(
        'abort',
        () => {
          sub.unsubscribe();
          reject(new DOMException('Upload cancelled', 'AbortError'));
        },
        {once: true},
      );
    }),
  combine: async ({uploadId, totalChunks}) => {
    await firstValueFrom(this.http.post(`/api/uploads/${uploadId}/combine`, {totalChunks}));
  },
  cancel: async (uploadId) => {
    await firstValueFrom(this.http.delete(`/api/uploads/${uploadId}`));
  },
};
```

`HttpUploadProgressEvent.loaded` is required in Angular 21.2. The `FetchBackend` does not emit upload progress, so use
the default XHR backend when `reportProgress` matters. `getStatus` stays optional and is implemented only when the
backend exposes a task-status endpoint.

### Composition with `ngx-lift` query utilities (proposed)

The queue owns transfer state; `resourceAsync`, `queryResource` and `mutateResource` own application data. Compose at
the component outputs or at `completion(id)` instead of wrapping `enqueue` in a mutation. Keep the three layers
separate: queue (transfer), mutation (business write), query (refreshed view).

Component path using the outputs:

```ts
import {mutateResource, type UploadItem} from 'ngx-lift';

export class BundleUploadComponent {
  private readonly register = mutateResource((items: readonly UploadItem[]) => this.api.registerBundles(items), {
    invalidateTags: (_result, items) => items.map((item) => ({type: 'Bundle', id: item.id})),
    concurrency: 'exhaust',
  });

  onComplete(items: readonly UploadItem[]): void {
    void this.register.mutate(items); // success invalidates the bundle-list query
  }
}
```

Headless path using `completion(id)`, with the refreshed list served by `queryResource`:

```ts
import {inject} from '@angular/core';
import {mutateResource, queryResource, UploadQueueService, type UploadItem} from 'ngx-lift';

export class BundleTransfer {
  private readonly queue = inject(UploadQueueService);
  private readonly bundles = queryResource(() => ({
    key: ['bundles', 'list'],
    loader: () => this.api.listBundles(),
    tags: [{type: 'Bundle'}],
  }));
  readonly bundlesValue = this.bundles.value; // signal consumed by the view

  private readonly register = mutateResource((item: UploadItem) => this.api.registerBundle(item.file.name), {
    invalidateTags: [{type: 'Bundle'}],
  });

  async transfer(files: readonly File[]): Promise<void> {
    const [item] = this.queue.enqueue(files, options);
    try {
      const finished = await this.queue.completion(item.id);
      await this.register.mutate(finished); // invalidates Bundle; the active query refetches
    } catch {
      /* UploadError or AbortError: no business write and no refetch */
    }
  }
}
```

`invalidateTags` accepts a readonly `QueryTag[]` or `(result, args) => readonly QueryTag[]`; a tag is
`{type, id?, scope?}`. `mutate()` returns `Promise<TResult>` and a successful write invalidates without awaiting the
background refetch, so an active `queryResource` observer refreshes on its own. Call `reload()` only for an inactive
query, and use `execute()` when a promise for a fresh read is required. `resourceAsync` follows the same rule: use it
for one asynchronous value whose parameters can change, and read the transfer queue as a separate signal. Do not nest
queue state inside a resource or wrap `enqueue` in a mutation.

## Behavior and architecture

### State machine

```text
selection/validation -> queued -> uploading -> processing -> success

queued     -> cancelled | error (initiate failure)
uploading  -> cancelled | error (chunk failure)
processing -> cancelled | error (combine or status failure)
error      -> retry (action) -> the failed phase
```

- Validation failures never create a queue item. `cll-upload` emits them as `UploadError[]` with phase `validation` via
  `validationErrors` and renders them beside the rejected file name; the headless queue does not perform selection
  validation.
- Files are processed one at a time in enqueue order. Within the active file, chunks are numbered 1..N; `concurrency=1`
  sends them sequentially, and `concurrency>1` sends up to that many independent chunk requests, which may resolve out
  of order. `combine` runs only after every chunk is acknowledged, then the next file starts.
- A chunk is acknowledged when its `uploadChunk` promise resolves. `onProgress(loadedBytes)` reports clamped in-flight
  bytes for that chunk; `uploadedBytes` is acknowledged bytes plus reported in-flight bytes, and reverts to acknowledged
  bytes on failure or cancellation. Retry re-sends only unacknowledged chunks, beginning with the lowest unacknowledged
  number; acknowledged chunks are never re-sent. Adapters used with `concurrency>1` must support independent,
  out-of-order chunk requests.
- Cancel on a `queued` item marks it `cancelled` without an adapter call because no `uploadId` exists. Cancel during
  upload aborts the `AbortSignal` and calls `cancel(uploadId)`. Cancel during processing stops `getStatus` polling and
  calls `cancel(uploadId)`; `combine` has already been issued and cannot be locally undone, so server termination is the
  adapter's responsibility. A failed adapter `cancel()` still ends the item `cancelled` and reports an `UploadError`
  with phase `cancel` through the error outputs.
- `processing` begins after the last chunk and covers `combine` plus optional `getStatus` polling every `pollIntervalMs`
  (default 10000 ms). The interval is a queue option, not a UI transition delay; UI transitions remain state-driven.
- `cancelled`, `success`, and exhausted `error` are terminal: none of them transitions automatically. `retry(id)` is the
  explicit action that re-runs the failed phase from any `error` item, including exhausted and non-retryable errors;
  `remove(id)` deletes any item; `clearCompleted()` removes terminal items, including exhausted errors.

### Ownership and lifecycle

- `UploadQueueService` owns items, progress, session-level minimized state and cancellation signals. It is root-scoped
  so in-app navigation preserves state. Full page reload clears it. Each `enqueue` call supplies its `UploadAdapter`;
  the service stores the adapter with the item so multiple hosts with different adapters can share the root queue. The
  service owns no DOM or overlay.
- `UploadComponent` owns selection, validation, CVA state and the call to `enqueue`, passing its `adapter` input in
  `UploadQueueOptions`. It attaches to the single shared `cll-upload-panel` for that root queue on first enqueue.
- The `cll-upload` dropzone is the primary selection surface: it opens the native input on click, reacts to drag-over
  with a highlighted state, and ingests dropped files through the same validation and enqueue path as the native input.
  Dropped folders are traversed through `webkitGetAsEntry()` entries captured synchronously during the drop event and
  read in repeated `readEntries` batches until exhausted. The "Add folder" action uses a hidden `webkitdirectory` input
  and is shown with `multiple`. Drops run the same `accept`, `maxSize` and `maxFiles` validation; rejected files never
  create queue items. Hint segments and the used count are omitted without data.
- The root-scoped panel manager owns one CDK overlay per root queue with `hasBackdrop: false`; it never locks page
  scroll or makes the background inert. An individual declaration anchor or picker can be destroyed without destroying
  that overlay. Dispose the overlay at its root owner teardown; do not mutate global styles.
- Each `uploadChunk` receives an `AbortSignal` from a per-item `AbortController`. Cancel aborts the signal, calls
  adapter `cancel(uploadId)` when an `uploadId` exists, and marks the item cancelled; adapter failures are reported but
  the item still ends `cancelled`.
- Retry re-runs the failed phase: a failed `initiate` runs `initiate` again for a fresh `uploadId`; a failed `chunk`
  re-sends only unacknowledged chunks and reuses the item's `uploadId`; a failed `combine` re-issues `combine` over the
  acknowledged chunks; a failed `status` poll resumes polling. With `autoRetry=false` the user starts every retry
  explicitly; with `autoRetry=true` only `chunk` errors with `retryable: true` retry automatically, up to `maxRetries`
  attempts, before the error state is shown; manual `retry(id)` stays available for every error phase. Plain adapter
  rejections are wrapped as non-retryable `UploadError` values.
- Stale results are ignored by checking item identity and current status before applying adapter callbacks.
- SSR: no `document` or overlay access during server rendering; the panel is created only in a browser after the host
  view initializes.

### Panel, dock and application dialog behavior

This section records the 2026-11-24 recommendation: D1-D4 are accepted. Implementation is complete for this library/demo
increment; see the verification record below.

- One root-scoped queue and application-owned overlay survive host teardown and in-app navigation. The first enqueue
  creates the surface; an application may declare the existing `cll-upload-panel` anchor once. No duplicate transport,
  polling loop or queue is created by switching views. There is no backdrop or page-scroll lock for the dock.
- The primary picker validates and automatically enqueues accepted files (`autoEnqueue=true`, the existing default).
  Invalid files remain local validation errors. No generic inspection/confirmation dialog is inserted. The advanced
  `autoEnqueue=false` mode remains for applications that need metadata, destination selection or an explicit business
  decision before starting I/O. Remote-URL credentials are such a form and still need an explicit submission action.
  Upload is not installation, deployment, rollout approval or an overwrite decision; those retain their own controls.
- The dock has two presentations, expanded and compact, with one disclosure action. Remove the separate size-toggle,
  minimize and active-state Close control set and its close-confirmation prompt. Collapse/minimize never cancels work.
  The compact card shows the design title, a second-line transfer summary and a bottom-edge progress indicator.
- An application may compose a richer upload dialog around the same queue. While the modal is open, suppress the
  interactive dock and avoid leaving it above the modal or exposing duplicate controls. Minimizing the dialog transfers
  presentation to the dock without stopping work. Dialog state and queue scope remain application-owned; a static info
  message explains automatic start and that the browser tab must remain open. The library does not acquire a modal API.
- In a genuinely empty dialog, show Close only and hide Cancel all. With queued/uploading/processing work in that
  dialog's scope, show Cancel all and Minimize to background, without X. Once settled, show Close; failures retain Retry
  and Remove until the user explicitly dismisses the batch. Closing an empty picker dismisses only that dialog;
  minimizing an active dialog preserves transfers and records in the dock; explicitly closing a settled batch clears
  that displayed scope under D2. Escape hides/minimizes to the dock without clearing records or cancelling tasks. Modal
  focus trapping, Escape and restoration belong to the application dialog; the non-modal dock does not trap focus.
- Header status includes the real state counts: uploading, queued, processing and failed as applicable. Only `queued`,
  `uploading` and `processing` contribute to active work. All-settled means none of these remain; zero network upload
  streams alone is insufficient. A mixed settled batch says completed/failed/cancelled, never All complete.
- Preserve active rows in enqueue order, failed rows with readable errors and recovery actions, and a separate success
  disclosure below them. Keep the active/error section reachable through bounded scrolling. Completed count and byte
  totals derive from the same successful item set. Default the success disclosure to collapsed while work or failures
  remain; do not automatically override a user's explicit expand/collapse choice at a count threshold.
- Clear completed is a separate button beside the success disclosure, never nested inside its toggle button. It removes
  successful records from the UI/queue only and never deletes uploaded artifacts. Implement it using existing
  `remove(id)` over a snapshot of successes. Keep the public `clearCompleted()` terminal-purge contract unchanged for
  compatibility; do not bind this broader method to the success-only Clear completed action. Explicit settled Close may
  use it only when dismissing the complete root queue; scoped dismissal must remove only that scope's terminal ids.
  Failed and cancelled records remain independently removable. Clearing records does not change the file-selection form
  value; form reset remains a separate owner-authorized operation with its existing semantics.
- Keep per-row Retry/Remove and batch Retry failed. An upload failure has actionable phase/error text. Distinguish
  failure to query status from a confirmed server processing failure; do not promise that retry can repair every
  validation or business rejection. Removing a failed row dismisses its record without deleting a server artifact.
- Cancel all immediately snapshots and cancels queued/uploading/processing items in its explicit scope, without a
  confirmation step. Successful records and existing failures are not cleared. Items added after the click are not
  silently included. The global dock covers the root queue; feature-specific dialogs must identify their own scope. A
  failed server cancellation remains visible: local stopped/cancelled does not prove server termination succeeded.
- Accepted D2: Close is available only when the displayed scope has no queued/uploading/processing work. Clicking it
  explicitly ends that displayed batch, clears its success/error/cancelled records and hides its surface. It does not
  delete uploaded files or cancel any other scope's work. Do not auto-close or auto-clear when a batch settles: failures
  remain visible with Retry/Remove until the user chooses Close. Explain the loss of retry records in the settled Close
  description; no extra routine confirmation dialog is proposed. A feature dialog's Close affects only its displayed
  scope; the global dock's Close covers the root queue only once that queue is settled.
- No permanent Uploads entry, upload-history feature or extension to `UploadQueueService.restore()` is proposed. Restore
  continues to expand the compact dock while records exist. After explicit settled Close, those dismissed records cannot
  be reopened; adding new files begins another visible batch. Application logout/reset retains its existing cleanup
  responsibilities.
- Under D3, a newly observed transition to error can expand a compact dock once per item attempt, without moving focus
  or recreating explicitly dismissed records. Acknowledged existing failures do not repeatedly expand after manual
  collapse. A new failed retry attempt may alert again. While a modal is open, update its visible error and announce it
  without opening a second interactive surface. Failure counts and polite announcements remain available when collapsed.
- The header right-hand action is Cancel all while active and Close when settled. Keep the action away from the
  disclosure/restore hit target; a transition must not cause an in-progress click or held key to activate a newly
  substituted action. The compact bar may reserve batch actions for its expanded view.
- Keep responsive card styling, direction-aware inline-end placement and design-system spacing tokens. Expanded dock
  width must leave the application usable rather than copy modal width; final widths are UX review items, not fixed
  754px or 320-by-48px requirements. Bound both height and width for narrow screens, zoom and long translations.
- Focus stays predictable: explicit collapse targets the compact disclosure; explicit expansion targets the matching
  control; user-requested Close restores a connected application trigger or a safe shell target. Automatic expansion
  never moves focus. Tab can leave the dock; Escape is handled only inside the relevant surface.

### Incremental intake, validation and duplicate names

Implementation evidence: `UploadComponent.ingest` validates independently, skips suspected duplicates within its
captured destination scope, appends accepted files to the value and enqueues them. `UploadQueueService.enqueue` still
assigns a fresh id on every call without duplicate filtering. The intake policy belongs to the picker, not the headless
append contract. The additive integration members below support destination identity and application-owned location.

- Keep selection/drop available during queued/uploading/processing work when the host is enabled, `multiple=true` and
  configured limits allow it. New accepted files append to the tail without aborting, restarting or replacing existing
  work. Files remain serial at file level, with configured chunk concurrency within the current file.
- Validate each folder entry independently. Unsupported extensions and oversize files are local selection rejections,
  never transport failures or queue items. Valid siblings continue enqueueing/uploading; an invalid entry does not
  reject the whole folder or disable further additions. All picker and drop intake paths use the same validation.
- In the main dialog, show a bounded Clarity danger-style rejection section beside/below the picker: an error icon, a
  clear summary such as “3 files were not added. Other valid files will continue uploading,” and per-file relative
  name/path plus reason and allowed formats. Do not rely on red alone or claim that the entire upload failed. Large
  folders use a disclosure/scrollable detail list, a dismiss/Clear validation errors action and one summary live
  announcement. Do not render an alert or announce each progress update for every rejected entry. No Retry is offered
  for an unsupported file: choose a supported file instead. Rejections remain separate from failed transfers and
  completed/active counts; new additions must not silently erase unresolved rejection feedback.
- Accepted D4: detect only suspected repeat selections within the same application destination/feature scope, using
  original filename, byte size, last-modified time and a relative path when consistently available. Compare both
  existing retained items and earlier accepted candidates in the same drop. Metadata matching is a heuristic, not a
  content hash; different metadata does not prove different content and equal metadata does not prove equal content. Do
  not read/hash multi-gigabyte files just to populate the queue. When destination identity or path information is
  insufficient, do not make a cross-scope or definitive content-identity assertion.
- For a suspected match in queued/uploading/processing state, skip the new candidate and show a non-danger notice (“This
  file is already in the queue”) with a way to locate its row. For an existing error, point to Retry rather than
  creating another copy or starting an automatic retry. For a retained success, say already uploaded in this batch.
  Cancelled/dismissed records do not block a fresh selection. Clearing or explicitly closing a batch releases this
  in-memory detection history; there is no persistent server-wide duplicate index. Deliberate repeat upload can follow
  removal of the terminal record and reselection; an active item must be cancelled before replacing it.
- A shared basename alone never proves a duplicate. When metadata/path differs, allow independent items under distinct
  queue ids; disambiguate visible rows using relative directory, size and modification time when useful. Relative paths
  are labels/detection hints, not an implicit promise to create folders or storage keys on the server. Preserve original
  names and do not silently rename to “(1)” or overwrite remote artifacts. A backend name/version conflict is a separate
  explicit application error/business decision; accepted enqueue does not promise backend acceptance.
- Duplicate notices do not stop valid sibling files, alter existing progress or count as failed uploads. In particular,
  processing an extra drop cannot reset a current transfer. Backend identity/idempotency remains adapter-owned.

Evidence checked 2026-11-24: [Uppy addFiles](https://uppy.io/docs/uppy/#addfilesfiles) keeps valid members of a batch
when others fail restrictions; [Uppy addFile](https://uppy.io/docs/uppy/#addfilefile) distinguishes repeated entries and
relative paths. Adapt the per-file validation and scoped-identity principles, not its identity implementation.
[MDN File](https://developer.mozilla.org/en-US/docs/Web/API/File) documents the metadata available to the browser;
metadata-based suspicion cannot establish content equality.

### Application preflight and content rejection

Automatic upload removes the routine human confirmation, not required automated validation. A consuming bundle-upload
application may inspect archive entries and required manifest content locally before enqueueing. Keep archive parsers,
manifest filenames/schema and bundle-kind rules application-owned; the generic picker/queue does not acquire domain
validation or a ZIP dependency. Existing advanced staging can support asynchronous application preflight without
introducing a confirmation dialog or issuing upload requests before validation succeeds.

- Selection validation has two layers: generic extension/size/count checks and application-specific asynchronous
  archive/content preflight. Show Checking file while local inspection runs, keep other valid files progressing, and
  reject invalid archives beside their filename with a Clarity danger-style reason. A local rejection never creates a
  transport failure, request or upload session. Track the pending preflight as unfinished intake so the UI cannot claim
  all work has finished or clear/close the scope while a late accepted result may still enqueue.
- Required manifest names and paths depend on the application contract; do not hardcode a generic `manifest.json` rule.
  A syntactically valid ZIP may still be an invalid application bundle. Missing required entries, corrupt or unparseable
  manifests and incompatible bundle types need specific readable errors and selection of a corrected file.
- A server may also reject content after transmission or during processing. Keep that item visible as a failed transfer
  lifecycle, preserve the application-provided reason, and do not render it as successful just because all bytes
  arrived. Backend error origin must come from the failed request/task evidence, not from the wording of its message.
- Separate record removal from meaningful recovery: Remove dismisses the record and does not delete the server artifact.
  An unchanged file that deterministically lacks a required manifest is not repaired by retransmission: show Remove and
  Choose another file/corrective guidance rather than a misleading Retry action. Local preflight rejections have no
  queue Retry. Retry is appropriate for recoverable network/request failures; a status-query failure retries monitoring
  rather than uploading the entire file again. Do not silently auto-retry a content/business rejection.
- Preserve the existing public manual `queue.retry(id)` contract for error items. The optional `recovery` member
  supplies context-aware UI recovery classification; `UploadError.retryable=false` currently controls automatic chunk
  retry and alone does not prove manual retry is meaningless. Applications set `recovery: 'replace'` for a known
  permanent content rejection; the library does not infer it. Do not guess recovery from substring matching or leak
  product-specific rules into the headless queue.
- Cover mixed valid/invalid archives, cancellation or logout during asynchronous preflight, no requests on local
  rejection, late scan/preflight results, server rejection after 100% transfer, same-file re-selection after correction,
  recoverable transport Retry, permanent-content corrective guidance and Remove without artifact deletion.

### Integration safeguards and remaining evidence

These are engineering and product-integration checks, not additional UX preference questions:

- **Close versus form teardown:** hiding/minimizing the application dialog must not call `reset()`, `clear()`, write an
  empty File-array value or disable the picker as a side effect. The existing form contract intentionally cancels or
  removes owned items for those operations. Test real modal destruction and recreation, not only visibility toggling, so
  accepted background uploads and duplicate tracking remain under their intended root/application owner.
- **Fixed destination:** each enqueue captures its destination, region, repository, credentials context and adapter
  configuration as appropriate. Changing the page's selected target later must not redirect already queued requests.
  Global dock rows identify their originating target; duplicate checks never suppress work in another target.
- **Safe selection scope:** folder traversal and any asynchronous local inspection need cancellation/generation
  ownership. Cancelling an intake/session, closing an empty picker during traversal, or logout must not allow late scan
  callbacks to add files after dismissal. Show a Reading files state and count while traversal is incomplete; do not
  label it upload failure or all-complete. Folder enumeration is not atomic transfer of an archive.
- **Backend truth:** verify server upload-session constraints, task readiness and name/version-conflict behavior before
  integrating multi-file intake. The UI queue can accept many files while sending one file at a time, but this alone
  does not establish backend multi-session or multi-user support. Browser accept/size checks are convenience validation;
  server validation remains authoritative. Do not invent numeric size limits from a design placeholder.
- **Cancellation and monitoring:** retain the distinction between locally stopped work, confirmed server cancellation, a
  failed status request and a confirmed failed processing task. Keep unresolved cancellation warnings visible; do not
  imply that clearing records deleted an artifact or terminated remote processing.
- **Control scope and cleanup:** feature-dialog actions affect their displayed ids; root-dock actions explicitly name
  their root scope. Snapshot destructive-action scope. Keep existing `maxFiles` per-selection/batch semantics and
  document any separate product-wide capacity; do not silently reinterpret it as a total queue cap. Session logout and
  identity changes release local files, metadata and callbacks. No persistent history or full-reload resume is promised.

### Additive integration members

The authorized implementation uses these minimal, optional members; no new root export, dependency or vendor protocol is
added. Existing consumers keep their signatures and the headless queue's unconditional append behavior.

| Member                              | Contract                                                                                                                                                                                    | Admission and consumer evidence                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `UploadComponent.scope`             | Optional string input. Stable destination key for duplicate detection. If absent, use a stable destination-bound adapter instance. Scope changes affect new selections only.                | A file can be sent to different targets. Optional member on the existing picker; native File identity cannot express destination.                                  |
| `UploadComponent.duplicateSelected` | String output containing the retained item id when Show details is activated. Applications locate their own modal row; an unsuppressed dock locates its own row.                            | Application-owned modal markup must not be reached through private DOM traversal.                                                                                  |
| `UploadPanelComponent.suppressed`   | Boolean input, default false. Hide the shared dock while a dialog presents its queue. All live suppression owners must release suppression; anchor destruction releases only that owner.    | Actual modal/dock handoff; overlay lifetime differs from dialog lifetime. No queue work is cancelled.                                                              |
| `UploadPanelComponent.inline`       | Boolean input, default false. Render the shared file/progress/success presentation in place and suppress the floating dock. The application retains its modal/footer.                       | Replaces the actual duplicate modal list identified during rendered review; no protocol or modal API is added.                                                     |
| `UploadPanelComponent.showItem(id)` | Reveal/focus a retained item in this anchor's inline renderer, or the floating renderer for a default anchor. Unknown ids are no-ops.                                                       | The duplicate notice must be able to locate a collapsed successful row without reaching into private renderer DOM.                                                 |
| `UploadError.recovery`              | Optional manual-recovery classification. The value `replace` hides Retry and shows corrected-file guidance; `retry` or absence preserves manual Retry. Normalize this field with the error. | Distinguishes permanent application-content rejection from transient request failure without vendor-text matching. Independent of automatic `retryable` semantics. |

Adapter authors must capture target/configuration when constructing an adapter; a scope string cannot freeze a closure
that reads mutable application fields later. The advanced demo captures the required destination when submitting its
staged selection. The upload dialog in the demo deliberately displays the entire shared queue, labels cancellation as
queue-wide, and uses the same root scope for Close; feature-scoped product dialogs must instead filter their own ids.

### Transfer telemetry and browser departure

- Display transfer percentage from a byte-weighted numerator and denominator over the same explicitly defined batch, not
  the mean of file percentages beside a byte total. Keep batch membership stable while it is displayed: clearing
  historical successes must not reset active progress; newly appended work may change the total, with an appropriate
  status update. Cancelled items leave the active transfer denominator; failed items retain their transferred-byte
  contribution until retried or explicitly removed and are always identified as failures. Do not show an all-success
  percentage or completion statement for a failed/partially cancelled batch.
- Preserve the existing public `aggregate().progress` mean calculation in this revision for compatibility. It is not the
  byte-transfer metric for the revised dock. Derive rendered telemetry from immutable item byte snapshots and maintain
  view batch membership as necessary; a future change to public aggregation needs its own contract approval.
- At 100% byte transfer, show Processing while combine/polling remains active. Server task progress is a separate
  measure or an indeterminate indicator, never a claim that byte transfer percentage predicts readiness. A settled
  failure summary replaces an obsolete remaining-time estimate.
- Estimated time is labelled as transfer time, based on meaningful recent transfer samples, and omitted when unknown,
  stalled, failed/settled or only processing remains. Do not promise an end-to-end processing completion time.
- The application may install one `beforeunload` listener while tab departure would lose pending client work or
  unrecoverable progress/retry state, including queued work. Remove it when the condition ends. Server-owned processing
  with recoverable status alone need not trigger it. Use the browser's native confirmation; it is best effort, cannot
  guarantee a prompt on every platform and does not implement reload recovery. The library installs no global guard.

### Security and resource limits

- Adapter error messages are plain text; the library never renders raw HTML. Error codes are English API identifiers,
  never product strings.
- `chunkSize` is clamped to positive finite bytes; `concurrency` to 1..4; `maxRetries` to 0..10; `pollIntervalMs` to at
  least 1000 ms.
- The queue retains items until explicit `remove`, `clearCompleted`, or an owner form reset for the corresponding value.
  `maxFiles` limits one selection/batch, not the session total; callers must clear completed items to bound long
  sessions. No hidden persistence is added.

## Clarity, accessibility, and localization

Use Clarity tokens, file input container, progress bar, buttons, alert styles and `cds-layout`. Light/dark, compact,
narrow layouts, large text and RTL must be exercised in the demo. Owned messages are listed below; every key ships in
`en`, `zh-CN`, `zh-TW`, `de`, `es`, `fr`, `ja`, `ko`, `nl`, `pt-BR` and `ru`, plus any alias already present in a
dictionary. Runtime English fallback is not delivery.

The table below is the existing message baseline. `upload.confirm.*` and the old size-toggle presentation are retained
for compatibility/history, not used as the new active-close flow. `upload.clearCompleted` now describes the UI action on
successful records only. The additional message inventory below reflects the implementation; independent human
acceptance remains separate.

| Key                                           | English source                                                | Use                                                  |
| --------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `upload.selectFile` / `upload.selectFiles`    | Select file / Select files                                    | Trigger label by `multiple`                          |
| `upload.selectedCount`                        | {0} files selected                                            | Selected-files summary with `multiple`               |
| `upload.browse`                               | Browse                                                        | Input affordance                                     |
| `upload.dropzone`                             | Drag and drop files here, or browse                           | Dropzone title                                       |
| `upload.dropzone.dragOver`                    | Drop files to add them                                        | Dropzone drag-over state                             |
| `upload.folderAdd`                            | Add folder                                                    | Folder selection, shown with `multiple`              |
| `upload.usedFiles`                            | {0} of {1} files used                                         | Dropzone usage count with `maxFiles`                 |
| `upload.hint.accept`                          | Allowed types: {0}                                            | Dropzone hint segment with `accept`                  |
| `upload.hint.maxSize`                         | Up to {0} MiB per file                                        | Dropzone hint segment with finite `maxSize`          |
| `upload.hint.maxFiles`                        | Up to {0} files                                               | Dropzone hint segment with `maxFiles`                |
| `upload.rate`                                 | {0}/s                                                         | Uploading row transfer rate                          |
| `upload.remove`                               | Remove                                                        | Remove item                                          |
| `upload.remove.hint`                          | Dismiss {0} from the list (does not delete any uploaded file) | Accessible name for Remove                           |
| `upload.clearAll`                             | Clear all files                                               | Clear the selection                                  |
| `upload.clearValidationErrors`                | Clear validation errors                                       | Dismiss rejected-file messages                       |
| `upload.cancel`                               | Cancel                                                        | Cancel active item                                   |
| `upload.retry`                                | Retry                                                         | Retry error item                                     |
| `upload.panel.title`                          | Upload progress                                               | Panel header title                                   |
| `upload.minimize`                             | Minimize                                                      | Panel window control                                 |
| `upload.expand` / `upload.collapse`           | Show details / Show fewer                                     | Panel size toggle                                    |
| `upload.close`                                | Close                                                         | Panel window control label                           |
| `upload.close.hint`                           | Close upload progress                                         | Accessible name of the panel Close button            |
| `upload.restore`                              | Restore upload progress                                       | Minimized badge                                      |
| `upload.confirm.title`                        | Uploading in progress                                         | Close-confirmation dialog title                      |
| `upload.confirm.background`                   | Keep uploading in the background                              | Confirmation action, dismiss to badge                |
| `upload.confirm.cancelAll`                    | Cancel all and close                                          | Confirmation action                                  |
| `upload.done`                                 | Done                                                          | Close idle panel                                     |
| `upload.cancelAll`                            | Cancel all                                                    | Footer batch action                                  |
| `upload.retryFailed`                          | Retry failed ({0})                                            | Footer batch action                                  |
| `upload.clearCompleted`                       | Clear completed                                               | Clear successful records only                        |
| `upload.status.queued`                        | Queued                                                        | Item status                                          |
| `upload.status.uploading`                     | Uploading                                                     | Item status                                          |
| `upload.status.processing`                    | Processing                                                    | Item status, indeterminate                           |
| `upload.status.success`                       | Uploaded                                                      | Item status and success mark label                   |
| `upload.status.error`                         | Failed                                                        | Item status                                          |
| `upload.status.cancelled`                     | Cancelled                                                     | Item status                                          |
| `upload.validation.accept`                    | This file type is not allowed.                                | Validation error                                     |
| `upload.validation.maxSize`                   | The file is larger than {0} MiB.                              | Validation error with placeholder                    |
| `upload.validation.maxFiles`                  | You can select at most {0} files.                             | Validation error with placeholder                    |
| `upload.error.initiate`                       | The upload could not be started.                              | Phase error                                          |
| `upload.error.chunk`                          | A chunk could not be uploaded.                                | Phase error                                          |
| `upload.error.combine`                        | The uploaded chunks could not be finalized.                   | Phase error                                          |
| `upload.error.status`                         | The upload status could not be checked.                       | Phase error                                          |
| `upload.error.unknown`                        | The upload failed.                                            | Fallback                                             |
| `upload.error.cancel`                         | The upload could not be cancelled.                            | Cancel-failure error                                 |
| `upload.progress.aggregate`                   | {0}% uploaded ({1} active)                                    | Aggregate accessible value                           |
| `upload.progress.details`                     | {0}% · {1} of {2} · {3} left                                  | Footer meta line with byte totals and remaining time |
| `upload.progress.detailsBytes`                | {0}% · {1} of {2}                                             | Footer meta line when remaining time is unknown      |
| `upload.summary.success`                      | Uploaded {0} files · {1}                                      | Success summary row                                  |
| `upload.summary.show` / `upload.summary.hide` | View uploaded files / Hide uploaded files                     | Summary expand/collapse toggle                       |
| `upload.announce.success`                     | {0} uploaded.                                                 | Live announcement                                    |
| `upload.announce.error`                       | {0} failed: {1}                                               | Live announcement                                    |
| `upload.announce.cancelled`                   | {0} upload cancelled.                                         | Live announcement                                    |
| `upload.announce.uploading`                   | Uploading {0}.                                                | Live announcement on transfer start                  |
| `upload.announce.processing`                  | Processing {0}.                                               | Live announcement on processing start                |
| `upload.announce.cancelledAll`                | {0} uploads cancelled.                                        | Count announcement for batch cancel                  |
| `upload.announce.background`                  | {0} uploads continue in the background.                       | Background-dismiss announcement                      |

Implemented additional library messages (all library locales and aliases):

| Key                         | English source                                                                           | Use                                |
| --------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| `upload.progress.counts`    | {0} active · {1} failed                                                                  | Legacy, not the visible title      |
| `upload.progress.phases`    | {0} uploading · {1} queued · {2} processing                                              | Legacy; phases remain per row      |
| `upload.cancel.confirm`     | Cancel {0} active uploads in this queue? Completed files will be kept.                   | Legacy, not rendered               |
| `upload.transfer.remaining` | Estimated transfer time: {0}                                                             | Transfer-only estimate             |
| `upload.replace`            | Choose a corrected file.                                                                 | Permanent content failure guidance |
| `upload.reading`            | Reading files…                                                                           | Local folder enumeration           |
| `upload.validation.summary` | {0} files were not added. Other valid files will continue uploading.                     | Local rejection summary            |
| `upload.duplicate`          | {0} is already selected or in this queue. View the existing item for status or recovery. | Non-danger duplicate notice        |

The application demo owns its banner, destination form, minimize action, API explanations and dialog labels in all
eleven demo locales. Library dictionary aliases are preserved. Reuse existing Close, Cancel all, Retry failed and
success summary messages where their meaning matches. The legacy `upload.confirm.*` close-prompt keys remain compatible;
all cancellation-confirmation keys are legacy aliases and are not rendered. These translated implementations and
automated dictionary checks do not constitute independent human language acceptance.

Accessibility contract:

- File input has a programmatic label using `controlId` and visible text; disabled state is exposed natively.
- Each item row exposes name, status, progress value and error text through semantic elements and ARIA; success is not
  color-only.
- Progress updates are announced through a single polite live region with deduplication by item id and status; repeated
  renders do not re-announce identical values.
- Collapse/restore, settled Close, Retry and removal controls are real buttons with meaningful names and visible focus.
  The disclosure exposes `aria-expanded`. Compact status includes failure counts as well as active work.
- There is no active-state close or cancel-all confirmation dialog. Cancel all runs immediately. Modal focus stays
  inside the dialog, including when its final success/error is removed; the non-modal dock does not trap focus.
- The success disclosure has `aria-expanded`, count and size; its Clear completed action is a sibling button, not a
  nested interactive element. Failed rows never disappear into the success disclosure.
- Explicit settled Close restores focus safely and dismisses the displayed terminal records. Automatic failure expansion
  uses a deduplicated polite announcement without moving focus. Announce phase changes, not every progress tick.
- Keyboard/browser journeys cover selection, immediate cancellation, retry, success-only clearing, collapse, restore,
  settled Close, Escape, in-app navigation and modal/dock handoff in both themes and RTL. Honor reduced motion,
  zoom/reflow and long labels. Reuse the existing semantic progress implementation or Clarity where it fits; replacing a
  progress element purely for its tag name is not an acceptance criterion.
- Automated scans and explicit interaction tests are engineering evidence. Independent human language approval and the
  manual assistive-technology decision remain separate records per the acceptance contract; the 2026-11-10 AT waiver is
  not a passed assessment.

## Whole-object S3 demonstration

The existing demo page also composes the queue with an application-owned whole-object PUT adapter; see the
[S3 integration guide](../../guides/s3-object-uploads.md). This adds no public library API. The demo stages files,
freezes bucket/prefix/overwrite context at enqueue, hashes file bytes, sends one PUT per object, and uses the shared
panel for progress, cancellation and retry. Its endpoint is a local simulation, not backend acceptance evidence.

Visible messages and accessible names are owned by the demo dictionaries in all eleven demo locales: S3 object uploads,
simulation explanation, Bucket, Object key prefix, Overwrite existing objects, Completed object destinations, and the
size/concurrency/multipart limitations. The Upload action reuses the existing translated confirmation label; file
selection and panel actions reuse library messages. HTTP status numbers are transport diagnostics under the localized
phase error. Standard Clarity fields and semantic form submission provide keyboard operation and labels; no new overlay
or focus owner is introduced.

The example limits files to 16 MiB because Web Crypto hashing reads the whole file into memory. It uploads files
serially, preserves no folder hierarchy, implements no real multipart protocol, and cannot resume after reload. These
limitations must remain visible alongside the example. Browser tests cover exact request bytes/headers, conditional
overwrite, queued destination isolation, zero-byte files, retry and cancellation during hashing/transfer. Independent
language acceptance remains separate from automated dictionary and accessibility checks.

## Demo and validation plan

The following checks define the acceptance plan. The 2026-11-24 verification record reports which checks have run;
historical passing results apply only to their earlier revisions.

- Make automatic upload the Basic and modal-composition learning path. Remove routine confirm-first walkthroughs from
  the primary demo; retain one concise advanced manual-staging example with a real metadata/destination requirement.
  Preserve CVA/ngModel/Reactive Forms/`toSignalForm`, promise, `HttpClient`, completion and S3 composition coverage.
- Exercise accepted/rejected selection, no request before deliberate submission in advanced staging, enqueue ordering,
  queued/uploading/processing cancellation, unacknowledged-chunk retry, stale callbacks and completion-promise behavior.
- Test one shared surface through modal/dock handoff and route teardown, two-state collapse/restore and no duplicate
  I/O/listeners. Empty picker Close changes no queue state; active minimize preserves all records; explicit settled
  Close clears only the displayed scope and hides its surface. Failures remain until explicit dismissal, with no
  automatic clearing on settlement. No fixed history entry or reopen-after-dismiss behavior is required. Success-only
  clearing leaves errors, cancelled items, completion state and form value untouched. Retain the headless
  `clearCompleted()` terminal-purge regression and existing `restore()` semantics.
- Test immediate Cancel all with no confirmation, its active snapshot, subsequent additions, cancellation failure and
  transition to settled Close without accidental action substitution. Validate feature-dialog versus global scope.
- Test byte-weighted telemetry with one tiny and one large file; no false completion during processing; stable batch
  bookkeeping when successful records clear; appended/removed/retried/failed/cancelled files; unavailable ETA.
- Test modal unmount without form reset, immutable destinations, late folder-scan callbacks after cancellation/logout,
  and server cancellation/status uncertainty.
- Test mixed valid/invalid folder drops, repeated additions during transfer, one-drop and cross-drop suspected
  duplicates, same basename with differing metadata/path, different destinations, error-to-Retry guidance and re-add
  after cancellation/clearing. Confirm rejection and duplicate feedback never resets or blocks valid transfers.
- Test D3 once-per-attempt expansion, manual recollapse, failed retry, focus preservation, modal suppression and live
  announcement deduplication. Include empty, queued, active, processing-only, mixed-failure, all-success, all-failure,
  all-cancelled and mixed-terminal states with consistent visible counts.
- Run focused unit/type/browser regressions on Chromium, Firefox and WebKit. Verify dark/light, RTL, narrow screens,
  zoom, long file names, long translations, keyboard focus, screen-reader names and practical 50-file layouts.
- Complete revised messages in all supported dictionaries and run translation, formatting, lint/type, package and
  relevant build checks. Discover resolved Nx targets at implementation time; use repository release validation only for
  that approved increment. Record automated results, independent language acceptance and the manual AT decision
  separately; earlier acceptance does not approve changed strings or interactions.
- Record focused unit, browser, localization, static, build and package verification for the implementation; run
  formatting and `git diff --check` for the final diff.

## Compatibility, rollout, and risks

- Angular 21.2.x, CDK 21.2.x, Clarity 18.4.x, Nx 22.x. No new runtime dependency and no secondary entry point are
  proposed; `@angular/cdk` is already installed. Both libraries gain root-barrel exports from their `lib/upload` and
  component folders.
- Public barrels change only after approval: `ngx-lift/src/index.ts` gains `./lib/upload`, and `clr-lift`
  component/barrel files gain the two components.
- Rollout increments: (1) headless queue and types with tests; (2) `cll-upload` selection/validation/CVA; (3) non-modal
  panel with minimize/restore; (4) demo, all locales and E2E. Each increment must build and be independently reviewable.
- Risks and owners: adapter contract mismatch with an existing backend (Maintainer, adapter examples); server task
  polling schema (consumer adapter implements `getStatus`); RTL and long translated labels in the badge (demo owner);
  overlay z-index conflicts with existing app bars (demo owner); chunk retry semantics when a server does not
  acknowledge partial chunks (Maintainer, resolved as retry of unacknowledged chunks only).
- Rollback: keep the spec Draft and remove the new barrel exports; no persisted data or migration is introduced.

## Review decisions and delivery

### Current recommendation review: 2026-11-24

Disposition: **Standards and spec-conformance code reviews green; UX decisions D1-D4 accepted**. The library/demo
increment is implemented. Remaining external evidence is independent human acceptance and application/backend
integration; the fresh-install check is environment-blocked as described below. The maintainer authorized code changes
and push; merge and package publication are outside this request. No new root export or history feature is proposed; the
additive integration members below cover the required seams. Existing `restore()`, `clearCompleted()` and public
aggregate semantics remain compatible.

| Review aspect         | Verdict            | Evidence and required action                                                                                                       |
| --------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Admission             | Pass               | Reuses the admitted queue, components, `remove` and `restore`; no wrapper, dependency or new export                                |
| Consumer evidence     | Pass               | Original downstream chunked services and newly inspected design frames; keep product rules application-owned                       |
| Industry comparison   | Pass               | Dated Uppy, NG-ZORRO and MDN evidence above; earlier Clarity/Material rows retain their original check dates                       |
| API design            | Pass               | No new history entry, export or restore behavior; existing terminal-purge and restore APIs remain compatible                       |
| Contracts             | Pass               | D1-D4 implemented; success-only UI clearing, scoped intake and explicit settled Close retain headless contracts                    |
| Form applicability    | Pass               | Existing File-array CVA remains; record clearing and visibility do not reset the owner form                                        |
| Accessibility         | Pass (automated)   | Keyboard/focus regressions and light/dark upload-page scans passed; independent AT acceptance remains separate                     |
| Language              | Pass (engineering) | All supported dictionaries/aliases and API descriptions updated; independent acceptance of revised copy remains pending            |
| Dependency and bundle | Pass               | Existing Angular/CDK/Clarity/native APIs; no added runtime dependency or entry point                                               |
| Lifecycle and safety  | Pass               | Guarded focus, cancel snapshots, modal suppression and late-drop regressions passed; backend integration remains application-owned |
| Tests and demos       | Pass               | 99 upload/S3 browser cases and 6 theme accessibility cases passed across Chromium, Firefox and WebKit                              |
| Evidence separation   | Pass               | Current automated results and independent acceptance are recorded separately; historical results do not validate new UX            |
| Codebase gaps         | Pass               | Source, current UX contracts and demos aligned; dated historical records are explicitly separated                                  |
| Fit and sequence      | Pass               | Maintainer authorized this upload increment and push; no new runtime dependency or root export                                     |

### Implementation verification: 2026-11-24

Validation was performed against this implementation before commit/push:

- Two independent, read-only code-review axes (standards and spec conformance) reported green after iterative fixes.
  Fixes include focus after disappearing actions, explicit destination identity, cancel snapshot counts, duplicate
  location, and separate Minimize/Close nodes so an in-progress activation cannot become destructive on settlement.
- Full unit coverage run: `ngx-lift` 65 files / 1,027 tests; `clr-lift` 42 files / 554 tests; demo 91 files / 346 tests.
  Coverage thresholds passed: statement/branch coverage 93.91%/90.25%, 91.31%/81.14%, and 89.82%/75.20%, respectively.
- Upload and S3 browser suite: **99/99 passed** on a standalone development build served statically, across Chromium,
  Firefox and WebKit. Includes automatic modal upload, no duplicate interactive dock, invalid/duplicate mixed intake,
  manual destination staging, processing, cancellation, focus and activation-race regression coverage.
- Upload route light/dark accessibility inventory: **6/6 passed** across the same three browsers. The browser suite also
  exercises active and validation-error accessibility states. These are automated checks, not manual AT acceptance.
- Repository formatting, tooling tests, translation completeness, lint/typecheck, production builds and bundle checks
  passed. The upload panel stylesheet emits a 7.27 kB warning against the 6 kB warning budget, below its error budget.
  Nx Cloud remote cache is unavailable because of the organization's plan; local task results are still valid.
- `pnpm run validate` reached the final package verification stage. Its linked tarball consumer passed exports/imports
  and strict type checks, but the fresh isolated peer install timed out accessing `registry.npmjs.org`. Retrying with
  the installed repository-pinned pnpm 12.16.1 confirmed the network problem; offline retry failed because cached
  metadata for `@angular/router` was unavailable. **Fresh consumer installation remains unverified**; no linked or unit
  result is substituted for it, and the full validation command is not reported as passed.
- An extra standalone test-source TypeScript check reports pre-existing missing DOM iterable support in unrelated
  breadcrumb/datagrid-selection specs. Touched upload fixture types were tightened; configured project typechecks pass.
- A dedicated build under a temporary directory was used for the final browser run, avoiding live-reload interference.
  Earlier browser failures were corrected or rerun against the stable build; they are not counted as passing evidence.
- No source change was made to a consuming product. Archive manifest parsing, real file limits, backend cancellation,
  session/target configuration and a native browser-departure guard remain application integration responsibilities.

### Independent human acceptance

The maintainer approved D1-D4 and the discussed UX refinements on 2026-11-24. Revised strings and rendered interactions
have not received new independent human language acceptance; historical acceptance below does not approve this revision.
The documented manual AT waiver remains a waiver, not a passed assessment. Merge, backend deployment and package
publication have not been performed or authorized by this implementation request.

### Historical decisions and evidence

The entries below preserve earlier decisions and validation for auditability. Earlier Close, confirm-first-primary,
Clear completed UI and three-window-control wording is superseded by the current recommendation; it does not describe
the recommended target. Historical acceptance cannot be reused as acceptance of the revised UI.

Decisions confirmed in the 2026-11-20 design interview:

1. Consumer evidence exists in a downstream release-management UI with three duplicated chunked services; roadmap entry
   added as Draft after Drawer. Named details stay in the PR, not in public docs.
2. Transport is consumer-provided `UploadAdapter`; the library owns lifecycle, progress, cancellation and retry.
3. Headless lifecycle lives in `ngx-lift`; Clarity UI lives in `clr-lift`.
4. `chunkSize` presets are 5 MB and 25 MB with custom values allowed; `concurrency` defaults to 2, range 1..4.
5. Panel is non-modal from first display; minimize/restore is in-session only.
6. Cancel aborts local work and terminates server upload when an `uploadId` exists; Retry re-sends only unacknowledged
   chunks starting with the lowest; auto-retry is opt-in for retryable chunk errors.
7. `cll-upload` implements CVA for `readonly File[]`; queue state is separate, but owner writes are authoritative for
   the items created from that value.
8. All owned messages ship in every supported locale; raw HTML is never rendered.

Spec-review revisions, 2026-11-20 (all applied and approved in PR #243, merged 2026-11-20):

- `UploadQueueOptions` includes `adapter`; the root queue stores it per item. `getStatus()` returns `UploadStatusResult`
  with numeric processing progress. `autoRetry` uses `UploadError.retryable`.
- `concurrency` is the in-flight chunk limit for one active file; files remain strictly ordered. Chunks may resolve out
  of order, retry sends only unacknowledged chunks, and `onProgress` feeds in-flight byte progress.
- `cll-upload` exposes `validationErrors`; selection validation is component-owned and the headless queue does not
  validate. Form reset/disable behavior, `maxFiles` scope and polling timing are defined above.
- Admission rows now apply every criterion to every symbol. Fit wording says root-barrel export, not a secondary entry
  point. `maxSize` defaults to `Infinity` to match `cll-file-reader`; `0` rejects all files.
- Component classes drop the `Cll` prefix (`UploadComponent`, `UploadPanelComponent`) to match existing clr-lift class
  naming; selectors keep `cll-`.
- Session-level `minimized` stays in the root queue so it survives navigation; the service stores no DOM or overlay. One
  shared panel serves all hosts. Individual `cll-upload` inputs mirror `UploadQueueOptions` for template ergonomics; a
  single options-object input is not proposed.
- Terminal `error`, idle close, focus behavior, queued/processing cancel and the state diagram are corrected above.
- Second review pass, 2026-11-20: retry is defined per failed phase (initiate, chunk, combine, status) with manual
  `retry(id)` available for every error phase; the diagram lists the per-phase error/cancel edges; panel creation and
  declaration, shared-panel focus restoration, `onProgress` clamp bounds and terminal-item wording are tightened.
- Third pass, 2026-11-20: the maintainer confirmed the four open decisions; added the per-item completion promise, the
  promise and `HttpClient` transport examples, and the Composition demo path for query and mutation integration.

Decisions confirmed by the maintainer on 2026-11-20:

- Escape minimizes during active uploads and closes when idle; Escape is handled only inside the panel or badge.
- `getStatus` is optional; processing progress stays indeterminate when it is absent.
- Drag-and-drop was deferred on 2026-11-20; the 2026-11-21 revision below brings the dropzone into scope.
- No library-level `beforeunload` guard; applications opt in.

Additions approved with the spec in PR #243:

- `UploadQueueService.completion(id)` with the terminal-state, rejection and retry contract defined above.
- A demo Composition tab covering promise, `HttpClient`, `queryResource` and `mutateResource` usage.

UI-review revision, 2026-11-21, pending maintainer confirmation (no public API change):

- The PR #243 panel defined minimize and an idle close but no Close control, no size toggle and no batch actions; the
  first implementation rendered minimize as a text link and a footer "Done", which does not read as a transfer window.
  This revision adopts the standard window-control set (Minimize, Expand/Collapse, Close) with desktop semantics, and
  adopts the Uppy Dashboard evidence for the footer meta line and batch actions.
- Close never cancels silently. With active items, Close opens an inline confirmation offering "keep uploading in the
  background" versus "cancel all"; this follows the established browser download-surface pattern and makes cancellation
  at batch scope explicit. Escape and idle-close semantics from the 2026-11-20 decisions are unchanged.
- Successful items collapse into a success summary row and failed items stay pinned and expanded, so the panel keeps a
  bounded height while keeping every row reachable. This needs no new service state: `minimize/restore`, `cancel`,
  `retry`, `remove` and `clearCompleted` already cover every action; collapse and the confirmation prompt are panel view
  state.
- New owned strings are added to the localization table (window controls, confirmation prompt, batch actions, progress
  details, summary row); `upload.done` keeps its idle-close role. The 2026-11-20 industry table gains the Uppy Dashboard
  row (checked 2026-11-21); Chrome download bubble and Drive-style panel behavior are cited as the widely observed
  pattern for background-dismiss close.

Historical implementation work used PR #250 (closed without merge); its follow-up PR #252 remains open as checked
2026-11-24. These historical panel decisions are superseded by the current recommendation above.

Spec revision, 2026-11-21, dropzone selection (maintainer request; no new service API):

- Drag-and-drop moves out of "Not now" into scope: `cll-upload` renders a dashed dropzone as the primary selection
  surface with a drag-over state, hint segments (allowed types, per-file size, file count; omitted without data), a
  used-files count with `maxFiles`, and an "Add folder" action (`webkitdirectory`, shown with `multiple`). Dropped
  folders are traversed through `webkitGetAsEntry()` entries; drops run the same validation path as the native input,
  and rejected files never enqueue. The per-file label trigger is replaced by the dropzone's Browse action;
  `upload.selectFile` / `upload.selectFiles` remain available dictionary keys.
- Uploading rows show the per-row transfer rate and estimated remaining time, sampled from published byte progress and
  omitted without data, matching the Uppy meta-line pattern at row scope.
- Rejected-file rows inside the transfer panel (as seen in some reference designs) stay out of scope: validation
  failures never create queue items, per the PR #243 decision; the host renders rejections beside the dropzone.
- New owned localization keys: `upload.dropzone`, `upload.dropzone.dragOver`, `upload.folderAdd`, `upload.usedFiles`,
  `upload.hint.accept`, `upload.hint.maxSize`, `upload.hint.maxFiles`, `upload.rate`.

Spec revision, 2026-11-22, staging and debugging:

- `autoEnqueue=false` adds the "select → inspect → confirm → upload" second segment used by release-bundle style flows:
  the host still validates and emits `filesChange`, but does not enqueue or open the panel. The caller enqueues with its
  own adapter options after confirmation; the shared queue and global panel remain the single transport/view.
- Dev-only: `window.__uploadQueue` is installed when `isDevMode()` is true in a browser. `snapshot()` returns plain
  queue/runtime state (phases, acknowledged chunks, retries, normalized options) for console and Angular DevTools
  inspection; production and SSR do not expose it.

## Evidence

Sources are the public URLs in the industry table, the project workflow documents, the accessibility and language
acceptance contract, and maintainer-supplied consumer observations recorded on 2026-11-20; named consumer details are in
the PR.

Verification run on 2026-11-22 (revision: confirm-first staging, dev queue snapshot, panel UX, form integrations,
`HttpClient` transport demo and release gates):

- `nx test clr-lift`: 42 files / 527 tests passed, covering the panel, `autoEnqueue` staging, CVA id/label/disabled
  contract and owner reset.
- `nx test ngx-lift`: 65 files / 1008 tests passed, covering the headless lifecycle, retry/cancel/completion and inline
  `expectTypeOf` contract assertions, including a regression test that a chunk retry keeps the item `uploading` with its
  acknowledged progress. Inline `expectTypeOf` is this repository's accepted type-test convention; there is no
  `*.test-d.ts` target.
- `nx run @ngx-lift-workspace/source:i18n-check`: 0 errors, all 11 locale dictionaries complete.
- `nx typecheck demo`, `nx typecheck clr-lift`, `nx typecheck ngx-lift`, `nx typecheck demo-e2e`: passed.
- `nx lint demo`, `nx lint clr-lift`, `nx lint demo-e2e`: 0 errors.
- Coverage: 91.62% statements and 93.04% lines overall; all projects passed.
- `nx build` for demo, clr-lift and ngx-lift, `bundle:check` and `verify:packages`: passed. `verify:packages` installs
  the packed libraries into a fresh strict-TypeScript consumer, covering the installed-consumer integration check.
- `nx serve demo` compilation: passed.
- Upload E2E (Chromium): 20/20 passed, covering selection and validation, window controls, cancel/retry/per-row Remove,
  confirm-first staging (queue empty until confirmation), reactive/ngModel/signal-form bindings, a keyboard-only
  journey, minimize/navigate/restore survival and an axe WCAG 2.0/2.1/2.2 A/AA scan of the playground and active panel.
- Cross-browser smoke (Chromium, Firefox, WebKit): 18/18 passed across six tagged upload journeys, including the
  keyboard-only journey, confirm-first staging, minimize/navigate/restore and the stubbed `HttpClient` success path.
- Controlled network fixtures: `page.route` stubs cover `HttpClient` chunk success, HTTP 500 failure and abort-timeout
  cancellation; `completion(id)` is asserted to reject with the abort error.
- Manual browser verification (Playwright): 50-file layout and list max-height, bottom-right minimized badge,
  confirm-first enqueue timing, cancel/clear staging, repeated folder upload after cancel/close and duplicate
  suppression.

Automated accessibility scanning found two WCAG AA color-contrast failures in dense panel labels
(`.cll-upload-panel__bytes` and `.cll-upload-panel__summary-label`). Both were corrected to `gray-700` and the scan now
passes. The production build reports a pre-existing `anyComponentStyle` warning of 6.59 kB against a 6 kB warning
budget; the stylesheet's byte size is unchanged by this revision and the value is below the 10 kB error budget.

Human language acceptance and the manual assistive-technology decision are reported separately from these automated
results: the maintainer reviewed both and approved them on 2026-11-22.

### PR #252 follow-up review (2026-11-22)

The follow-up covers visible focus restoration after activating the dropzone label, publishing every new message from
one announcement pass, handling repeated batch-retry failures, retaining the failed phase during retry, ignoring
progress callbacks from settled chunk requests, and settling completion when a cancelled row is removed before server
cancellation finishes. The form example binds the actual `FormGroup`, with `toSignalForm` observing it.

- Upload browser suite: 63/63 passed across Chromium, Firefox and WebKit, including the new label-selection/focus
  regression and the existing active-panel accessibility scan. The synthetic drop waits for the shared panel to attach;
  WebKit keyboard traversal uses Option+Tab to include buttons under Safari's default keyboard-access setting.
- `pnpm run validate` passed (format, tooling, translations, lint/typecheck, coverage, all builds, bundle and installed
  package checks). Final headless coverage rerun: 65 files / 1014 tests, 94.12% statements and 90.45% branches;
  component suite: 42 files / 537 tests, 91.14% statements and 80.73% branches. Final static checks passed with lint
  warnings; Nx Cloud remote-cache uploads were unavailable because the organization exceeded its plan.
- Unit regressions cover coalesced completion/start announcements, repeated batch failure, cancellation followed by
  synchronous removal, status-retry state, and stale callbacks after manual and automatic retry.
- No new public API, runtime dependency, or owned translation message is introduced. The human language acceptance and
  assistive-technology decision recorded above are unchanged.

## Review hardening and S3 composition (2026-11-23)

Maintainer-approved scope: address the review findings and deliver the whole-object S3 demo together in PR #252, against
main. The S3 adapter remains application code with no new library export or runtime dependency.

- CVA change precedes touch for selection/drop, including updateOn: 'blur'. NG_VALIDATORS exposes selection errors as
  {upload: readonly UploadError[]} and notifies Angular when errors clear, reset or change. Rejections are announced in
  a persistent polite region and associated with the picker and Browse button through unique descriptions.
- Cancellation rejects existing completion awaiters immediately; server cleanup runs independently and can report a
  cancel-phase error. A session ID arriving after cancellation/removal is cancelled best-effort, never uploaded.
- UploadItem.processingProgress is optional and present only after numeric server task progress is reported. The panel
  shows determinate processing then, and indeterminate processing while progress is unknown. Retrying status keeps known
  processing progress; a fresh initiation clears it.
- Keyboard Retry, Cancel and Remove restore focus to an available action for that item or a persistent panel control
  when the row disappears; they do not move focus if another control already owns it. Error text uses semantic theme
  tokens. Existing translated phase/error labels remain unchanged.

Spec review: admission/consumer evidence/industry comparison retain the approved upload seam; this increment adds no
public tool or dependency. Contracts, forms, lifecycle, keyboard/error semantics and test races are specified above; S3
messages and limitations are listed in the whole-object demonstration section. The optional progress field is additive.
Unit and browser regressions plus installed package checks provide engineering evidence; human language acceptance
remains separate. Release/publication is outside this PR's readiness claim.
