/** Lifecycle state of one queued file. */
export type UploadStatus = 'queued' | 'uploading' | 'processing' | 'success' | 'error' | 'cancelled';

/** A transport-agnostic failure from one upload phase. */
export interface UploadError {
  readonly code: string;
  readonly message?: string;
  readonly phase: 'validation' | 'initiate' | 'chunk' | 'combine' | 'status' | 'cancel';
  readonly retryable?: boolean;
  readonly fileName?: string;
}

/** Optional server-side task progress reported during processing. */
export interface UploadStatusResult {
  readonly status: Extract<UploadStatus, 'processing' | 'success' | 'error' | 'cancelled'>;
  readonly progress: number;
}

/** Immutable view of one file in the queue. */
export interface UploadItem {
  readonly id: string;
  readonly file: File;
  readonly status: UploadStatus;
  readonly progress: number;
  readonly uploadedBytes: number;
  readonly attempt: number;
  readonly uploadId?: string;
  readonly error?: UploadError;
}

/** One chunk request handed to the transport adapter. */
export interface UploadChunkRequest {
  readonly uploadId: string;
  readonly chunk: Blob;
  readonly chunkNumber: number;
  readonly totalChunks: number;
  readonly signal: AbortSignal;
  onProgress(loadedBytes: number): void;
}

/** Consumer-supplied transport for one upload lifecycle. */
export interface UploadAdapter {
  initiate(file: File): Promise<{uploadId: string}>;
  uploadChunk(request: UploadChunkRequest): Promise<void>;
  combine(request: {uploadId: string; totalChunks: number}): Promise<void>;
  cancel(uploadId: string): Promise<void>;
  getStatus?(uploadId: string): Promise<UploadStatusResult>;
}

/** Chunk size presets observed in downstream chunked upload services. */
export const UPLOAD_CHUNK_5MB = 5 * 1024 * 1024;
export const UPLOAD_CHUNK_25MB = 25 * 1024 * 1024;

/** Options for one enqueue call. */
export interface UploadQueueOptions {
  readonly adapter: UploadAdapter;
  readonly chunkSize: number;
  readonly concurrency: number;
  readonly autoRetry: boolean;
  readonly maxRetries: number;
  readonly pollIntervalMs: number;
}

/** Aggregate view of the whole queue. */
export interface UploadAggregate {
  readonly total: number;
  readonly active: number;
  readonly progress: number;
}

/** Plain-object debug snapshot; excludes `File` and adapter references so it can be logged. */
export interface UploadQueueDebugSnapshot {
  readonly aggregate: UploadAggregate;
  readonly minimized: boolean;
  readonly items: readonly {
    readonly id: string;
    readonly name: string;
    readonly size: number;
    readonly status: UploadStatus;
    readonly progress: number;
    readonly uploadedBytes: number;
    readonly attempt: number;
    readonly uploadId?: string;
    readonly error?: UploadError;
  }[];
  readonly runtimes: readonly {
    readonly id: string;
    readonly phase: Phase;
    readonly uploadId?: string;
    readonly retries: number;
    readonly acknowledgedChunks: number;
    readonly inFlightChunks: number;
    readonly acknowledgedBytes: number;
    readonly totalChunks: number;
    readonly options: Omit<UploadQueueOptions, 'adapter'>;
  }[];
}

/** Dev-only console handle installed as `window.__uploadQueue` when `isDevMode()` is true. */
export interface UploadQueueDebugApi {
  /** Internal: identifies the owning service instance for cleanup. */
  readonly owner: unknown;
  snapshot(): UploadQueueDebugSnapshot;
  items(): UploadQueueDebugSnapshot['items'];
  aggregate(): UploadAggregate;
}

type Phase = UploadError['phase'];

declare global {
  interface Window {
    /** Dev-only; undefined in production and on the server. */
    __uploadQueue?: UploadQueueDebugApi;
  }
}
