import {TestBed} from '@angular/core/testing';
import type {Signal} from '@angular/core';
import {afterEach, beforeEach, describe, expect, expectTypeOf, it} from 'vitest';

import type {
  UploadAdapter,
  UploadAggregate,
  UploadChunkRequest,
  UploadError,
  UploadItem,
  UploadQueueOptions,
  UploadStatus,
  UploadStatusResult,
} from './index';
import {UPLOAD_CHUNK_25MB, UPLOAD_CHUNK_5MB, UploadQueueService} from './index';

describe('upload public contracts', () => {
  let queue: UploadQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    queue = TestBed.inject(UploadQueueService);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('keeps the chunk presets and option types stable', () => {
    const chunk5Mb = 5 * 1024 * 1024;
    const chunk25Mb = 25 * 1024 * 1024;
    expectTypeOf(UPLOAD_CHUNK_5MB).toEqualTypeOf<typeof chunk5Mb>();
    expectTypeOf(UPLOAD_CHUNK_25MB).toEqualTypeOf<typeof chunk25Mb>();

    const options: UploadQueueOptions = {
      adapter: {} as UploadAdapter,
      chunkSize: UPLOAD_CHUNK_25MB,
      concurrency: 2,
      autoRetry: false,
      maxRetries: 3,
      pollIntervalMs: 10_000,
    };
    expectTypeOf(options.adapter).toEqualTypeOf<UploadAdapter>();
    expectTypeOf(options.chunkSize).toEqualTypeOf<number>();
  });

  it('keeps the item lifecycle fields readonly with the approved phase unions', () => {
    expectTypeOf<UploadStatus>().toEqualTypeOf<
      'queued' | 'uploading' | 'processing' | 'success' | 'error' | 'cancelled'
    >();

    const error: UploadError = {code: 'x', phase: 'chunk'};
    expectTypeOf(error.phase).toEqualTypeOf<'validation' | 'initiate' | 'chunk' | 'combine' | 'status' | 'cancel'>();
    expectTypeOf(error.retryable).toEqualTypeOf<boolean | undefined>();
    expectTypeOf(error.serverStatus).toEqualTypeOf<'error' | undefined>();

    const item = {} as UploadItem;
    expectTypeOf(item.id).toEqualTypeOf<string>();
    expectTypeOf(item.file).toEqualTypeOf<File>();
    expectTypeOf(item.status).toEqualTypeOf<UploadStatus>();
    expectTypeOf(item.progress).toEqualTypeOf<number>();
    expectTypeOf(item.uploadedBytes).toEqualTypeOf<number>();
    expectTypeOf(item.attempt).toEqualTypeOf<number>();
    expectTypeOf(item.processingProgress).toEqualTypeOf<number | undefined>();
    expectTypeOf(item.uploadId).toEqualTypeOf<string | undefined>();
    expectTypeOf(item.error).toEqualTypeOf<UploadError | undefined>();
    // @ts-expect-error item snapshots are immutable
    item.status = 'success';
  });

  it('keeps the adapter and chunk request transport shape', () => {
    const adapter = {} as UploadAdapter;
    expectTypeOf(adapter.initiate).parameters.toEqualTypeOf<[File]>();
    expectTypeOf(adapter.initiate).returns.toEqualTypeOf<Promise<{uploadId: string}>>();
    expectTypeOf(adapter.uploadChunk).parameters.toEqualTypeOf<[UploadChunkRequest]>();
    expectTypeOf(adapter.uploadChunk).returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf(adapter.combine).parameters.toEqualTypeOf<[{uploadId: string; totalChunks: number}]>();
    expectTypeOf(adapter.combine).returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf(adapter.cancel).parameters.toEqualTypeOf<[string]>();
    expectTypeOf(adapter.cancel).returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf(adapter.getStatus).toEqualTypeOf<((uploadId: string) => Promise<UploadStatusResult>) | undefined>();

    const request = {} as UploadChunkRequest;
    expectTypeOf(request.uploadId).toEqualTypeOf<string>();
    expectTypeOf(request.chunk).toEqualTypeOf<Blob>();
    expectTypeOf(request.chunkNumber).toEqualTypeOf<number>();
    expectTypeOf(request.totalChunks).toEqualTypeOf<number>();
    expectTypeOf(request.signal).toEqualTypeOf<AbortSignal>();
    expectTypeOf(request.onProgress).toEqualTypeOf<(loadedBytes: number) => void>();

    const status = {} as UploadStatusResult;
    expectTypeOf(status.status).toEqualTypeOf<'processing' | 'success' | 'error' | 'cancelled'>();
    expectTypeOf(status.progress).toEqualTypeOf<number>();
  });

  it('keeps the queue signals and method signatures', () => {
    expectTypeOf(queue.items).toEqualTypeOf<Signal<readonly UploadItem[]>>();
    expectTypeOf(queue.minimized).toEqualTypeOf<Signal<boolean>>();
    expectTypeOf(queue.aggregate).toEqualTypeOf<Signal<UploadAggregate>>();

    const files: readonly File[] = [];
    const items = queue.enqueue(files, {
      adapter: {} as UploadAdapter,
      chunkSize: UPLOAD_CHUNK_25MB,
      concurrency: 2,
      autoRetry: false,
      maxRetries: 3,
      pollIntervalMs: 10_000,
    });
    expectTypeOf(items).toEqualTypeOf<readonly UploadItem[]>();
    const completion: Promise<UploadItem> = queue.completion('id');
    expectTypeOf(completion).toEqualTypeOf<Promise<UploadItem>>();
    completion.catch(() => undefined); // unknown id rejects; the type contract is what this asserts
    expect(queue.minimized()).toBe(false);
  });
});
