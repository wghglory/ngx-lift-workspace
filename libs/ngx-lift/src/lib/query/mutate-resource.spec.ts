import {effect, Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {defer, Observable, of, Subject, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {mutateResource} from './mutate-resource';
import {QueryClient} from './query-client';
import {QUERY_CLIENT} from './query-client.token';

async function settle(): Promise<void> {
  for (let index = 0; index < 8; index++) {
    await Promise.resolve();
  }
}

describe('mutateResource', () => {
  let client: QueryClient;

  beforeEach(() => {
    client = new QueryClient();
    TestBed.configureTestingModule({providers: [{provide: QUERY_CLIENT, useValue: client}]});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    client.destroy();
  });

  it('runs only when explicitly invoked and invalidates tags from the successful result and arguments', async () => {
    const mutation = vi.fn((id: number) => of({id}));
    const invalidate = vi.spyOn(client, 'invalidateTags');
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource(mutation, {
        invalidatesTags: (result, id) => [{type: 'Binding', id: result.id, scope: `org-${id}`}],
      }),
    );
    await settle();
    expect(mutation).not.toHaveBeenCalled();
    expect(resource.status()).toBe('idle');
    const result = resource.mutate(1);
    expect(resource.isLoading()).toBe(true);
    expect(mutation).toHaveBeenCalledExactlyOnceWith(1);
    expect(await result).toEqual({id: 1});
    expect(invalidate).toHaveBeenCalledWith([{type: 'Binding', id: 1, scope: 'org-1'}]);
    expect(resource.value()).toEqual({id: 1});
    expect(resource.status()).toBe('resolved');
    expect(resource.isLoading()).toBe(false);
  });

  it('assimilates a thenable without catch and invalidates on success', async () => {
    const promise = Promise.resolve(7);
    const thenable: PromiseLike<number> = {then: promise.then.bind(promise)};
    const invalidate = vi.spyOn(client, 'invalidateTags');
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource(() => thenable, {invalidatesTags: [{type: 'Thenable'}]}),
    );
    expect(await resource.mutate(undefined)).toBe(7);
    expect(resource.value()).toBe(7);
    expect(resource.status()).toBe('resolved');
    expect(invalidate).toHaveBeenCalledWith([{type: 'Thenable'}]);
  });

  it.each([7, undefined])('accepts a synchronous mutation result: %s', async (result) => {
    const resource = TestBed.runInInjectionContext(() => mutateResource(() => result));
    expect(await resource.mutate(undefined)).toBe(result);
    expect(resource.value()).toBe(result);
    expect(resource.status()).toBe('resolved');
  });

  it('propagates thenable rejection without invalidating', async () => {
    const failure = new Error('thenable failed');
    const invalidate = vi.spyOn(client, 'invalidateTags');
    const thenable: PromiseLike<number> = {
      then: (resolve, reject) => Promise.reject<number>(failure).then(resolve, reject),
    };
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource(() => thenable, {invalidatesTags: [{type: 'Thenable'}]}),
    );
    await expect(resource.mutate(undefined)).rejects.toBe(failure);
    expect(resource.error()).toBe(failure);
    expect(resource.status()).toBe('error');
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('joins submissions only with explicit exhaust without applying the second arguments', async () => {
    const source = new Subject<number>();
    const mutation = vi.fn(() => source);
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource<number, number>(mutation, {concurrency: 'exhaust'}),
    );
    const first = resource.mutate(1);
    const duplicate = resource.mutate(2);
    expect(duplicate).toBe(first);
    await settle();
    expect(mutation).toHaveBeenCalledExactlyOnceWith(1);
    source.next(10);
    expect(await duplicate).toBe(10);
    expect(source.observed).toBe(false);
  });

  it.each(['exhaust', 'concat'] as const)(
    'registers pending work before synchronous %s reentry',
    async (concurrency) => {
      const source = new Subject<number>();
      const mutation = vi.fn<(id: number) => Observable<number>>();
      const resource = TestBed.runInInjectionContext(() => mutateResource(mutation, {concurrency}));
      let nested: Promise<number> | undefined;
      mutation.mockImplementation((id) => {
        if (id === 1) {
          nested = resource.mutate(2);
          return source;
        }
        return of(id);
      });
      const first = resource.mutate(1);
      expect(mutation).toHaveBeenCalledExactlyOnceWith(1);
      expect(nested === first).toBe(concurrency === 'exhaust');
      source.next(10);
      expect(await first).toBe(10);
      expect(await nested).toBe(concurrency === 'exhaust' ? 10 : 2);
      expect(mutation.mock.calls).toEqual(concurrency === 'exhaust' ? [[1]] : [[1], [2]]);
      expect(resource.isLoading()).toBe(false);
    },
  );

  it('executes different arguments independently by default and retains the latest submitted result', async () => {
    const firstSource = new Subject<number>();
    const secondSource = new Subject<number>();
    const mutation = vi.fn((id: number) => (id === 1 ? firstSource : secondSource));
    const invalidate = vi.spyOn(client, 'invalidateTags');
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource(mutation, {
        invalidatesTags: (_result, id) => [{type: 'Item', id}],
      }),
    );
    const first = resource.mutate(1);
    const second = resource.mutate(2);
    expect(second).not.toBe(first);
    expect(mutation.mock.calls).toEqual([[1], [2]]);
    secondSource.next(20);
    expect(await second).toBe(20);
    expect(resource.value()).toBe(20);
    expect(resource.isLoading()).toBe(true);
    expect(resource.status()).toBe('loading');
    firstSource.next(10);
    expect(await first).toBe(10);
    expect(resource.value()).toBe(20);
    expect(resource.isLoading()).toBe(false);
    expect(resource.status()).toBe('resolved');
    expect(invalidate.mock.calls).toEqual([[[{type: 'Item', id: 2}]], [[{type: 'Item', id: 1}]]]);
  });

  it.each([true, false])(
    'publishes only the latest invocation when an overlapping write fails (older fails: %s)',
    async (olderFails) => {
      const firstSource = new Subject<number>();
      const secondSource = new Subject<number>();
      const failure = new Error('write failed');
      const resource = TestBed.runInInjectionContext(() =>
        mutateResource((id: number) => (id === 1 ? firstSource : secondSource)),
      );
      const first = resource.mutate(1);
      const second = resource.mutate(2);
      const rejected = expect(olderFails ? first : second).rejects.toBe(failure);
      if (olderFails) {
        secondSource.next(20);
        expect(await second).toBe(20);
        firstSource.error(failure);
      } else {
        secondSource.error(failure);
        await rejected;
        firstSource.next(10);
        expect(await first).toBe(10);
      }
      await rejected;
      expect(resource.isLoading()).toBe(false);
      expect(resource.error()).toBe(olderFails ? null : failure);
      expect(resource.status()).toBe(olderFails ? 'resolved' : 'error');
      expect(resource.value()).toBe(olderFails ? 20 : undefined);
    },
  );

  it('does not add synchronous deferred transport dependencies to an invoking effect', async () => {
    const context = signal(1);
    const mutation = vi.fn(() => defer(() => of(context())));
    const resource = TestBed.runInInjectionContext(() => mutateResource(mutation));
    TestBed.runInInjectionContext(() => effect(() => void resource.mutate(undefined)));
    TestBed.tick();
    await settle();
    expect(mutation).toHaveBeenCalledTimes(1);
    context.set(2);
    TestBed.tick();
    await settle();
    expect(mutation).toHaveBeenCalledTimes(1);
    expect(resource.value()).toBe(1);
  });

  it('records Observable errors and does not invalidate after a failed write', async () => {
    const failure = new Error('permission denied');
    const invalidate = vi.spyOn(client, 'invalidateTags');
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource(() => throwError(() => failure), {invalidatesTags: [{type: 'Bindings'}]}),
    );
    await expect(resource.mutate(undefined)).rejects.toBe(failure);
    expect(resource.error()).toBe(failure);
    expect(resource.status()).toBe('error');
    expect(resource.isLoading()).toBe(false);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('handles synchronous mutation errors and can retry successfully', async () => {
    const failure = new Error('validation failed');
    const mutation = vi
      .fn<(args: number) => Promise<number>>()
      .mockImplementationOnce(() => {
        throw failure;
      })
      .mockResolvedValue(2);
    const resource = TestBed.runInInjectionContext(() => mutateResource(mutation));
    await expect(resource.mutate(1)).rejects.toBe(failure);
    expect(await resource.mutate(2)).toBe(2);
    expect(resource.error()).toBeNull();
    expect(resource.value()).toBe(2);
  });

  it('serializes every submission with concat and continues the queue after a failure', async () => {
    const firstSource = new Subject<number>();
    const failure = new Error('first write failed');
    const mutation = vi
      .fn<(id: number) => Promise<number> | Subject<number>>()
      .mockReturnValueOnce(firstSource)
      .mockResolvedValueOnce(2);
    const resource = TestBed.runInInjectionContext(() => mutateResource(mutation, {concurrency: 'concat'}));
    const first = resource.mutate(1);
    const rejected = expect(first).rejects.toBe(failure);
    const second = resource.mutate(2);
    await settle();
    expect(mutation).toHaveBeenCalledExactlyOnceWith(1);
    expect(resource.isLoading()).toBe(true);
    firstSource.error(failure);
    await rejected;
    expect(await second).toBe(2);
    expect(mutation.mock.calls).toEqual([[1], [2]]);
    expect(resource.isLoading()).toBe(false);
    expect(resource.status()).toBe('resolved');
    expect(resource.error()).toBeNull();
  });

  it('invalidates an observed query without waiting for the background refetch to finish', async () => {
    let finishReload: ((value: number) => void) | undefined;
    const loader = vi
      .fn<() => Promise<number>>()
      .mockResolvedValueOnce(1)
      .mockImplementationOnce(() => new Promise((resolve) => (finishReload = resolve)));
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}]};
    const unsubscribe = client.observeQuery(definition, () => undefined);
    await settle();
    const resource = TestBed.runInInjectionContext(() =>
      mutateResource(async () => 'saved', {invalidatesTags: [{type: 'Bindings'}]}),
    );
    expect(await resource.mutate(undefined)).toBe('saved');
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(resource.isLoading()).toBe(false);
    expect(client.getSnapshot(definition.key)?.status).toBe('reloading');
    finishReload?.(2);
    await settle();
    unsubscribe();
  });

  it('lets a submitted write finish and invalidate after its component injector is destroyed', async () => {
    const componentInjector = Injector.create({providers: [], parent: TestBed.inject(Injector)});
    const source = new Subject<number>();
    const invalidate = vi.spyOn(client, 'invalidateTags');
    const resource = mutateResource(() => source, {
      injector: componentInjector,
      client,
      invalidatesTags: [{type: 'Bindings'}],
    });
    const request = resource.mutate(undefined);
    await settle();
    componentInjector.destroy();
    expect(source.observed).toBe(true);
    source.next(1);
    expect(await request).toBe(1);
    expect(invalidate).toHaveBeenCalledWith([{type: 'Bindings'}]);
    expect(resource.value()).toBeUndefined();
    await expect(resource.mutate(undefined)).rejects.toThrow('destroyed');
  });

  it('rejects queued concat submissions after disposal without issuing another server write', async () => {
    const componentInjector = Injector.create({providers: [], parent: TestBed.inject(Injector)});
    const source = new Subject<number>();
    const mutation = vi.fn((id: number) => (id === 1 ? source : of(id)));
    const resource = mutateResource(mutation, {injector: componentInjector, client, concurrency: 'concat'});
    const first = resource.mutate(1);
    const queued = resource.mutate(2);
    const rejected = expect(queued).rejects.toThrow('destroyed');
    expect(mutation).toHaveBeenCalledExactlyOnceWith(1);
    componentInjector.destroy();
    source.next(1);
    expect(await first).toBe(1);
    await rejected;
    expect(mutation).toHaveBeenCalledExactlyOnceWith(1);
    expect(resource.isLoading()).toBe(false);
  });
});
