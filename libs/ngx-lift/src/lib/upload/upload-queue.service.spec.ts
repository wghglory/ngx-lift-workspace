import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {type UploadAdapter, type UploadChunkRequest, UploadQueueService} from './index';

function uploadFile(name: string, size: number): File {
  return new File([new Uint8Array(size)], name);
}

function deferred<T>(): {promise: Promise<T>; resolve(value: T): void; reject(error: unknown): void} {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

function options(adapter: UploadAdapter, overrides: Partial<Parameters<UploadQueueService['enqueue']>[1]> = {}) {
  return {adapter, chunkSize: 2, concurrency: 1, autoRetry: false, maxRetries: 0, pollIntervalMs: 1000, ...overrides};
}

const flush = () => vi.advanceTimersByTimeAsync(0);

describe('UploadQueueService', () => {
  let queue: UploadQueueService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    queue = TestBed.inject(UploadQueueService);
  });

  afterEach(() => {
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('uploads one file through initiate, ordered chunks and combine, then resolves completion', async () => {
    const calls: string[] = [];
    const adapter: UploadAdapter = {
      initiate: async () => {
        calls.push('initiate');
        return {uploadId: 'u1'};
      },
      uploadChunk: async (request) => {
        calls.push(`chunk:${request.chunkNumber}`);
        request.onProgress(request.chunk.size / 2);
      },
      combine: async () => {
        calls.push('combine');
      },
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 3)], options(adapter));
    expect(item.status).toBe('queued');

    const finished = await queue.completion(item.id);

    expect(calls).toEqual(['initiate', 'chunk:1', 'chunk:2', 'combine']);
    expect(finished.status).toBe('success');
    expect(finished.progress).toBe(100);
    expect(queue.items().find((candidate) => candidate.id === item.id)?.status).toBe('success');
  });

  it('aborts an active chunk, calls adapter cancel with the upload id and rejects completion', async () => {
    const chunk = deferred<void>();
    let seenSignal: AbortSignal | undefined;
    const cancel = vi.fn(async () => undefined);
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async (request: UploadChunkRequest) => {
        seenSignal = request.signal;
        return chunk.promise;
      },
      combine: async () => undefined,
      cancel,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 3)], options(adapter));
    const completion = queue.completion(item.id);
    await flush();
    expect(seenSignal).toBeDefined();

    queue.cancel(item.id);
    await expect(completion).rejects.toMatchObject({name: 'AbortError'});

    expect(seenSignal!.aborted).toBe(true);
    expect(cancel).toHaveBeenCalledWith('u1');
    expect(queue.items()[0].status).toBe('cancelled');
    chunk.resolve();
  });

  it('does not call adapter cancel when a queued item is cancelled', async () => {
    const cancel = vi.fn(async () => undefined);
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      cancel,
    };
    const [first] = queue.enqueue([uploadFile('a.zip', 2)], options(adapter));
    queue.enqueue([uploadFile('b.zip', 2)], options(adapter));
    queue.cancel(first.id);
    await flush();
    expect(cancel).not.toHaveBeenCalled();
    expect(queue.items().find((item) => item.id === first.id)?.status).toBe('cancelled');
  });

  it('retries only unacknowledged chunks and re-arms completion', async () => {
    let attempts = 0;
    const chunkNumbers: number[] = [];
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async (request) => {
        chunkNumbers.push(request.chunkNumber);
        attempts += 1;
        if (request.chunkNumber === 2 && attempts === 2) {
          throw {code: 'chunk-failed', phase: 'chunk'};
        }
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 6)], options(adapter, {chunkSize: 2}));
    await expect(queue.completion(item.id)).rejects.toMatchObject({code: 'chunk-failed', phase: 'chunk'});
    expect(chunkNumbers).toEqual([1, 2]);

    queue.retry(item.id);
    const finished = await queue.completion(item.id);

    expect(chunkNumbers).toEqual([1, 2, 2, 3]);
    expect(finished.status).toBe('success');
  });

  it('auto-retries retryable chunk errors up to the configured limit', async () => {
    let calls = 0;
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => {
        calls += 1;
        if (calls <= 2) throw {code: 'transient', phase: 'chunk', retryable: true};
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter, {autoRetry: true, maxRetries: 2}));
    const finished = await queue.completion(item.id);

    expect(calls).toBe(3);
    expect(finished.status).toBe('success');
  });

  it('polls optional server status and reports its processing progress', async () => {
    const statuses = [
      {status: 'processing' as const, progress: 40},
      {status: 'success' as const, progress: 100},
    ];
    const getStatus = vi.fn(async () => statuses.shift()!);
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      cancel: async () => undefined,
      getStatus,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    const completion = queue.completion(item.id);
    await flush();
    await vi.advanceTimersByTimeAsync(1000);
    await flush();
    expect(queue.items()[0].progress).toBe(40);
    await vi.advanceTimersByTimeAsync(1000);
    await flush();

    expect((await completion).status).toBe('success');
    expect(getStatus).toHaveBeenCalledTimes(2);
  });

  it('settles every awaiter with the same outcome and rejects unknown or removed items', async () => {
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      cancel: async () => undefined,
    };
    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    const first = queue.completion(item.id);
    const second = queue.completion(item.id);

    expect((await first).id).toBe((await second).id);
    await expect(queue.completion('missing')).rejects.toMatchObject({name: 'UploadItemNotFoundError'});

    const [other] = queue.enqueue([uploadFile('other.zip', 2)], options(adapter));
    const pending = queue.completion(other.id);
    queue.remove(other.id);
    await expect(pending).rejects.toMatchObject({name: 'AbortError'});
  });
});
