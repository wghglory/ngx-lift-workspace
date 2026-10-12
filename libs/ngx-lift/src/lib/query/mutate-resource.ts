import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import {firstValueFrom, isObservable, Observable} from 'rxjs';

import {QueryTag} from './query.models';
import {QueryClient} from './query-client';
import {QUERY_CLIENT} from './query-client.token';

/** Invalidation and concurrency policy for explicit server writes. */
export interface MutateResourceOptions<TArgs, TResult> {
  invalidatesTags?: readonly QueryTag[] | ((result: TResult, args: TArgs) => readonly QueryTag[]);
  client?: QueryClient;
  injector?: Injector;
  /** Parallel executes every invocation (default). Exhaust explicitly joins pending work; concat queues it. */
  concurrency?: 'parallel' | 'exhaust' | 'concat';
}

/** Mutation result signals and an explicit Promise-returning write operation. */
export interface MutateResourceRef<TArgs, TResult, E = Error> {
  readonly value: Signal<TResult | undefined>;
  readonly error: Signal<E | null>;
  readonly status: Signal<'idle' | 'loading' | 'resolved' | 'error'>;
  readonly isLoading: Signal<boolean>;
  /**
   * Runs only on explicit invocation. Pass an immutable argument snapshot, especially with concat.
   * Successful writes invalidate without awaiting background refetch.
   */
  mutate(args: TArgs): Promise<TResult>;
}

/** Explicit mutation state; disposal does not pretend to roll back an already submitted server write. */
export function mutateResource<TArgs, TResult, E = Error>(
  mutation: (args: TArgs) => Observable<TResult> | PromiseLike<TResult> | TResult,
  options: MutateResourceOptions<TArgs, TResult> = {},
): MutateResourceRef<TArgs, TResult, E> {
  if (!options.injector) {
    assertInInjectionContext(mutateResource);
  }
  const injector = options.injector ?? inject(Injector);
  const client = options.client ?? injector.get(QUERY_CLIENT);
  const value = signal<TResult | undefined>(undefined);
  const error = signal<E | null>(null);
  const settledStatus = signal<'idle' | 'resolved' | 'error'>('idle');
  const outstanding = signal(0);
  let pending: Promise<TResult> | undefined;
  let latestInvocation = 0;
  let destroyed = false;
  injector.get(DestroyRef).onDestroy(() => {
    destroyed = true;
    outstanding.set(0);
  });

  const execute = async (args: TArgs, invocation: number): Promise<TResult> => {
    if (destroyed) {
      throw new Error('Mutation resource has been destroyed');
    }
    try {
      const resultPromise = untracked(() => {
        const source = mutation(args);
        return isObservable(source) ? firstValueFrom(source) : Promise.resolve(source);
      });
      // Mark synchronous Observable failures handled before Promise assimilation in Zone.js.
      void resultPromise.catch(() => undefined);
      const result = await resultPromise;
      const tags =
        typeof options.invalidatesTags === 'function' ? options.invalidatesTags(result, args) : options.invalidatesTags;
      if (tags?.length) {
        client.invalidateTags(tags);
      }
      if (!destroyed && invocation === latestInvocation) {
        value.set(result);
        error.set(null);
        settledStatus.set('resolved');
      }
      return result;
    } catch (failure) {
      if (!destroyed && invocation === latestInvocation) {
        error.set(failure as E);
        settledStatus.set('error');
      }
      throw failure;
    }
  };

  return {
    value: value.asReadonly(),
    error: error.asReadonly(),
    status: computed(() => (outstanding() > 0 ? 'loading' : settledStatus())),
    isLoading: computed(() => outstanding() > 0),
    mutate: (args) => {
      if (destroyed) {
        const rejected = Promise.reject<TResult>(new Error('Mutation resource has been destroyed'));
        void rejected.catch(() => undefined);
        return rejected;
      }
      if (pending && options.concurrency === 'exhaust') {
        return pending;
      }
      outstanding.update((count) => count + 1);
      error.set(null);
      const preceding = pending;
      const invocation = ++latestInvocation;
      let callbacks:
        {resolve: (value: TResult | PromiseLike<TResult>) => void; reject: (failure: unknown) => void} | undefined;
      const request = new Promise<TResult>((resolve, reject) => {
        callbacks = {resolve, reject};
      });
      if (!callbacks) throw new Error('Mutation request callbacks were not initialized');
      const {resolve, reject} = callbacks;
      const finish = () => {
        if (!destroyed) outstanding.update((count) => count - 1);
        if (pending === request) pending = undefined;
      };
      const start = () => {
        void execute(args, invocation).then(
          (result) => {
            finish();
            resolve(result);
          },
          (failure) => {
            finish();
            reject(failure);
          },
        );
      };
      // Install ownership before synchronous transport callbacks can reenter mutate.
      pending = request;
      if (options.concurrency === 'concat' && preceding) void preceding.then(start, start);
      else start();
      // Event handlers may ignore this Promise, while awaiting callers still receive its rejection.
      void request.catch(() => undefined);
      return request;
    },
  };
}
