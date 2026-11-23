import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {type UploadAdapter, type UploadError} from 'ngx-lift';
import {filter, firstValueFrom, fromEvent, takeUntil, tap} from 'rxjs';

/** Immutable destination captured when the application enqueues a batch. */
export interface S3DemoDestination {
  readonly bucket: string;
  readonly prefix: string;
  readonly overwrite: boolean;
}

/**
 * Demo-only whole-object transport for a same-origin authenticated S3 proxy.
 * The caller MUST enqueue with chunkSize >= file.size; this is not S3 multipart.
 * Authentication/signing belongs to the proxy. Never embed permanent S3 credentials here.
 */
export function createS3DemoAdapter(
  http: HttpClient,
  destination: S3DemoDestination,
  onStored: (objectPath: string) => void,
): UploadAdapter {
  const sessions = new Map<string, {contentType: string; url: string}>();
  return {
    initiate: async (file) => {
      const uploadId = crypto.randomUUID();
      // Encode segments independently: slashes separate keys, while spaces, #, %, etc. remain data.
      const prefix = destination.prefix;
      const key = prefix && !prefix.endsWith('/') ? `${prefix}/${file.name}` : `${prefix}${file.name}`;
      const url = '/api/s3/' + [destination.bucket, ...key.split('/')].map(encodeURIComponent).join('/');
      sessions.set(uploadId, {contentType: file.type || 'application/octet-stream', url});
      return {uploadId};
    },
    uploadChunk: async (request) => {
      const session = sessions.get(request.uploadId);
      if (!session) throw new Error('Missing upload session');
      if (request.totalChunks !== 1) throw new Error('Whole-object PUT requires exactly one chunk');
      request.signal.throwIfAborted();
      // Hash in the signal-bearing phase. Web Crypto itself cannot be aborted; do not send after cancellation.
      const bytes = await request.chunk.arrayBuffer();
      request.signal.throwIfAborted();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      request.signal.throwIfAborted();
      const sha256 = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      const headers: Record<string, string> = {
        'Content-Type': session.contentType,
        'x-amz-content-sha256': sha256,
      };
      if (!destination.overwrite) headers['If-None-Match'] = '*';
      try {
        await firstValueFrom(
          http
            .put(session.url, request.chunk, {headers, observe: 'events', reportProgress: true, responseType: 'text'})
            .pipe(
              tap((event) => {
                if (event.type === HttpEventType.UploadProgress) request.onProgress(event.loaded);
              }),
              filter((event) => event.type === HttpEventType.Response),
              // Unsubscribe aborts HttpClient's request. firstValueFrom rejects if abort ends it without a response.
              takeUntil(fromEvent(request.signal, 'abort')),
            ),
        );
      } catch (error) {
        request.signal.throwIfAborted();
        if (!(error instanceof HttpErrorResponse)) throw error;
        // The shared panel localizes the phase; HTTP status is an additional transport diagnostic.
        throw {
          code: error.status === 412 ? 's3.objectExists' : 's3.putFailed',
          phase: 'chunk',
          retryable: error.status === 0 || error.status === 429 || error.status >= 500,
          message: String(error.status),
        } satisfies UploadError;
      }
    },
    combine: async ({uploadId}) => {
      const session = sessions.get(uploadId);
      if (!session) throw new Error('Missing upload session');
      // PUT already committed the object. There is no multipart-completion or task-poll request.
      onStored(session.url);
      sessions.delete(uploadId);
    },
    cancel: async (uploadId) => {
      // AbortSignal stops the local PUT. Do not DELETE an object: the server may already have committed it.
      sessions.delete(uploadId);
    },
  };
}
