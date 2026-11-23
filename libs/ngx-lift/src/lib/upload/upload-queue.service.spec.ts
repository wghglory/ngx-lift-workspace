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

describe('UploadQueueService dev-only debug export', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    delete window.__uploadQueue;
  });

  it('exposes a live queue + runtime snapshot on window.__uploadQueue', () => {
    const queue = TestBed.inject(UploadQueueService);
    const api = window.__uploadQueue;
    expect(api).toBeDefined();

    queue.enqueue([uploadFile('bundle.zip', 5)], options(stubDebugAdapter()));
    const snapshot = api!.snapshot();
    expect(snapshot.items).toMatchObject([{name: 'bundle.zip', status: 'queued', size: 5}]);
    expect(snapshot.runtimes[0]).toMatchObject({
      phase: 'initiate',
      acknowledgedChunks: 0,
      totalChunks: 3,
      options: {chunkSize: 2, concurrency: 1},
    });
    expect(api!.aggregate().total).toBe(1);
  });

  it('removes the global handle when its owning queue is destroyed', () => {
    const queue = TestBed.inject(UploadQueueService);
    const handle = window.__uploadQueue;
    expect(handle).toBeDefined();
    TestBed.resetTestingModule();
    expect(window.__uploadQueue).toBeUndefined();
    expect(queue).toBeDefined();
  });
});

function stubDebugAdapter(): UploadAdapter {
  return {
    initiate: async () => ({uploadId: 'debug-1'}),
    uploadChunk: async () => undefined,
    combine: async () => undefined,
    cancel: async () => undefined,
  };
}

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

  it('rejects existing completion immediately while remote cancellation is pending', async () => {
    const cleanup = deferred<void>();
    const adapter = {
      ...stubDebugAdapter(),
      uploadChunk: () => new Promise<void>(() => undefined),
      cancel: () => cleanup.promise,
    };
    const [item] = queue.enqueue([uploadFile('cancel.zip', 4)], options(adapter));
    await flush();
    let outcome = 'pending';
    void queue.completion(item.id).catch((error: DOMException) => {
      outcome = error.name;
    });
    queue.cancel(item.id);
    await flush();
    expect(outcome).toBe('AbortError');
    expect(queue.items()[0].status).toBe('cancelled');
    cleanup.resolve();
    await flush();
  });

  it.each(['cancel', 'remove'] as const)('cleans up an initiation resolving after %s', async (action) => {
    const initiation = deferred<{uploadId: string}>();
    const cancel = vi.fn(async () => undefined);
    const chunk = vi.fn(async () => undefined);
    const [item] = queue.enqueue(
      [uploadFile('late.zip', 4)],
      options({
        ...stubDebugAdapter(),
        initiate: () => initiation.promise,
        uploadChunk: chunk,
        cancel,
      }),
    );
    await flush();
    queue[action](item.id);
    initiation.resolve({uploadId: 'late-session'});
    await flush();
    expect(cancel).toHaveBeenCalledExactlyOnceWith('late-session');
    expect(chunk).not.toHaveBeenCalled();
  });

  it.each(['cancel', 'remove'] as const)('owns the session when %s races the initiate continuation', async (action) => {
    const initiation = deferred<{uploadId: string}>();
    const cancel = vi.fn(async () => undefined);
    const chunk = vi.fn(async () => undefined);
    const [item] = queue.enqueue(
      [uploadFile('race.zip', 4)],
      options({
        ...stubDebugAdapter(),
        initiate: () => initiation.promise,
        uploadChunk: chunk,
        cancel,
      }),
    );
    await flush();
    initiation.resolve({uploadId: 'racing-session'});
    queueMicrotask(() => queue[action](item.id));
    await flush();
    expect(cancel).toHaveBeenCalledExactlyOnceWith('racing-session');
    expect(chunk).not.toHaveBeenCalled();
  });

  it.each(['cancel', 'remove'] as const)(
    'does not combine when %s races the final chunk continuation',
    async (action) => {
      let id = '';
      let statusAtCancellation: string | undefined;
      const combine = vi.fn(async () => undefined);
      const cancelLater = (remaining: number): void => {
        queueMicrotask(() => {
          if (remaining) cancelLater(remaining - 1);
          else {
            statusAtCancellation = queue.items()[0]?.status;
            queue[action](id);
          }
        });
      };
      [id] = queue
        .enqueue(
          [uploadFile('boundary.zip', 2)],
          options({
            ...stubDebugAdapter(),
            uploadChunk: async () => {
              cancelLater(5);
            },
            combine,
          }),
        )
        .map((item) => item.id);
      await flush();
      expect(statusAtCancellation).toBe('uploading');
      expect(combine).not.toHaveBeenCalled();
      expect(queue.items()[0]?.status).toBe(action === 'cancel' ? 'cancelled' : undefined);
    },
  );

  it('settles active and waiting uploads when the injector is destroyed', async () => {
    const initiate = vi.fn(async () => ({uploadId: 'destroyed-session'}));
    const items = queue.enqueue(
      [uploadFile('active.zip', 2), uploadFile('waiting.zip', 2)],
      options({
        ...stubDebugAdapter(),
        initiate,
        uploadChunk: () => new Promise<void>(() => undefined),
      }),
    );
    await flush();
    const outcomes = items.map((item) => queue.completion(item.id).catch((error: DOMException) => error.name));
    TestBed.resetTestingModule();
    try {
      // Assert before yielding; cleanup also keeps the broken version from spinning forever in this regression.
      expect(queue.items().map((item) => item.status)).toEqual(['cancelled', 'cancelled']);
      expect(await Promise.all(outcomes)).toEqual(['AbortError', 'AbortError']);
      await flush();
      expect(initiate).toHaveBeenCalledTimes(1);
    } finally {
      for (const item of items) queue.remove(item.id);
    }
  });

  it.each(['chunk', 'combine', 'status'] as const)(
    'cancels the server session during teardown in %s',
    async (phase) => {
      const pending = new Promise<never>(() => undefined);
      const cancel = vi.fn(async () => undefined);
      const [item] = queue.enqueue(
        [uploadFile('active.zip', 2)],
        options({
          ...stubDebugAdapter(),
          uploadChunk: async () => (phase === 'chunk' ? pending : undefined),
          combine: async () => (phase === 'combine' ? pending : undefined),
          getStatus: async () => pending,
          cancel,
        }),
      );
      await flush();
      const outcome = queue.completion(item.id).catch((error: DOMException) => error.name);
      TestBed.resetTestingModule();
      expect(await outcome).toBe('AbortError');
      await flush();
      expect(cancel).toHaveBeenCalledExactlyOnceWith('debug-1');
    },
  );

  it('cleans up an initiation resolving after injector teardown', async () => {
    const initiation = deferred<{uploadId: string}>();
    const cancel = vi.fn(async () => undefined);
    const chunk = vi.fn(async () => undefined);
    const [item] = queue.enqueue(
      [uploadFile('late.zip', 2)],
      options({
        ...stubDebugAdapter(),
        initiate: () => initiation.promise,
        uploadChunk: chunk,
        cancel,
      }),
    );
    await flush();
    const outcome = queue.completion(item.id).catch((error: DOMException) => error.name);
    TestBed.resetTestingModule();
    expect(await outcome).toBe('AbortError');
    initiation.resolve({uploadId: 'late-destroyed-session'});
    await flush();
    expect(cancel).toHaveBeenCalledExactlyOnceWith('late-destroyed-session');
    expect(chunk).not.toHaveBeenCalled();
  });

  it('keeps teardown terminal when server cancellation rejects', async () => {
    const [item] = queue.enqueue(
      [uploadFile('active.zip', 2)],
      options({
        ...stubDebugAdapter(),
        uploadChunk: () => new Promise<void>(() => undefined),
        cancel: async () => {
          throw new Error('Cleanup failed');
        },
      }),
    );
    await flush();
    TestBed.resetTestingModule();
    await flush();
    expect(queue.items()[0]).toMatchObject({status: 'cancelled', error: {phase: 'cancel', message: 'Cleanup failed'}});
    await expect(queue.completion(item.id)).rejects.toMatchObject({name: 'AbortError'});
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

  it('ignores stale adapter progress callbacks after the item is cancelled', async () => {
    let deliverProgress!: (loaded: number) => void;
    const chunk = deferred<void>();
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async (request: UploadChunkRequest) => {
        deliverProgress = request.onProgress;
        return chunk.promise;
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 3)], options(adapter));
    const completion = queue.completion(item.id);
    await flush();

    deliverProgress(1);
    await flush();
    expect(queue.items()[0].uploadedBytes).toBe(1);

    queue.cancel(item.id);
    await expect(completion).rejects.toMatchObject({name: 'AbortError'});
    const bytesAtCancel = queue.items()[0].uploadedBytes;

    deliverProgress(2); // stale callback from the aborted attempt must not move progress
    await flush();
    expect(queue.items()[0].uploadedBytes).toBe(bytesAtCancel);
    chunk.resolve();
  });

  it('settles completion on removal while server cancellation is still pending', async () => {
    const cancellation = deferred<void>();
    const chunk = deferred<void>();
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => chunk.promise,
      combine: async () => undefined,
      cancel: async () => cancellation.promise,
    };
    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    const completion = queue.completion(item.id);
    await flush();

    queue.cancel(item.id);
    queue.clearCompleted();

    await expect(completion).rejects.toMatchObject({name: 'AbortError'});
    expect(queue.items()).toEqual([]);
    cancellation.resolve();
    chunk.resolve();
  });

  it('ignores a chunk that settles after the item was already cancelled', async () => {
    const chunk = deferred<void>();
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => chunk.promise,
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 3)], options(adapter));
    const completion = queue.completion(item.id);
    await flush();

    queue.cancel(item.id);
    await expect(completion).rejects.toMatchObject({name: 'AbortError'});
    expect(queue.items()[0].status).toBe('cancelled');

    chunk.resolve(); // the aborted chunk later reports success
    await flush();
    expect(queue.items()[0].status).toBe('cancelled');
    expect(queue.items()[0].progress).toBeLessThan(100);
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

  it('keeps a chunk retry uploading with acknowledged progress', async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    let calls = 0;
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'resume'}),
      uploadChunk: async (request) => {
        calls += 1;
        request.onProgress(request.chunk.size);
        if (calls === 2) throw {code: 'chunk-failed', phase: 'chunk'};
        if (calls === 4) await gate;
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };
    const queue = TestBed.inject(UploadQueueService);
    const [item] = queue.enqueue([uploadFile('bundle.zip', 6)], options(adapter));
    await expect(queue.completion(item.id)).rejects.toMatchObject({code: 'chunk-failed'});

    queue.retry(item.id);
    await flush();

    expect(queue.items()[0].status).toBe('uploading');
    expect(queue.items()[0].uploadedBytes).toBe(6);

    release();
    await expect(queue.completion(item.id)).resolves.toMatchObject({status: 'success'});
  });

  it.each([false, true])('ignores stale chunk progress after retry (autoRetry: %s)', async (autoRetry) => {
    let staleProgress: ((loaded: number) => void) | undefined;
    const retryGate = deferred<void>();
    let calls = 0;
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async (request) => {
        calls += 1;
        if (calls === 1) {
          staleProgress = request.onProgress;
          throw {code: 'chunk-failed', phase: 'chunk', retryable: true};
        }
        return retryGate.promise;
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };
    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter, {autoRetry, maxRetries: 1}));
    let completion = queue.completion(item.id);
    if (!autoRetry) {
      await expect(completion).rejects.toMatchObject({phase: 'chunk'});
      completion = queue.retry(item.id)!;
    }
    await flush();

    staleProgress?.(2);

    expect(queue.items()[0]).toMatchObject({status: 'uploading', uploadedBytes: 0, progress: 0});
    retryGate.resolve();
    await expect(completion).resolves.toMatchObject({status: 'success'});
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
    await flush();
    expect(getStatus).toHaveBeenCalledTimes(1);
    expect(queue.items()[0].progress).toBe(40);
    await vi.advanceTimersByTimeAsync(1000);
    await flush();

    expect((await completion).status).toBe('success');
    expect(getStatus).toHaveBeenCalledTimes(2);
  });

  it('retries the failed initiate phase with a fresh upload id', async () => {
    const chunkIds: string[] = [];
    let initiates = 0;
    const adapter: UploadAdapter = {
      initiate: async () => {
        initiates += 1;
        if (initiates === 1) throw {code: 'initiate-failed', phase: 'initiate'};
        return {uploadId: 'u2'};
      },
      uploadChunk: async (request) => {
        chunkIds.push(request.uploadId);
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    await expect(queue.completion(item.id)).rejects.toMatchObject({code: 'initiate-failed', phase: 'initiate'});
    expect(queue.items()[0].uploadId).toBeUndefined();

    queue.retry(item.id);
    const finished = await queue.completion(item.id);

    expect(finished.status).toBe('success');
    expect(finished.uploadId).toBe('u2');
    expect(chunkIds).toEqual(['u2']);
    expect(initiates).toBe(2);
  });

  it('retries the failed status phase by resuming polling', async () => {
    const statuses: {status: 'processing' | 'success' | 'error'; progress: number}[] = [
      {status: 'error', progress: 10},
      {status: 'processing', progress: 50},
      {status: 'success', progress: 100},
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
    const rejection = expect(queue.completion(item.id)).rejects.toMatchObject({
      code: 'upload.error.status',
      phase: 'status',
    });
    await flush();
    await flush();
    await rejection;

    queue.retry(item.id);
    await flush();
    expect(queue.items()[0].progress).toBe(50);
    await vi.advanceTimersByTimeAsync(1000);
    await flush();

    expect((await queue.completion(item.id)).status).toBe('success');
    expect(getStatus).toHaveBeenCalledTimes(3);
  });

  it('keeps status retries in processing without resetting acknowledged bytes', async () => {
    let polls = 0;
    const states: string[] = [];
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      cancel: async () => undefined,
      getStatus: async () => {
        polls += 1;
        if (polls === 1) throw {code: 'status-failed', phase: 'status'};
        const current = queue.items()[0];
        states.push(`${current.status}:${current.uploadedBytes}:${current.progress}`);
        return {status: 'success', progress: 100};
      },
    };
    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    await expect(queue.completion(item.id)).rejects.toMatchObject({phase: 'status'});

    await expect(queue.retry(item.id)).resolves.toMatchObject({status: 'success'});

    expect(states).toEqual(['processing:2:100']);
  });

  it('leaves exhausted auto-retries in error and manual retry recovers', async () => {
    let calls = 0;
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => {
        calls += 1;
        if (calls <= 3) throw {code: 'transient', phase: 'chunk', retryable: true};
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter, {autoRetry: true, maxRetries: 2}));
    await expect(queue.completion(item.id)).rejects.toMatchObject({code: 'transient', phase: 'chunk'});
    expect(queue.items().find((candidate) => candidate.id === item.id)?.status).toBe('error');

    queue.retry(item.id);
    const finished = await queue.completion(item.id);

    expect(finished.status).toBe('success');
    expect(calls).toBe(4);
  });

  it('increments the attempt counter on each retry', async () => {
    let calls = 0;
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => {
        calls += 1;
        if (calls < 3) throw {code: 'transient', phase: 'chunk', retryable: true};
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter, {autoRetry: true, maxRetries: 5}));
    const finished = await queue.completion(item.id);

    expect(finished.attempt).toBe(3);
  });

  it('still ends cancelled when the adapter cancel fails and reports the cancel error', async () => {
    const chunk = deferred<void>();
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => chunk.promise,
      combine: async () => undefined,
      cancel: async () => {
        throw new Error('server delete failed');
      },
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    const rejection = expect(queue.completion(item.id)).rejects.toMatchObject({name: 'AbortError'});
    await flush();
    queue.cancel(item.id);
    await rejection;
    await flush();

    const settled = queue.items().find((candidate) => candidate.id === item.id)!;
    expect(settled.status).toBe('cancelled');
    expect(settled.error?.phase).toBe('cancel');
    chunk.resolve();
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

  it('accepts out-of-order chunk acknowledgements', async () => {
    const gates = new Map<number, ReturnType<typeof deferred<void>>>();
    const calls: number[] = [];
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async (request) => {
        calls.push(request.chunkNumber);
        const gate = deferred<void>();
        gates.set(request.chunkNumber, gate);
        return gate.promise;
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 6)], options(adapter, {chunkSize: 2, concurrency: 3}));
    const completion = queue.completion(item.id);
    await flush();
    for (const number of [3, 1, 2]) gates.get(number)!.resolve();
    await flush();

    expect((await completion).status).toBe('success');
    expect(calls).toEqual([1, 2, 3]);
  });

  it('clamps in-flight progress to the file size', async () => {
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async (request) => {
        request.onProgress(999);
        request.onProgress(-5);
      },
      combine: async () => undefined,
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    const finished = await queue.completion(item.id);

    expect(finished.uploadedBytes).toBeLessThanOrEqual(2);
    expect(finished.progress).toBe(100);
  });

  it('cancels an item while the optional status poll is pending', async () => {
    const status = deferred<{status: 'processing'; progress: number}>();
    const cancel = vi.fn(async () => undefined);
    const adapter: UploadAdapter = {
      initiate: async () => ({uploadId: 'u1'}),
      uploadChunk: async () => undefined,
      combine: async () => undefined,
      cancel,
      getStatus: async () => status.promise,
    };
    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    const rejection = expect(queue.completion(item.id)).rejects.toMatchObject({name: 'AbortError'});
    await flush();
    await vi.advanceTimersByTimeAsync(1000);
    await flush();

    queue.cancel(item.id);
    await rejection;
    expect(cancel).toHaveBeenCalledWith('u1');
    expect(queue.items()[0].status).toBe('cancelled');
    status.resolve({status: 'processing', progress: 40});
  });

  it('retries only the failed combine phase', async () => {
    let initiates = 0;
    let chunks = 0;
    let combines = 0;
    const adapter: UploadAdapter = {
      initiate: async () => {
        initiates += 1;
        return {uploadId: 'u1'};
      },
      uploadChunk: async () => {
        chunks += 1;
      },
      combine: async () => {
        combines += 1;
        if (combines === 1) throw {code: 'combine-failed', phase: 'combine'};
      },
      cancel: async () => undefined,
    };

    const [item] = queue.enqueue([uploadFile('bundle.zip', 2)], options(adapter));
    await expect(queue.completion(item.id)).rejects.toMatchObject({code: 'combine-failed', phase: 'combine'});
    queue.retry(item.id);
    expect((await queue.completion(item.id)).status).toBe('success');
    expect([initiates, chunks, combines]).toEqual([1, 1, 2]);
  });
});
