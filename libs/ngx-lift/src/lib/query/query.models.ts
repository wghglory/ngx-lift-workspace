export type QueryKeyValue =
  string | number | boolean | null | readonly QueryKeyValue[] | {readonly [key: string]: QueryKeyValue};

/** Include every parameter and authorization scope that can change the response. */
export type QueryKey = readonly QueryKeyValue[];

export interface QueryTag {
  readonly type: string;
  readonly id?: string | number;
  /** Omitted means the unscoped namespace, not every tenant scope. */
  readonly scope?: string;
}

export interface QueryLoaderContext {
  readonly abortSignal: AbortSignal;
  /** Forward this to dependent queries when a refresh must bypass completed data. */
  readonly refresh: boolean;
}

/** Definitions sharing a key describe the same data; timing policies reconcile conservatively. */
export interface QueryDefinition<T> {
  readonly key: QueryKey;
  readonly loader: (context: QueryLoaderContext) => Promise<T>;
  readonly tags?: readonly QueryTag[];
  /** Freshness starts after a successful response. The default is zero. */
  readonly staleTime?: number;
  /** Retention after the last use, independent of freshness. The default is five minutes. */
  readonly gcTime?: number;
  /** Opt in for component-owned composite queries; finite shared API reads finish by default. */
  readonly cancelOnNoObservers?: boolean;
}

export type QueryStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';

export interface QuerySnapshot<T> {
  readonly value: T | undefined;
  /** Distinguishes a successful undefined result from the absence of successful data. */
  readonly hasValue: boolean;
  readonly error: unknown | null;
  readonly status: QueryStatus;
  readonly updatedAt: number | null;
  readonly isStale: boolean;
}

export interface QueryFetchOptions {
  /** Bypass fresh completed data, while still joining the current pending request. */
  readonly refresh?: boolean;
}

export interface QueryObserverOptions extends QueryFetchOptions {
  /** Milliseconds between completed requests; omitted means no polling. */
  readonly pollInterval?: number;
}

export interface QueryObserverHandle {
  (): void;
  isAttached(): boolean;
  /** Update the loader and register tags for the same key without changing request state. */
  updateDefinition<T>(definition: QueryDefinition<T>): void;
  /** Change scheduling without detaching the observer or implicitly refetching stale data. */
  updateOptions(options: QueryObserverOptions): void;
}

export interface QueryClientOptions {
  readonly now?: () => number;
  readonly isVisible?: () => boolean;
  readonly subscribeVisibility?: (listener: () => void) => () => void;
  /** Active observers and finite pending requests are protected from capacity eviction. */
  readonly maxEntries?: number;
}
