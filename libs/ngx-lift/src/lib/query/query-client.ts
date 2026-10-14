import {
  QueryClientDiagnostics,
  QueryClientOptions,
  QueryDefinition,
  QueryEntryDiagnostics,
  QueryFetchOptions,
  QueryKey,
  QueryObserverHandle,
  QueryObserverOptions,
  QuerySnapshot,
  QueryStatus,
  QueryTag,
} from './query.models';
import {serializeQueryKey} from './query-key';

const MAX_TIMER_DELAY = 2_147_483_647;

interface QueryRequest<T> {
  readonly promise: Promise<T>;
  readonly controller: AbortController;
  readonly generation: number;
}

interface QueryObserver<T> {
  readonly listener: (snapshot: QuerySnapshot<T>) => void;
  options: QueryObserverOptions;
}

interface QueryEntry<T> {
  readonly serializedKey: string;
  readonly key: QueryKey;
  loader: QueryDefinition<T>['loader'];
  staleTime: number;
  gcTime: number;
  cancelOnNoObservers: boolean;
  readonly tagMemberships: Set<string>;
  readonly observers: Set<QueryObserver<T>>;
  readonly requests: Set<QueryRequest<T>>;
  value: T | undefined;
  hasValue: boolean;
  error: unknown | null;
  status: QueryStatus;
  updatedAt: number | null;
  invalidated: boolean;
  generation: number;
  publicationRevision: number;
  pending?: QueryRequest<T>;
  lastAccess: number;
  inactiveSince: number | null;
  pollBaselineAt: number;
  nextPollAt: number | null;
  pollTimer?: ReturnType<typeof setTimeout>;
  gcTimer?: ReturnType<typeof setTimeout>;
  staleTimer?: ReturnType<typeof setTimeout>;
}

/** Shares server data, request lifecycles, invalidation, and scheduling independently of Angular. */
export class QueryClient {
  private readonly entries = new Map<string, QueryEntry<unknown>>();
  private readonly tagIndex = new Map<string, Set<string>>();
  private readonly now: () => number;
  private readonly isVisible: () => boolean;
  private readonly maxEntries: number;
  private readonly unsubscribeVisibility?: () => void;
  private accessSequence = 0;
  private destroyed = false;

  constructor(options: QueryClientOptions = {}) {
    this.now = options.now ?? (() => Date.now());
    this.isVisible = options.isVisible ?? (() => true);
    this.maxEntries = options.maxEntries ?? 200;
    if (!Number.isInteger(this.maxEntries) || this.maxEntries < 1) {
      throw new RangeError('maxEntries must be a positive integer.');
    }
    this.unsubscribeVisibility = options.subscribeVisibility?.(() => this.visibilityChanged());
  }

  /** Read cached fresh data or join/start a shared request; refresh bypasses completed data. */
  fetchQuery<T>(definition: QueryDefinition<T>, options: QueryFetchOptions = {}): Promise<T> {
    const entry = this.ensureEntry(definition);
    if (!entry.observers.size) {
      entry.inactiveSince = this.now();
      this.clearTimer(entry, 'gcTimer');
    }
    if (entry.pending) {
      return entry.pending.promise;
    }
    if (!options.refresh && !this.isStale(entry)) {
      this.scheduleGc(entry);
      return Promise.resolve(entry.value as T);
    }
    return this.startRequest(entry, options.refresh ?? false);
  }

  /** Publish current state synchronously and attach an observer until its handle is disposed. */
  observeQuery<T>(
    definition: QueryDefinition<T>,
    listener: (snapshot: QuerySnapshot<T>) => void,
    options: QueryObserverOptions = {},
  ): QueryObserverHandle {
    this.validateObserverOptions(options);
    const entry = this.ensureEntry(definition);
    const observer: QueryObserver<T> = {listener, options};
    entry.observers.add(observer);
    entry.inactiveSince = null;
    this.clearTimer(entry, 'gcTimer');
    listener(this.snapshot(entry));
    // The initial synchronous listener may remove this query or destroy the client.
    if (this.isAttached(entry)) {
      if (options.refresh || this.isStale(entry)) {
        this.startRequest(entry, options.refresh ?? false);
      } else {
        this.schedulePoll(entry);
        this.scheduleStaleness(entry);
      }
    }
    let attached = true;
    const unsubscribe = (() => {
      if (!attached) {
        return;
      }
      attached = false;
      entry.observers.delete(observer);
      if (!entry.observers.size) {
        entry.inactiveSince = this.now();
        if (entry.cancelOnNoObservers && entry.requests.size) {
          entry.generation++;
          entry.pending = undefined;
          entry.invalidated = true;
          entry.status = entry.hasValue ? 'resolved' : 'idle';
          for (const request of entry.requests) {
            request.controller.abort();
          }
        }
        this.clearTimer(entry, 'staleTimer');
        this.scheduleGc(entry);
        this.enforceCapacity();
      }
      this.schedulePoll(entry);
    }) as QueryObserverHandle;
    unsubscribe.isAttached = () => attached && this.isAttached(entry) && entry.observers.has(observer);
    unsubscribe.updateDefinition = (nextDefinition) => {
      if (!unsubscribe.isAttached()) {
        return;
      }
      if (serializeQueryKey(nextDefinition.key) !== entry.serializedKey) {
        throw new Error('An observer definition update must retain the same query key.');
      }
      this.ensureEntry(nextDefinition);
    };
    unsubscribe.updateOptions = (nextOptions) => {
      this.validateObserverOptions(nextOptions);
      if (!attached || !this.isAttached(entry)) {
        return;
      }
      const previousInterval = this.pollInterval(entry);
      observer.options = nextOptions;
      if (this.pollInterval(entry) !== previousInterval) {
        entry.pollBaselineAt = this.now();
      }
      if (nextOptions.refresh) {
        this.startRequest(entry, true);
      } else {
        this.schedulePoll(entry);
      }
    };
    return unsubscribe;
  }

  /** Return current cached state without fetching or extending retention. */
  getSnapshot<T>(key: QueryKey): QuerySnapshot<T> | undefined {
    const entry = this.entries.get(serializeQueryKey(key)) as QueryEntry<T> | undefined;
    return entry ? this.snapshot(entry) : undefined;
  }

  /** Return a point-in-time snapshot of all cached query entries and their runtime metrics. */
  getEntriesSnapshot(): QueryEntryDiagnostics[] {
    const now = this.now();
    const visible = this.isVisible();
    const list: QueryEntryDiagnostics[] = [];

    for (const entry of this.entries.values()) {
      let remainingGcTime: number | null = null;
      if (
        !entry.observers.size &&
        !entry.requests.size &&
        entry.inactiveSince !== null &&
        Number.isFinite(entry.gcTime)
      ) {
        remainingGcTime = Math.max(0, entry.inactiveSince + entry.gcTime - now);
      }

      let remainingPollDelay: number | null = null;
      if (entry.nextPollAt !== null && entry.observers.size > 0 && !entry.pending && visible) {
        remainingPollDelay = Math.max(0, entry.nextPollAt - now);
      }

      list.push({
        serializedKey: entry.serializedKey,
        key: JSON.parse(entry.serializedKey),
        status: entry.status,
        hasValue: entry.hasValue,
        observerCount: entry.observers.size,
        requestCount: entry.requests.size,
        isPending: entry.pending !== undefined,
        isStale: this.isStale(entry),
        staleTime: entry.staleTime,
        gcTime: entry.gcTime,
        updatedAt: entry.updatedAt,
        inactiveSince: entry.inactiveSince,
        remainingGcTime,
        remainingPollDelay,
        tagMemberships: Array.from(entry.tagMemberships),
      });
    }

    return list;
  }

  /** Return aggregate metrics and entry states for developer tools and diagnostic inspection. */
  getDiagnostics(): QueryClientDiagnostics {
    const entries = this.getEntriesSnapshot();
    let activeEntryCount = 0;
    let pendingRequestCount = 0;
    let totalObserverCount = 0;

    for (const entry of entries) {
      if (entry.observerCount > 0) {
        activeEntryCount++;
      }
      pendingRequestCount += entry.requestCount;
      totalObserverCount += entry.observerCount;
    }

    return {
      entryCount: entries.length,
      activeEntryCount,
      inactiveEntryCount: entries.length - activeEntryCount,
      pendingRequestCount,
      totalObserverCount,
      maxEntries: this.maxEntries,
      isDestroyed: this.destroyed,
      isVisible: this.isVisible(),
      entries,
    };
  }

  /** An omitted id matches every entity id of this type within the same scope. */
  invalidateTags(tags: readonly QueryTag[]): void {
    this.assertActive();
    const affectedKeys = new Set<string>();
    for (const tag of tags) {
      for (const key of this.tagIndex.get(this.tagMembership(tag)) ?? []) {
        affectedKeys.add(key);
      }
    }
    const affectedEntries = [...affectedKeys]
      .map((key) => this.entries.get(key))
      .filter((entry): entry is QueryEntry<unknown> => entry !== undefined);
    // Detach every affected dependency before any observer or loader can read it again.
    for (const entry of affectedEntries) {
      entry.generation++;
      entry.invalidated = true;
      // Older callers can finish, but their results no longer belong to this query generation.
      entry.pending = undefined;
      entry.status = entry.hasValue ? 'resolved' : 'idle';
      this.clearTimer(entry, 'pollTimer');
      this.clearTimer(entry, 'staleTimer');
    }
    for (const entry of affectedEntries) {
      if (this.isAttached(entry)) {
        this.publish(entry);
      }
    }
    for (const entry of affectedEntries) {
      if (this.isAttached(entry) && entry.observers.size) {
        this.startRequest(entry, true);
      }
    }
  }

  /** Explicit removal aborts transport and clears observers; it never triggers old-scope reloads. */
  removeQueries(predicate?: (key: QueryKey) => boolean): void {
    for (const entry of [...this.entries.values()]) {
      if (!predicate || predicate(entry.key)) {
        this.removeEntry(entry);
      }
    }
  }

  /** Abort all requests, clear cache and scheduling, and reject future reads. */
  destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.unsubscribeVisibility?.();
    this.removeQueries();
  }

  private ensureEntry<T>(definition: QueryDefinition<T>): QueryEntry<T> {
    this.assertActive();
    const serializedKey = serializeQueryKey(definition.key);
    const staleTime = definition.staleTime ?? 0;
    const gcTime = definition.gcTime ?? 300_000;
    const cancelOnNoObservers = definition.cancelOnNoObservers ?? false;
    this.validateDuration(staleTime, 'staleTime');
    this.validateDuration(gcTime, 'gcTime');
    for (const tag of definition.tags ?? []) {
      this.tagMembership(tag);
    }
    let entry = this.entries.get(serializedKey) as QueryEntry<T> | undefined;
    if (entry) {
      const previouslyStale = this.isStale(entry);
      // Meet every reader's freshness/retention needs; shared transport is cancelled only when all opt in.
      entry.staleTime = Math.min(entry.staleTime, staleTime);
      entry.gcTime = Math.max(entry.gcTime, gcTime);
      entry.cancelOnNoObservers = entry.cancelOnNoObservers && cancelOnNoObservers;
      entry.loader = definition.loader;
      entry.lastAccess = ++this.accessSequence;
      this.scheduleStaleness(entry);
      if (previouslyStale !== this.isStale(entry)) this.publish(entry);
    } else {
      entry = {
        serializedKey,
        // Capture a key snapshot so caller mutations cannot alter removal predicates.
        key: JSON.parse(serializedKey),
        loader: definition.loader,
        staleTime,
        gcTime,
        cancelOnNoObservers,
        tagMemberships: new Set(),
        observers: new Set(),
        requests: new Set(),
        value: undefined,
        hasValue: false,
        error: null,
        status: 'idle',
        updatedAt: null,
        invalidated: true,
        generation: 0,
        publicationRevision: 0,
        lastAccess: ++this.accessSequence,
        inactiveSince: this.now(),
        pollBaselineAt: this.now(),
        nextPollAt: null,
      };
      this.entries.set(serializedKey, entry as QueryEntry<unknown>);
    }
    for (const tag of definition.tags ?? []) {
      this.registerTag(entry, tag);
    }
    return entry;
  }

  private startRequest<T>(entry: QueryEntry<T>, refresh: boolean): Promise<T> {
    if (entry.pending) {
      return entry.pending.promise;
    }
    const controller = new AbortController();
    const loader = entry.loader;
    let transportCallbacks:
      {resolve: (value: T | PromiseLike<T>) => void; reject: (error: unknown) => void} | undefined;
    const transport = new Promise<T>((resolve, reject) => {
      transportCallbacks = {resolve, reject};
    });
    if (!transportCallbacks) throw new Error('Promise executor did not initialize transport callbacks.');
    const {resolve: resolveTransport, reject: rejectTransport} = transportCallbacks;
    const onAbort = () => rejectTransport(controller.signal.reason);
    controller.signal.addEventListener('abort', onAbort, {once: true});
    const promise: Promise<T> = transport.then(
      (value) => {
        controller.signal.removeEventListener('abort', onAbort);
        entry.requests.delete(request);
        if (this.isCurrent(entry, request)) {
          entry.pending = undefined;
          entry.value = value;
          entry.hasValue = true;
          entry.error = null;
          entry.status = 'resolved';
          entry.updatedAt = this.now();
          entry.invalidated = false;
          entry.pollBaselineAt = this.now();
          this.publish(entry);
          this.scheduleStaleness(entry);
          this.schedulePoll(entry);
        }
        this.scheduleGc(entry);
        this.enforceCapacity();
        return value;
      },
      (error: unknown) => {
        controller.signal.removeEventListener('abort', onAbort);
        entry.requests.delete(request);
        if (this.isCurrent(entry, request)) {
          entry.pending = undefined;
          entry.error = error;
          entry.status = 'error';
          entry.invalidated = true;
          entry.pollBaselineAt = this.now();
          this.publish(entry);
          this.schedulePoll(entry);
        }
        this.scheduleGc(entry);
        this.enforceCapacity();
        throw error;
      },
    );
    const request: QueryRequest<T> = {promise, controller, generation: entry.generation};
    entry.requests.add(request);
    entry.pending = request;
    entry.error = null;
    entry.status = entry.hasValue ? 'reloading' : 'loading';
    this.clearTimer(entry, 'pollTimer');
    this.clearTimer(entry, 'gcTimer');
    // Background observers have no Promise consumer. Preserve rejection for explicit callers.
    void promise.catch(() => undefined);
    this.publish(entry);
    // Install pending state first, then preserve HttpClient's synchronous dispatch semantics.
    try {
      controller.signal.throwIfAborted();
      Promise.resolve(loader({abortSignal: controller.signal, refresh})).then(resolveTransport, rejectTransport);
    } catch (error) {
      rejectTransport(error);
    }
    this.enforceCapacity();
    return promise;
  }

  private isCurrent<T>(entry: QueryEntry<T>, request: QueryRequest<T>): boolean {
    return this.isAttached(entry) && entry.pending === request && entry.generation === request.generation;
  }

  private isAttached<T>(entry: QueryEntry<T>): boolean {
    return !this.destroyed && this.entries.get(entry.serializedKey) === entry;
  }

  private isStale<T>(entry: QueryEntry<T>): boolean {
    return (
      !entry.hasValue ||
      entry.invalidated ||
      (entry.updatedAt !== null && this.now() - entry.updatedAt >= entry.staleTime)
    );
  }

  private snapshot<T>(entry: QueryEntry<T>): QuerySnapshot<T> {
    return {
      value: entry.value,
      hasValue: entry.hasValue,
      error: entry.error,
      status: entry.status,
      updatedAt: entry.updatedAt,
      isStale: this.isStale(entry),
    };
  }

  private publish<T>(entry: QueryEntry<T>): void {
    const revision = ++entry.publicationRevision;
    const snapshot = this.snapshot(entry);
    for (const observer of [...entry.observers]) {
      // Listeners may publish newer state or detach peers before this loop continues.
      if (entry.publicationRevision !== revision) break;
      if (!entry.observers.has(observer)) continue;
      observer.listener(snapshot);
    }
  }

  private registerTag<T>(entry: QueryEntry<T>, tag: QueryTag): void {
    const memberships = [this.tagMembership({type: tag.type, scope: tag.scope})];
    if (tag.id !== undefined) {
      memberships.push(this.tagMembership(tag));
    }
    for (const membership of memberships) {
      if (entry.tagMemberships.has(membership)) {
        continue;
      }
      entry.tagMemberships.add(membership);
      let keys = this.tagIndex.get(membership);
      if (!keys) {
        keys = new Set();
        this.tagIndex.set(membership, keys);
      }
      keys.add(entry.serializedKey);
    }
  }

  private tagMembership(tag: QueryTag): string {
    if (
      typeof tag.type !== 'string' ||
      (tag.scope !== undefined && typeof tag.scope !== 'string') ||
      (tag.id !== undefined && typeof tag.id !== 'string' && (typeof tag.id !== 'number' || !Number.isFinite(tag.id)))
    ) {
      throw new TypeError('Query tags require a string type, an optional string scope, and an optional finite id.');
    }
    return JSON.stringify([tag.type, tag.scope ?? null, tag.id ?? null]);
  }

  private pollInterval<T>(entry: QueryEntry<T>): number | undefined {
    let interval: number | undefined;
    for (const observer of entry.observers) {
      if (observer.options.pollInterval !== undefined) {
        interval = Math.min(interval ?? Infinity, observer.options.pollInterval);
      }
    }
    return interval;
  }

  private schedulePoll<T>(entry: QueryEntry<T>): void {
    this.clearTimer(entry, 'pollTimer');
    const interval = this.pollInterval(entry);
    if (!this.isAttached(entry) || interval === undefined) {
      entry.nextPollAt = null;
      return;
    }
    entry.nextPollAt = entry.pollBaselineAt + interval;
    if (entry.pending || !this.isVisible()) {
      return;
    }
    entry.pollTimer = setTimeout(
      () => {
        entry.pollTimer = undefined;
        if (this.isAttached(entry) && entry.observers.size && this.isVisible()) {
          if (entry.nextPollAt !== null && entry.nextPollAt > this.now()) {
            this.schedulePoll(entry);
          } else {
            this.startRequest(entry, true);
          }
        }
      },
      this.timerDelay(entry.nextPollAt - this.now()),
    );
  }

  private visibilityChanged(): void {
    for (const entry of this.entries.values()) {
      if (!this.isVisible()) {
        this.clearTimer(entry, 'pollTimer');
      } else if (entry.nextPollAt !== null && entry.nextPollAt <= this.now() && entry.observers.size) {
        this.startRequest(entry, true);
      } else {
        this.schedulePoll(entry);
      }
    }
  }

  private scheduleStaleness<T>(entry: QueryEntry<T>): void {
    this.clearTimer(entry, 'staleTimer');
    if (!entry.observers.size || entry.updatedAt === null || this.isStale(entry) || !Number.isFinite(entry.staleTime)) {
      return;
    }
    entry.staleTimer = setTimeout(
      () => {
        entry.staleTimer = undefined;
        if (this.isAttached(entry)) {
          if (this.isStale(entry)) {
            this.publish(entry);
          } else {
            this.scheduleStaleness(entry);
          }
        }
      },
      this.timerDelay(entry.updatedAt + entry.staleTime - this.now()),
    );
  }

  private scheduleGc<T>(entry: QueryEntry<T>): void {
    this.clearTimer(entry, 'gcTimer');
    if (
      !this.isAttached(entry) ||
      entry.observers.size ||
      entry.requests.size ||
      entry.inactiveSince === null ||
      !Number.isFinite(entry.gcTime)
    ) {
      return;
    }
    const remaining = entry.inactiveSince + entry.gcTime - this.now();
    entry.gcTimer = setTimeout(() => {
      entry.gcTimer = undefined;
      if (entry.inactiveSince !== null && entry.inactiveSince + entry.gcTime > this.now()) {
        this.scheduleGc(entry);
      } else {
        this.removeEntry(entry);
      }
    }, this.timerDelay(remaining));
  }

  private enforceCapacity(): void {
    if (this.entries.size <= this.maxEntries) {
      return;
    }
    const removable = [...this.entries.values()]
      .filter((entry) => !entry.observers.size && !entry.requests.size)
      .sort((a, b) => a.lastAccess - b.lastAccess);
    for (const entry of removable) {
      if (this.entries.size <= this.maxEntries) {
        break;
      }
      this.removeEntry(entry);
    }
  }

  private removeEntry<T>(entry: QueryEntry<T>): void {
    if (this.entries.get(entry.serializedKey) !== entry) {
      return;
    }
    this.entries.delete(entry.serializedKey);
    entry.generation++;
    this.clearTimer(entry, 'pollTimer');
    this.clearTimer(entry, 'gcTimer');
    this.clearTimer(entry, 'staleTimer');
    for (const request of entry.requests) {
      request.controller.abort();
    }
    for (const membership of entry.tagMemberships) {
      const keys = this.tagIndex.get(membership);
      keys?.delete(entry.serializedKey);
      if (!keys?.size) {
        this.tagIndex.delete(membership);
      }
    }
    entry.value = undefined;
    entry.hasValue = false;
    entry.error = null;
    entry.status = 'idle';
    entry.updatedAt = null;
    entry.invalidated = true;
    entry.pending = undefined;
    this.publish(entry);
    entry.observers.clear();
  }

  private clearTimer<T>(entry: QueryEntry<T>, property: 'pollTimer' | 'gcTimer' | 'staleTimer'): void {
    if (entry[property] !== undefined) {
      clearTimeout(entry[property]);
      entry[property] = undefined;
    }
  }

  private validateObserverOptions(options: QueryObserverOptions): void {
    if (options.pollInterval !== undefined && (!Number.isFinite(options.pollInterval) || options.pollInterval <= 0)) {
      throw new RangeError('pollInterval must be a positive finite duration.');
    }
  }

  /** Native timers overflow above this limit; recheck deadlines at each bounded segment. */
  private timerDelay(remaining: number): number {
    return Math.min(MAX_TIMER_DELAY, Math.max(0, remaining));
  }

  private validateDuration(value: number, name: string): void {
    if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
      throw new RangeError(`${name} must be a nonnegative duration or Infinity.`);
    }
  }

  private assertActive(): void {
    if (this.destroyed) {
      throw new Error('The query client has been destroyed.');
    }
  }
}
