import {isPlatformBrowser} from '@angular/common';
import {computed, DestroyRef, inject, Injectable, isDevMode, PLATFORM_ID, signal, type Signal} from '@angular/core';

import {
  type UploadAggregate,
  type UploadAdapter,
  type UploadError,
  type UploadItem,
  type UploadQueueDebugApi,
  type UploadQueueDebugSnapshot,
  type UploadQueueOptions,
  type UploadStatusResult,
} from './upload.models';

type Phase = UploadError['phase'];

interface Deferred {
  resolve(item: UploadItem): void;
  reject(error: unknown): void;
}

type Settlement =
  {readonly kind: 'success'} | {readonly kind: 'error'; readonly error: UploadError} | {readonly kind: 'cancelled'};

interface Runtime {
  readonly id: string;
  readonly file: File;
  readonly adapter: UploadAdapter;
  readonly options: UploadQueueOptions;
  controller: AbortController;
  readonly acknowledged: Set<number>;
  readonly inFlight: Map<number, number>;
  acknowledgedBytes: number;
  processingProgress: number;
  uploadId?: string;
  combined: boolean;
  resume?: Phase;
  phase: Phase;
  retries: number;
  timer?: ReturnType<typeof setTimeout>;
  deferreds: Deferred[];
  settlement?: Settlement;
}

function abortError(): DOMException {
  return new DOMException('Upload cancelled', 'AbortError');
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeOptions(options: UploadQueueOptions): UploadQueueOptions {
  return {
    adapter: options.adapter,
    chunkSize: Number.isFinite(options.chunkSize) ? Math.max(1, Math.floor(options.chunkSize)) : 1,
    concurrency: clamp(Math.floor(options.concurrency) || 1, 1, 4),
    autoRetry: options.autoRetry === true,
    maxRetries: clamp(Math.floor(options.maxRetries) || 0, 0, 10),
    pollIntervalMs: Math.max(1000, Number.isFinite(options.pollIntervalMs) ? options.pollIntervalMs : 1000),
  };
}

function toUploadError(error: unknown, phase: Phase): UploadError {
  if (error && typeof error === 'object' && 'code' in error && 'phase' in error) {
    const candidate = error as Partial<UploadError>;
    if (typeof candidate.code === 'string') {
      return {
        code: candidate.code,
        message: candidate.message,
        phase: candidate.phase ?? phase,
        retryable: candidate.retryable,
        fileName: candidate.fileName,
      };
    }
  }
  return {
    code: 'upload.error.unknown',
    message: error instanceof Error ? error.message : String(error),
    phase,
  };
}

/** Root-scoped, transport-agnostic state machine for chunked uploads.
 *
 * Owns the lifecycle of each queued file, exposes immutable item snapshots, and settles
 * `completion(id)` when an item reaches a terminal state.
 */
@Injectable({providedIn: 'root'})
export class UploadQueueService {
  private readonly state = signal<readonly UploadItem[]>([]);
  private readonly minimizedState = signal(false);
  private readonly runtimes = new Map<string, Runtime>();
  private sequence = 0;
  private pumping = false;

  readonly items: Signal<readonly UploadItem[]> = this.state.asReadonly();
  readonly minimized: Signal<boolean> = this.minimizedState.asReadonly();
  readonly aggregate: Signal<UploadAggregate> = computed(() => {
    const items = this.state();
    const active = items.filter(
      (item) => item.status === 'queued' || item.status === 'uploading' || item.status === 'processing',
    );
    const progress = items.length ? Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length) : 0;
    return {total: items.length, active: active.length, progress};
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.dispose();
      if (typeof window !== 'undefined' && window.__uploadQueue?.owner === this) delete window.__uploadQueue;
    });
    if (isDevMode() && isPlatformBrowser(inject(PLATFORM_ID))) this.installDebugApi();
  }

  /** Dev-mode console handle: `window.__uploadQueue.snapshot()` for queue + runtime state. */
  private installDebugApi(): void {
    if (typeof window === 'undefined' || window.__uploadQueue) return;
    const api: UploadQueueDebugApi = {
      owner: this,
      snapshot: () => this.debugSnapshot(),
      items: () => this.debugSnapshot().items,
      aggregate: () => this.aggregate(),
    };
    window.__uploadQueue = api;
  }

  private debugSnapshot(): UploadQueueDebugSnapshot {
    const items = this.state();
    return {
      aggregate: this.aggregate(),
      minimized: this.minimized(),
      items: items.map((item) => ({
        id: item.id,
        name: item.file.name,
        size: item.file.size,
        status: item.status,
        progress: item.progress,
        uploadedBytes: item.uploadedBytes,
        attempt: item.attempt,
        ...(item.uploadId ? {uploadId: item.uploadId} : {}),
        ...(item.error ? {error: item.error} : {}),
      })),
      runtimes: [...this.runtimes.values()].map((runtime) => ({
        id: runtime.id,
        phase: runtime.phase,
        ...(runtime.uploadId ? {uploadId: runtime.uploadId} : {}),
        retries: runtime.retries,
        acknowledgedChunks: runtime.acknowledged.size,
        inFlightChunks: runtime.inFlight.size,
        acknowledgedBytes: runtime.acknowledgedBytes,
        totalChunks: this.totalChunks(runtime),
        options: {
          chunkSize: runtime.options.chunkSize,
          concurrency: runtime.options.concurrency,
          autoRetry: runtime.options.autoRetry,
          maxRetries: runtime.options.maxRetries,
          pollIntervalMs: runtime.options.pollIntervalMs,
        },
      })),
    };
  }

  /** Adds files to the root queue and starts the transport; returns their initial immutable snapshots. */
  enqueue(files: readonly File[], options: UploadQueueOptions): readonly UploadItem[] {
    const created: UploadItem[] = [];
    for (const file of files) {
      const id = `upload-${++this.sequence}`;
      const runtime: Runtime = {
        id,
        file,
        adapter: options.adapter,
        options: normalizeOptions(options),
        controller: new AbortController(),
        acknowledged: new Set(),
        inFlight: new Map(),
        acknowledgedBytes: 0,
        processingProgress: 100,
        combined: false,
        phase: 'initiate',
        retries: 0,
        deferreds: [],
      };
      this.runtimes.set(id, runtime);
      created.push({id, file, status: 'queued', progress: 0, uploadedBytes: 0, attempt: 1});
    }
    this.state.update((items) => [...items, ...created]);
    queueMicrotask(() => void this.pump());
    return created;
  }

  /** Resolves with the terminal item, or rejects with the upload/abort error; rejects for an unknown id. */
  completion(id: string): Promise<UploadItem> {
    const runtime = this.runtimes.get(id);
    if (!runtime) {
      const error = new Error(`Upload item ${id} was not found`);
      error.name = 'UploadItemNotFoundError';
      return Promise.reject(error);
    }
    if (runtime.settlement?.kind === 'success') {
      return Promise.resolve(this.item(id)!);
    }
    if (runtime.settlement?.kind === 'error') {
      return Promise.reject(runtime.settlement.error);
    }
    if (runtime.settlement?.kind === 'cancelled') {
      return Promise.reject(abortError());
    }
    return new Promise<UploadItem>((resolve, reject) => {
      runtime.deferreds.push({resolve, reject});
    });
  }

  /** Re-runs the failed phase and returns a fresh completion promise when the retry starts. */
  retry(id: string): Promise<UploadItem> | undefined {
    const runtime = this.runtimes.get(id);
    const item = this.item(id);
    if (!runtime || !item || item.status !== 'error') return;
    const resume = item.error?.phase ?? 'chunk';
    runtime.controller = new AbortController();
    runtime.resume = resume === 'chunk' || resume === 'combine' || resume === 'status' ? resume : undefined;
    if (resume === 'initiate') {
      runtime.uploadId = undefined;
      runtime.acknowledged.clear();
      runtime.acknowledgedBytes = 0;
      runtime.combined = false;
    }
    runtime.phase = resume;
    runtime.retries = 0;
    runtime.settlement = undefined;
    runtime.deferreds = [];
    this.patch(id, {status: 'queued', error: undefined, attempt: item.attempt + 1});
    void this.pump();
    return this.completion(id);
  }

  /** Aborts the active transfer and settles it as cancelled; calls the adapter only when an upload id exists. */
  cancel(id: string): void {
    const runtime = this.runtimes.get(id);
    if (!runtime) return;
    const uploadId = runtime.uploadId;
    runtime.controller.abort();
    this.clearTimer(runtime);
    if (runtime.settlement) return;
    runtime.settlement = {kind: 'cancelled'};
    runtime.resume = undefined;
    this.patch(id, {status: 'cancelled'});
    const deferreds = runtime.deferreds;
    runtime.deferreds = [];
    for (const deferred of deferreds) deferred.reject(abortError());
    const finish = (error?: UploadError) => {
      if (error && this.runtimes.get(id) === runtime) this.patch(id, {error});
    };
    if (uploadId) {
      void Promise.resolve()
        .then(() => runtime.adapter.cancel(uploadId))
        .then(
          () => finish(),
          (error) => finish(toUploadError(error, 'cancel')),
        );
    } else {
      finish();
    }
  }

  /** Removes one item from the queue, aborts it if active, and rejects any pending `completion(id)`. */
  remove(id: string): void {
    const runtime = this.runtimes.get(id);
    if (!runtime) return;
    const uploadId = runtime.uploadId;
    const notifyServer = !runtime.settlement && uploadId !== undefined;
    runtime.controller.abort();
    this.clearTimer(runtime);
    this.runtimes.delete(id);
    this.state.update((items) => items.filter((item) => item.id !== id));
    for (const deferred of runtime.deferreds) deferred.reject(abortError());
    runtime.deferreds = [];
    if (notifyServer) void Promise.resolve(runtime.adapter.cancel(uploadId)).catch(() => undefined);
  }

  /** Removes every terminal item (success, cancelled or error) without touching active transfers. */
  clearCompleted(): void {
    const completed = this.state().filter(
      (item) => item.status === 'success' || item.status === 'cancelled' || item.status === 'error',
    );
    for (const item of completed) this.remove(item.id);
  }

  /** Docks the shared panel to its badge without cancelling any transfer. */
  minimize(): void {
    this.minimizedState.set(true);
  }

  /** Reopens the shared panel from its minimized badge. */
  restore(): void {
    this.minimizedState.set(false);
  }

  private item(id: string): UploadItem | undefined {
    return this.state().find((item) => item.id === id);
  }

  private patch(id: string, changes: Partial<UploadItem>): void {
    this.state.update((items) => items.map((item) => (item.id === id ? {...item, ...changes} : item)));
  }

  private isCurrent(runtime: Runtime): boolean {
    return (
      this.runtimes.get(runtime.id) === runtime &&
      runtime.settlement === undefined &&
      !runtime.controller.signal.aborted
    );
  }

  private updateProgress(runtime: Runtime): void {
    const item = this.item(runtime.id);
    if (!item || !this.isCurrent(runtime)) return;
    const inFlight = [...runtime.inFlight.values()].reduce((sum, bytes) => sum + bytes, 0);
    const ratio = (runtime.acknowledgedBytes + inFlight) / Math.max(1, runtime.file.size);
    this.patch(runtime.id, {
      progress: clamp(Math.round(ratio * 100), 0, 100),
      uploadedBytes: Math.min(runtime.file.size, runtime.acknowledgedBytes + inFlight),
    });
  }

  private async pump(): Promise<void> {
    if (this.pumping) return;
    this.pumping = true;
    try {
      for (;;) {
        const runtime = [...this.runtimes.values()].find((candidate) => this.item(candidate.id)?.status === 'queued');
        if (!runtime) break;
        await this.process(runtime);
      }
    } finally {
      this.pumping = false;
    }
  }

  private async process(runtime: Runtime): Promise<void> {
    const signal = runtime.controller.signal;
    try {
      if (signal.aborted) throw abortError();
      const resume = runtime.resume;
      if (!resume || resume === 'initiate') {
        runtime.phase = 'initiate';
        this.patch(runtime.id, {status: 'uploading', progress: 0, uploadedBytes: 0, processingProgress: undefined});
      } else if (resume === 'chunk') {
        // Keep acknowledged bytes: a chunk retry resumes the same upload in place.
        this.patch(runtime.id, {status: 'uploading'});
      } else if (resume === 'status') {
        this.patch(runtime.id, {status: 'processing'});
      }
      if (!runtime.uploadId && resume !== 'chunk' && resume !== 'combine' && resume !== 'status') {
        const initiating = runtime.adapter.initiate(runtime.file).then((result) => {
          // Initiation has no transport signal. Clean up a late session after cancel/remove/dispose.
          if (signal.aborted) {
            void Promise.resolve()
              .then(() => runtime.adapter.cancel(result.uploadId))
              .catch((error) => {
                if (this.runtimes.get(runtime.id) === runtime)
                  this.patch(runtime.id, {error: toUploadError(error, 'cancel')});
              });
          } else {
            // Transfer ownership before yielding again: cancellation must always see this session.
            runtime.uploadId = result.uploadId;
            this.patch(runtime.id, {uploadId: result.uploadId});
          }
          return result;
        });
        await this.withAbort(initiating, signal);
        if (!this.isCurrent(runtime)) throw abortError();
      }
      if (!resume || resume === 'initiate' || resume === 'chunk') {
        await this.uploadChunks(runtime);
        if (!this.isCurrent(runtime)) throw abortError();
      }
      if (!resume || resume === 'initiate' || resume === 'chunk' || resume === 'combine') {
        runtime.phase = 'combine';
        this.patch(runtime.id, {
          status: 'processing',
          progress: runtime.processingProgress,
          uploadedBytes: runtime.file.size,
        });
        if (!runtime.combined) {
          const uploadId = runtime.uploadId;
          if (!uploadId) throw new Error('combine requires a server upload id');
          await this.withAbort(runtime.adapter.combine({uploadId, totalChunks: this.totalChunks(runtime)}), signal);
          if (!this.isCurrent(runtime)) throw abortError();
          runtime.combined = true;
        }
      }
      await this.pollStatus(runtime);
      if (!this.isCurrent(runtime)) throw abortError();
      this.settle(runtime, {kind: 'success'});
    } catch (error) {
      if (!this.isCurrent(runtime) || runtime.settlement) return;
      if (isAbort(error)) {
        this.settle(runtime, {kind: 'cancelled'});
        return;
      }
      const uploadError = toUploadError(error, runtime.phase);
      this.settle(runtime, {kind: 'error', error: uploadError});
    }
  }

  private totalChunks(runtime: Runtime): number {
    return Math.max(1, Math.ceil(runtime.file.size / runtime.options.chunkSize));
  }

  private async uploadChunks(runtime: Runtime): Promise<void> {
    runtime.phase = 'chunk';
    const uploadId = runtime.uploadId;
    if (!uploadId) throw new Error('chunk upload requires a server upload id');
    const total = this.totalChunks(runtime);
    for (;;) {
      const pending: number[] = [];
      for (let number = 1; number <= total; number += 1) {
        if (!runtime.acknowledged.has(number)) pending.push(number);
      }
      if (!pending.length) return;
      let cursor = 0;
      let failure: unknown;
      const workers = Array.from({length: Math.min(runtime.options.concurrency, pending.length)}, async () => {
        while (cursor < pending.length && !failure && this.isCurrent(runtime)) {
          const number = pending[cursor++];
          try {
            await this.uploadChunk(runtime, uploadId, number, total);
          } catch (error) {
            if (!failure) failure = error;
          }
        }
      });
      await Promise.all(workers);
      if (!failure) return;
      if (isAbort(failure)) throw failure;
      const error = toUploadError(failure, 'chunk');
      if (runtime.options.autoRetry && error.retryable === true && runtime.retries < runtime.options.maxRetries) {
        runtime.retries += 1;
        const item = this.item(runtime.id);
        if (item) this.patch(runtime.id, {attempt: item.attempt + 1});
        continue;
      }
      throw failure;
    }
  }

  private async uploadChunk(runtime: Runtime, uploadId: string, number: number, total: number): Promise<void> {
    const start = (number - 1) * runtime.options.chunkSize;
    const chunk = runtime.file.slice(start, Math.min(start + runtime.options.chunkSize, runtime.file.size));
    const signal = runtime.controller.signal;
    runtime.inFlight.set(number, 0);
    let pending = true;
    try {
      await this.withAbort(
        runtime.adapter.uploadChunk({
          uploadId,
          chunk,
          chunkNumber: number,
          totalChunks: total,
          signal,
          onProgress: (loaded) => {
            if (
              !pending ||
              !runtime.inFlight.has(number) ||
              !this.isCurrent(runtime) ||
              this.item(runtime.id)?.status !== 'uploading'
            )
              return;
            runtime.inFlight.set(number, clamp(loaded, 0, chunk.size));
            this.updateProgress(runtime);
          },
        }),
        signal,
      );
      if (!this.isCurrent(runtime)) throw abortError();
      runtime.inFlight.delete(number);
      runtime.acknowledged.add(number);
      runtime.acknowledgedBytes += chunk.size;
      this.updateProgress(runtime);
    } catch (error) {
      runtime.inFlight.delete(number);
      this.updateProgress(runtime);
      throw error;
    } finally {
      pending = false;
    }
  }

  private async pollStatus(runtime: Runtime): Promise<void> {
    if (!runtime.adapter.getStatus) return;
    runtime.phase = 'status';
    const signal = runtime.controller.signal;
    const uploadId = runtime.uploadId;
    if (!uploadId) throw new Error('status polling requires a server upload id');
    for (;;) {
      if (!this.isCurrent(runtime)) throw abortError();
      const result: UploadStatusResult = await this.withAbort(runtime.adapter.getStatus(uploadId), signal);
      if (!this.isCurrent(runtime)) throw abortError();
      runtime.processingProgress = clamp(Math.round(result.progress), 0, 100);
      this.patch(runtime.id, {progress: runtime.processingProgress, processingProgress: runtime.processingProgress});
      if (result.status === 'success') return;
      if (result.status === 'cancelled') throw abortError();
      if (result.status === 'error') {
        throw {code: 'upload.error.status', phase: 'status', message: 'Server reported a failed upload'};
      }
      await this.delay(runtime.options.pollIntervalMs, runtime);
      if (!this.isCurrent(runtime)) throw abortError();
    }
  }

  private withAbort<T>(work: PromiseLike<T>, signal: AbortSignal): Promise<T> {
    if (signal.aborted) return Promise.reject(abortError());
    return new Promise<T>((resolve, reject) => {
      const onAbort = () => reject(abortError());
      signal.addEventListener('abort', onAbort, {once: true});
      Promise.resolve(work).then(
        (value) => {
          signal.removeEventListener('abort', onAbort);
          resolve(value);
        },
        (error) => {
          signal.removeEventListener('abort', onAbort);
          reject(error);
        },
      );
    });
  }

  private delay(milliseconds: number, runtime: Runtime): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const signal = runtime.controller.signal;
      if (signal.aborted) {
        reject(abortError());
        return;
      }
      const onAbort = () => {
        clearTimeout(runtime.timer);
        reject(abortError());
      };
      runtime.timer = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      }, milliseconds);
      signal.addEventListener('abort', onAbort, {once: true});
    });
  }

  private clearTimer(runtime: Runtime): void {
    if (runtime.timer !== undefined) clearTimeout(runtime.timer);
    runtime.timer = undefined;
  }

  private settle(runtime: Runtime, settlement: Settlement): void {
    runtime.settlement = settlement;
    runtime.resume = undefined;
    const deferreds = runtime.deferreds;
    runtime.deferreds = [];
    if (settlement.kind === 'success') {
      this.patch(runtime.id, {
        status: 'success',
        progress: 100,
        uploadedBytes: runtime.file.size,
        error: undefined,
      });
      const finished = this.item(runtime.id);
      if (finished) for (const deferred of deferreds) deferred.resolve(finished);
      return;
    }
    if (settlement.kind === 'cancelled') {
      this.patch(runtime.id, {status: 'cancelled'});
      for (const deferred of deferreds) deferred.reject(abortError());
      return;
    }
    this.patch(runtime.id, {status: 'error', error: settlement.error});
    for (const deferred of deferreds) deferred.reject(settlement.error);
  }

  private dispose(): void {
    for (const runtime of this.runtimes.values()) {
      runtime.controller.abort();
      this.clearTimer(runtime);
      if (!runtime.settlement) this.settle(runtime, {kind: 'cancelled'});
    }
  }
}
