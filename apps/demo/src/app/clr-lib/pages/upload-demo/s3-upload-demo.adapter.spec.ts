import {provideHttpClient, HttpClient} from '@angular/common/http';
import {provideHttpClientTesting, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {createS3DemoAdapter} from './s3-upload-demo.adapter';

describe('S3 demo adapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('hashes and sends the queue blob with the original MIME type, including after a failed PUT', async () => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    const http = TestBed.inject(HttpClient);
    const requests = TestBed.inject(HttpTestingController);
    const digest = vi.fn(async () => new Uint8Array([1, 2]).buffer);
    vi.stubGlobal('crypto', {randomUUID: () => 'session', subtle: {digest}});
    const source = new File(['payload'], 'readme.txt', {type: 'text/plain'});
    // Only the queue blob is needed for transport or retry.
    const sourceRead = vi.fn(() => Promise.reject(new Error('Original file should not be read')));
    Object.defineProperty(source, 'arrayBuffer', {value: sourceRead});
    const bytes = new Uint8Array([112, 97, 121, 108, 111, 97, 100]).buffer;
    const chunk = new Blob(['payload']);
    Object.defineProperty(chunk, 'arrayBuffer', {value: async () => bytes});
    const stored = vi.fn();
    const adapter = createS3DemoAdapter(http, {bucket: 'bucket', prefix: '', overwrite: false}, stored);
    const {uploadId} = await adapter.initiate(source);
    const request = {
      uploadId,
      chunk,
      chunkNumber: 1,
      totalChunks: 1,
      signal: new AbortController().signal,
      onProgress: vi.fn(),
    };

    const failed = adapter.uploadChunk(request).catch((error: unknown) => error);
    await vi.waitFor(() => expect(digest).toHaveBeenCalledTimes(1));
    const first = requests.expectOne('/api/s3/bucket/readme.txt');
    expect(first.request.body).toBe(chunk);
    expect(first.request.headers.get('Content-Type')).toBe('text/plain');
    expect(first.request.headers.get('x-amz-content-sha256')).toBe('0102');
    first.flush('', {status: 503, statusText: 'Unavailable'});
    expect(await failed).toMatchObject({code: 's3.putFailed', retryable: true});

    const retry = adapter.uploadChunk(request);
    await vi.waitFor(() => expect(digest).toHaveBeenCalledTimes(2));
    const second = requests.expectOne('/api/s3/bucket/readme.txt');
    expect(second.request.body).toBe(chunk);
    second.flush('');
    await retry;
    await adapter.combine({uploadId, totalChunks: 1});
    expect(digest).toHaveBeenCalledWith('SHA-256', bytes);
    expect(sourceRead).not.toHaveBeenCalled();
    expect(stored).toHaveBeenCalledExactlyOnceWith('/api/s3/bucket/readme.txt');
    requests.verify();
  });
});
