import {Observable} from 'rxjs';

/** JSON-compatible values supported in a canonical query key. */
export type QueryKeyValue =
  string | number | boolean | null | readonly QueryKeyValue[] | {readonly [key: string]: QueryKeyValue};

/** Include every parameter and authorization scope that can change the response. */
export type QueryKey = readonly QueryKeyValue[];

/** Invalidation dependency scoped to a resource type and optional entity. */
export interface QueryTag {
  readonly type: string;
  readonly id?: string | number;
  /** Omitted means the unscoped namespace, not every tenant scope. */
  readonly scope?: string;
}

/** Cancellation and freshness context for a shared transport request. */
export interface QueryLoaderContext {
  readonly abortSignal: AbortSignal;
  /** Forward this to dependent queries when a refresh must bypass completed data. */
  readonly refresh: boolean;
}

/** Return type of a query loader: natively accepts an Observable, Promise, or PromiseLike value. */
export type QueryResult<T> = Observable<T> | PromiseLike<T>;

/** Context of the failed attempt; attempts start at one and include the initial read. */
export interface QueryAttemptContext {
  readonly key: QueryKey;
  readonly attempt: number;
  readonly elapsedMs: number;
}

/** Opt-in bounded read retries. Invoke the loader again, never reuse a rejected Promise. */
export interface QueryRetryOptions {
  readonly maxAttempts: number;
  readonly shouldRetry: (error: unknown, context: QueryAttemptContext) => boolean;
  readonly delayMs: number | ((error: unknown, context: QueryAttemptContext) => number);
}

/** Read policy shared by Observable and PromiseLike loaders. Both options are disabled by default. */
export interface QueryReadPolicy {
  readonly retry?: false | QueryRetryOptions;
  /** Total elapsed-time budget for the logical read, including retry waits. */
  readonly deadlineMs?: number | false;
}

/** Progress of the current logical read, not a separate retry per observer. */
export interface QueryRetryState {
  readonly failureCount: number;
  readonly failureReason: unknown | null;
  /** Wall-clock timestamp of the next retry; null while fetching or after settlement. */
  readonly nextRetryAt: number | null;
}

export type QueryRequestTrigger = 'initial' | 'manual' | 'poll' | 'invalidation' | 'focus' | 'reconnect';

/** One terminal failure event for a current shared logical read. */
export interface QueryErrorContext {
  readonly key: QueryKey;
  readonly attemptCount: number;
  readonly hasValue: boolean;
  readonly trigger: QueryRequestTrigger;
}

/** Application callback failures, reported independently of transport outcomes. */
export interface QueryDiagnosticContext {
  readonly key: QueryKey;
  readonly phase: 'observer' | 'retry-policy' | 'error-reporter';
}

/** Definitions sharing a key describe the same data; timing policies reconcile conservatively. */
export interface QueryDefinition<T> extends QueryReadPolicy {
  readonly key: QueryKey;
  readonly loader: (context: QueryLoaderContext) => QueryResult<T>;
  readonly tags?: readonly QueryTag[];
  /** Freshness starts after a successful response. The default is zero. */
  readonly staleTime?: number;
  /** Retention after the last use, independent of freshness. The default is five minutes. */
  readonly gcTime?: number;
  /** Opt in for component-owned composite queries; finite shared API reads finish by default. */
  readonly cancelOnNoObservers?: boolean;
}

/** Lifecycle state of the current shared query generation. */
export type QueryStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';

/** Immutable state published to observers, retaining successful data during refreshes. */
export interface QuerySnapshot<T> extends QueryRetryState {
  readonly value: T | undefined;
  /** Distinguishes a successful undefined result from the absence of successful data. */
  readonly hasValue: boolean;
  readonly error: unknown | null;
  readonly status: QueryStatus;
  readonly updatedAt: number | null;
  readonly isStale: boolean;
}

/** Controls whether a read bypasses completed cached data. */
export interface QueryFetchOptions {
  /** Bypass fresh completed data, while still joining the current pending request. */
  readonly refresh?: boolean;
}

/** Fetch and polling policy for one active query observer. */
export interface QueryRecoveryOptions {
  readonly refetchOnFocus?: boolean;
  readonly refetchOnReconnect?: boolean;
}

export interface QueryObserverOptions extends QueryFetchOptions, QueryRecoveryOptions {
  /** Milliseconds between completed requests; omitted means no polling. */
  readonly pollInterval?: number;
}

/** Callable observer disposer with same-key definition and scheduling updates. */
export interface QueryObserverHandle {
  (): void;
  isAttached(): boolean;
  /** Update the loader and register tags for the same key without changing request state. */
  updateDefinition<T>(definition: QueryDefinition<T>): void;
  /** Change scheduling without detaching the observer or implicitly refetching stale data. */
  updateOptions(options: QueryObserverOptions): void;
}

/** Clock, visibility, and capacity policies for a QueryClient. */
export interface QueryClientOptions {
  /** Consumer exceptions are isolated from query results. Defaults to host error reporting. */
  readonly onDiagnostic?: (error: unknown, context: QueryDiagnosticContext) => void;
  /** Once per failed current logical read; normal lifecycle cancellation is excluded. */
  readonly onQueryError?: (error: unknown, context: QueryErrorContext) => void;
  readonly queryDefaults?: QueryReadPolicy & QueryRecoveryOptions;
  /** Monotonic elapsed-time clock for deadlines. Independent of wall-clock cache timestamps. */
  readonly elapsedNow?: () => number;
  readonly now?: () => number;
  readonly isVisible?: () => boolean;
  readonly subscribeVisibility?: (listener: () => void) => () => void;
  readonly subscribeFocus?: (listener: () => void) => () => void;
  readonly subscribeReconnect?: (listener: () => void) => () => void;
  /** Active observers and finite pending requests are protected from capacity eviction. */
  readonly maxEntries?: number;
}

/** Diagnostics snapshot for a single cached query entry. */
export interface QueryEntryDiagnostics {
  /** The serialized canonical string form of the query key. */
  readonly serializedKey: string;
  /** Detached copy of the canonical query key structure. */
  readonly key: QueryKey;
  /** Current query lifecycle status. */
  readonly status: QueryStatus;
  /** Whether the entry currently holds a resolved value. */
  readonly hasValue: boolean;
  /** Number of active observer subscriptions. */
  readonly observerCount: number;
  /** Unsettled logical reads belonging to this cached entry, including retry waits and obsolete generations. */
  readonly requestCount: number;
  /** Whether the current generation has a pending logical read, including retry waits. */
  readonly isPending: boolean;
  /** Whether the cached value is stale according to current clock and staleTime. */
  readonly isStale: boolean;
  /** Failed attempts in the current logical read; zero after successful recovery. */
  readonly failureCount: number;
  /** Wall-clock timestamp of the current read's scheduled retry, or null. */
  readonly nextRetryAt: number | null;
  /** Freshness lifetime in milliseconds. */
  readonly staleTime: number;
  /** Retention duration in milliseconds after becoming inactive. */
  readonly gcTime: number;
  /** Timestamp when data was last updated or resolved, or null if never resolved. */
  readonly updatedAt: number | null;
  /** Timestamp when the entry became inactive (0 observers), or null if active. */
  readonly inactiveSince: number | null;
  /** Estimated milliseconds until garbage collection, if inactive and scheduled. Null if active or infinite. */
  readonly remainingGcTime: number | null;
  /** Estimated milliseconds until the next scheduled poll execution, if polling is active. */
  readonly remainingPollDelay: number | null;
  /** Invalidation tags registered for this entry. */
  readonly tagMemberships: readonly string[];
}

/** Aggregate diagnostics snapshot for a QueryClient instance. */
export interface QueryClientDiagnostics {
  /** Total number of cached query entries in memory. */
  readonly entryCount: number;
  /** Number of query entries that currently have active observers. */
  readonly activeEntryCount: number;
  /** Number of cached entries without observers; pending reads or infinite retention can defer collection. */
  readonly inactiveEntryCount: number;
  /** Unsettled logical reads across cached entries, including retry waits and obsolete generations. Removed entries are excluded. */
  readonly pendingRequestCount: number;
  /** Total number of active observer subscriptions across all queries. */
  readonly totalObserverCount: number;
  /** Configured maximum capacity before LRU eviction. */
  readonly maxEntries: number;
  /** Whether the query client has been destroyed. */
  readonly isDestroyed: boolean;
  /** Whether document visibility is currently active for polling. */
  readonly isVisible: boolean;
  /** Snapshot list of all individual query entries. */
  readonly entries: readonly QueryEntryDiagnostics[];
}
