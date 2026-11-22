# Upload files design specification

Status: API reviewed and approved in PR #243 (merged 2026-11-20); panel interaction revised 2026-11-21 after a UI
review. Owner: Maintainer. Updated: 2026-11-21 (panel window controls, footer batch actions, row anatomy and completion
collapse; no public API change). Package: `ngx-lift` (headless queue lifecycle) and `clr-lift` (rendered Clarity UI).
All proposed symbols and examples are provisional and unavailable until implemented and verified.

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
Chunk size is 25 MB by default, 5 MB in proxy mode, with concurrency 2. No implementation supports retry, byte-offset
resume, or a minimizable progress window; cancellation is a confirmation modal followed by a server-side delete.

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
- **Panel**: the single non-modal floating progress surface for a root queue; **minimized badge** is its compact
  restored-state entry point.
- **Window controls**: the three panel-header buttons following desktop window conventions — **Minimize**, **Expand /
  Collapse** (panel size toggle) and **Close**. Restore is the badge action that un-minimizes.
- **Close confirmation**: the inline panel-header prompt shown when Close is activated while items are active; it offers
  "keep uploading in the background" versus "cancel all".
- **Success summary row**: the collapsed representation of all `success` items ("Uploaded {0} files · {1}") with an
  expand toggle; failed items are never collapsed into it.

## Goals

- G1: An operator can select one or many files, watch per-file and aggregate progress, cancel (per item or in bulk),
  retry failures, collapse finished uploads, and drive the panel with the standard window controls (minimize, expand,
  close) without leaving the current page. Closing never silently cancels active uploads.
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

| ID   | Actor and task                                    | Initial data/state                              | Action                                                                                               | Observable outcome                                                                                                                                                                                                           | Failure/recovery                                                                                                   | Demo/test                                                       |
| ---- | ------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| UC1  | Operator uploads one release/update bundle        | Idle page, single-selection trigger             | Choose `.zip`, start upload                                                                          | Item moves `queued -> uploading -> processing -> success`, success mark shown, `uploadComplete` emits                                                                                                                        | Invalid extension appears as visible error; adapter error keeps item in `error` with Retry                         | Planned playground + unit transition test                       |
| UC2  | Operator uploads several files                    | `multiple=true`, empty queue                    | Choose multiple allowed files                                                                        | One item per file, aggregate progress; one active file in enqueue order with up to `concurrency` chunk requests for it                                                                                                       | `maxFiles` or `maxSize` rejection is visible and does not start a request                                          | Planned playground + E2E multi-file fixture                     |
| UC3  | Operator cancels an active upload                 | One item `uploading`, `queued`, or `processing` | Click Cancel                                                                                         | Chunk/polling aborted where applicable, adapter `cancel(uploadId)` called only when an `uploadId` exists, item `cancelled`                                                                                                   | Failed abort still marks local cancellation and reports an error event                                             | Planned unit race test + E2E                                    |
| UC4  | Operator retries a failed chunk                   | Item `error` after chunk 3 of 10                | Click Retry                                                                                          | Upload re-sends only unacknowledged chunks, beginning with the lowest unacknowledged chunk; auto-retry respects `retryable`                                                                                                  | Exhausted retries remain `error` with visible message                                                              | Planned unit test with stub adapter                             |
| UC5  | Operator keeps working during upload              | Panel active with progress                      | Click Minimize, navigate in-app, click Restore badge; activate Close and choose "keep in background" | Page remains interactive; shared panel restores same per-file progress and history; Close with active items docks to the badge and uploads continue, announced via the live region                                           | "Cancel all" in the confirmation cancels every non-terminal item, clears terminal items and closes panel and badge | Planned E2E keyboard/focus journey                              |
| UC10 | Operator cleans up a mixed queue in bulk          | Panel shows finished uploads plus failures      | Use footer actions and the success summary row                                                       | "Cancel all" cancels every non-terminal item; "Retry failed ({n})" retries every `error` item; "Clear completed" removes terminal items; success items collapse into one summary row while failures stay pinned and expanded | Batch actions apply the same per-item rules as the row actions, including retry of exhausted errors                | Planned unit + E2E batch-action fixture                         |
| UC6  | Developer validates selection before upload       | `accept`, `maxSize=512` MiB, `maxFiles=3`       | Choose oversized or disallowed files                                                                 | Rejected files listed with localized validation error; accepted files still enqueue                                                                                                                                          | Clear validation errors removes rejections without changing form value or queue                                    | Planned unit + i18n check                                       |
| UC7  | Developer binds the chosen files to a form        | Reactive form with `formControlName`            | Select and reset files                                                                               | Control value is `readonly File[]`; owner reset yields a new empty array and removes its queue items; touched/disabled reflected                                                                                             | Invalid selection sets a validation error on the control                                                           | Planned form demo + type test                                   |
| UC8  | Operator reads progress with assistive technology | Panel open                                      | Start, fail, retry, succeed                                                                          | Named progress, status changes and errors announced once per transition                                                                                                                                                      | Repeated renders do not re-announce identical state                                                                | Planned interaction test; manual AT decision tracked separately |
| UC9  | Developer awaits a transfer programmatically      | Queue has the id returned by `enqueue`          | `await queue.completion(id)`, then register metadata                                                 | Promise resolves with the terminal item on success and rejects on error, cancellation or removal; the business write runs only after success                                                                                 | Unknown id rejects immediately; `retry(id)` re-arms a new promise for the next phase                               | Planned headless unit test + Composition demo tab               |
| UC11 | Operator adds files by dragging or from a folder  | Dropzone visible, `multiple=true`               | Drag files or a folder onto the dropzone, or activate "Add folder"                                   | Dropped files run the same validation and enqueue path as the native input; the dropzone shows a drag-over state, usage hints and the used count                                                                             | Invalid files are rejected with the same localized validation errors and never enqueue                             | Planned unit + E2E drop fixture                                 |

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

Closing a transfer surface without cancelling the transfers is the established desktop-browser pattern (the Chrome
download bubble and Drive-style upload panels keep transfers running behind a progress indicator), so this spec defines
Close as background-dismiss with an explicit cancel choice rather than silent cancellation.

The industry gap is not file selection or progress display; it is a small, transport-agnostic lifecycle plus a
non-blocking progress surface with cancellation and retry.

## Developer learning journey and pedagogy plan

| Reader task / prerequisites                     | Learning outcome                                                      | Destination / page type      | Working example and expected result                                                       | Validation                            |
| ----------------------------------------------- | --------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| Angular forms and a backend upload endpoint     | Integrate a minimal single-file upload                                | `cll-upload` demo, Basic tab | Copyable TS/HTML with a stub adapter; one success row                                     | Focused unit + browser check          |
| Need multiple bundles and chunk-size control    | Configure `multiple`, `accept`, `maxSize`, `chunkSize`                | Demo, Configuration tab      | 25 MB default and 5 MB proxy preset; visible validation errors                            | Unit + E2E fixture                    |
| Need cancellation and retry                     | Explain lifecycle states and recovery                                 | Demo, Failure handling tab   | Fail a stub chunk, observe error, retry, cancel another item                              | Unit race test + E2E                  |
| Need progress while using the page              | Minimize and restore the panel                                        | Demo, Panel tab              | Minimize, navigate, restore, Done/Clear                                                   | Keyboard/focus E2E                    |
| Using typed Reactive Forms                      | Bind `readonly File[]` through CVA and `toSignalForm`                 | Demo, Forms tab              | ngModel, typed `FormGroup`, `toSignalForm` examples                                       | Form type test + browser check        |
| Awaiting a transfer and refreshing related data | Use `completion(id)`, promise adapters and query/mutation composition | Demo, Composition tab        | `await completion(id)` then `mutateResource.mutate()`, with a `queryResource`-backed list | Headless promise test + browser check |

Destinations are proposed routes under the demo app and are not delivered evidence until implemented.

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

| Name               | Kind            | Default             | Meaning                                                                                                   |
| ------------------ | --------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `adapter`          | input, required | -                   | Transport implementation; passed to each `enqueue` call.                                                  |
| `multiple`         | input           | `false`             | Allow multi-selection.                                                                                    |
| `accept`           | input           | `''`                | Native `accept` expression passed to the file input.                                                      |
| `maxSize`          | input           | `Infinity`          | MiB per file; `Infinity` means unlimited, matching `cll-file-reader`; `0` rejects all files.              |
| `maxFiles`         | input           | `0`                 | Maximum accepted files per selection/batch; `0` means unlimited.                                          |
| `chunkSize`        | input           | `UPLOAD_CHUNK_25MB` | Bytes per chunk.                                                                                          |
| `concurrency`      | input           | `2`                 | In-flight chunk requests for the active file, clamped to 1..4; values above 1 require independent chunks. |
| `autoRetry`        | input           | `false`             | Retry `chunk` errors marked `retryable: true` automatically.                                              |
| `autoEnqueue`      | input           | `true`              | `false` validates and emits `filesChange` only, for staging flows that enqueue after a confirmation step. |
| `maxRetries`       | input           | `3`                 | Automatic attempts per failing chunk.                                                                     |
| `pollIntervalMs`   | input           | `10000`             | Server status poll interval for adapters that implement `getStatus`.                                      |
| `disabled`         | input           | `false`             | Disable selection and queue actions; CVA disabling also cancels this control's in-flight items.           |
| `controlId`        | input           | `''`                | Stable id for label/input association.                                                                    |
| `filesChange`      | output          | -                   | Emits the current `readonly File[]` value.                                                                |
| `validationErrors` | output          | -                   | Emits rejected files as `UploadError[]` with phase `validation`.                                          |
| `uploadComplete`   | output          | -                   | Emits items that reached `success`.                                                                       |
| `uploadError`      | output          | -                   | Emits items that reached `error`.                                                                         |
| `uploadCancelled`  | output          | -                   | Emits items that reached `cancelled`.                                                                     |

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
- `UploadPanelComponent` renders one CDK overlay per root queue with `hasBackdrop: false`; it never locks page scroll or
  makes the background inert. It disposes its overlay on teardown and does not mutate global styles.
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

### Panel and minimize behavior

- One `cll-upload-panel` overlay exists per root queue; all `cll-upload` hosts append their items to it. The panel is
  created automatically on the first enqueue and is not visible before any item exists; an application may declare
  `<cll-upload-panel>` once itself, in which case hosts attach to that instance instead of creating a new overlay. The
  panel survives host teardown while the queue still has items, so uploads started by a destroyed host remain visible
  and controllable; the last host to interact owns focus restoration.
- Panel anatomy follows desktop transfer-window conventions: a header row with the localized title and the three window
  controls (Minimize, Expand/Collapse, Close), the item list, and a footer row with the aggregate progress line and the
  batch actions. Minimize docks a compact badge showing active count and aggregate progress for the shared queue;
  Restore (on the badge) reopens that same panel, not a per-host panel. Expand/Collapse toggles the item list between
  full height and a compact height showing only the active and failed items; it never changes queue state. Close behaves
  like the Chrome download bubble: closing never cancels uploads.
- Close confirmation: activating Close while any item is active (queued, uploading, processing) swaps the item list for
  an inline prompt with two actions — "keep uploading in the background" (dismisses to the minimized badge and uploads
  continue, announced via the live region) and "cancel all" (cancels every non-terminal item, clears terminal items and
  closes panel and badge). The prompt is a warning dialog (`role="alertdialog"`) with the two actions and no third
  dismissal path; activating it again with no active items performs the idle close directly.
- Idle close: when no item is active, Close (header button, badge action or Escape) clears terminal items (success,
  cancelled, exhausted error) and hides the panel; no in-flight item can remain in that state. Escape is handled only
  while focus is inside the panel or badge; it never intercepts Escape elsewhere on the page.
- Row ordering is success-collapse, failure-pinned: successful items collapse into one summary row ("Uploaded {0} files
  · {1}") with an expand/collapse toggle for the detail list; failed items stay expanded and pinned below the active
  rows; queued and uploading rows follow enqueue order. The panel never grows unbounded: the item list scrolls at a
  bounded height instead of pushing the footer out of view.
- The footer shows the aggregate progress line (percent plus uploaded and total bytes, matching the Uppy
  `showProgressDetails` pattern) and the batch actions: "Cancel all" when non-terminal items exist, "Retry failed ({n})"
  when `error` items exist, and "Clear completed" when terminal items exist. Batch actions apply the same rules as the
  row actions, including retry of exhausted errors; a batch action that changes no item is not rendered. Meta segments
  without data (speed, remaining time) are omitted rather than rendered as placeholders; remaining time is estimated
  from acknowledged-byte rate and never blocks rendering.
- Overlay position uses a direction-aware strategy (inline-end/bottom rather than physical right) so RTL mirrors the
  panel placement. Focus returns to the `cll-upload` host that most recently opened or interacted with the panel. The
  panel has its own focusable controls but is not a focus trap: Tab moves out into the page while the panel remains open
  and non-modal.

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
| `upload.clearCompleted`                       | Clear completed                                               | Clear terminal items                                 |
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

Accessibility contract:

- File input has a programmatic label using `controlId` and visible text; disabled state is exposed natively.
- Each item row exposes name, status, progress value and error text through semantic elements and ARIA; success is not
  color-only.
- Progress updates are announced through a single polite live region with deduplication by item id and status; repeated
  renders do not re-announce identical values.
- Window controls (Minimize, Expand/Collapse, Close) are real buttons with accessible names and visible focus; the size
  toggle exposes its expanded state (`aria-expanded` plus a changed accessible name) and the Close button announces what
  it does, never just "close". Dismissing to the background announces that uploads continue; cancelling all announces
  how many items were cancelled.
- The close-confirmation prompt is an `role="alertdialog"` with a title, the two actions and initial focus on the safe
  action ("keep uploading in the background"); Escape inside the prompt chooses the safe action; focus stays in the
  prompt until it resolves.
- The success summary row is a disclosure with `aria-expanded` and an accessible name carrying the count and size; the
  detail list is labelled so screen readers can skip it. Failed rows are never hidden by the summary toggle.
- Minimize/Restore are real buttons with accessible names and visible focus; the minimized badge exposes the aggregate
  value ("{0}% uploaded ({1} active)") as its name. Focus returns to the trigger on close; page interaction remains
  available while the panel is open.
- Keyboard journeys cover Add, Cancel, Retry, Cancel all, Retry failed, Clear completed, Minimize, Restore, Expand,
  Collapse, Close, the confirmation actions and Escape in both themes and RTL. The panel has no essential animation;
  non-essential transitions honor `prefers-reduced-motion`, with all actions still available when motion is reduced.
- Automated scans and explicit interaction tests are engineering evidence. Independent human language approval and the
  manual assistive-technology decision remain separate records per the acceptance contract; the 2026-11-10 AT waiver is
  not a passed assessment.

## Demo and validation plan

Planned work, not yet evidence:

- Add a `cll-upload` demo route and navigation entry using `cll-page-container`, `app-demo-playground` copyable
  TS/HTML/SCSS, and API tables through `ApiTableComponent`.
- Cover UC1-UC10 in demo panels: basic, configuration, failure/retry, panel/minimize (window controls, close
  confirmation, success summary row, footer batch actions), forms and Composition. The Composition tab must show a live
  promise adapter, an `HttpClient` adapter with progress, `await completion(id)`, `mutateResource.mutate()` and a
  `queryResource`-backed list; every snippet is copyable from `app-demo-playground`.
- Unit/state tests: validation rejection, enqueue order, chunk numbering, out-of-order acknowledgement, `onProgress`
  byte clamping and failure reset, progress aggregation, combine/processing transition, cancellation from queued,
  uploading and processing, retry of each failed phase (initiate, unacknowledged chunks, combine, poll), auto-retry of
  retryable errors and exhaustion, stale callback identity, remove/clear including exhausted errors, owner reset/disable
  cancellation, shared-panel minimize/restore, repeated mount/disposal, and CVA write/reset/disabled/touched.
- Panel behavior tests: close with active items shows the confirmation, "keep in background" preserves progress and
  closes to the badge, "cancel all" cancels every non-terminal item, idle close clears terminal items, batch actions
  match their per-item rules, success summary collapses and re-expands without hiding failed rows, and the panel
  survives host teardown while the queue holds items.
- Completion tests: resolve with the terminal snapshot on success, reject with `UploadError` or `AbortError`, unknown
  id, removal while pending, one shared outcome for multiple awaiters, and a fresh promise after `retry(id)`.
- Type tests for `UploadAdapter`, `UploadChunkRequest`, `UploadStatusResult`, `UploadItem` and the `readonly File[]`
  control value.
- Browser E2E with controlled network fixtures: multi-file selection, failure then success, cancel during upload,
  minimize/navigate/restore, close-to-background with active items, batch retry and cancel-all, keyboard-only operation
  in Chromium, Firefox and WebKit.
- Localization: complete all dictionaries, run `pnpm run i18n:check`, verify runtime switching and long-label layouts;
  record human language approval separately.
- Validation commands after implementation: `pnpm run test:clr`, `pnpm run test:ngx`, `pnpm run build:clr`,
  `pnpm run build:demo`, `pnpm run i18n:check`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run verify:packages`,
  `pnpm run bundle:check`, `pnpm run e2e`, and finally `pnpm run validate`. No suite has been run for this draft.

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

Implementation is tracked in PR #250 and its follow-up; the revised panel behavior in this section supersedes the PR
#243 wording above wherever they differ.

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
