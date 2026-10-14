import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {of, Subject} from 'rxjs';
import {afterEach, beforeEach, describe, expect, expectTypeOf, it, vi} from 'vitest';

import {QueryClient} from './query-client';
import {QUERY_CLIENT} from './query-client.token';
import {QueryResourceItem, queryResources} from './query-resources';

async function settle() {
  TestBed.tick();
  for (let i = 0; i < 8; i++) await Promise.resolve();
  TestBed.tick();
}

describe('queryResources', () => {
  it('keeps typed input identity available before data and after a failed read', async () => {
    const items = signal([{id: 1, label: 'first'}]);
    const pending = new Subject<string>();
    const rows = TestBed.runInInjectionContext(() =>
      queryResources(items, (item) => ({key: ['identity', item.id], loader: () => pending})),
    );
    await settle();
    const row = rows()[0];
    expectTypeOf(row.item()).toEqualTypeOf<{id: number; label: string}>();
    expect(row.item().label).toBe('first');
    expect(row.value()).toBeUndefined();
    pending.error(new Error('unavailable'));
    await settle();
    expect(row.isInitialError()).toBe(true);
    items.set([{id: 1, label: 'updated'}]);
    await settle();
    expect(rows()[0]).toBe(row);
    expect(row.item().label).toBe('updated');
    expect(row.value()).toBeUndefined();
  });
  it('does nothing for empty inputs and cannot restart after explicit destruction', async () => {
    const ids = signal<number[]>([]);
    const loader = vi.fn(() => of(1));
    const rows = TestBed.runInInjectionContext(() => queryResources(ids, (id) => ({key: ['empty', id], loader})));
    await settle();
    expect(rows()).toEqual([]);
    expect(loader).not.toHaveBeenCalled();
    rows.destroy();
    ids.set([1, 1]);
    await settle();
    expect(rows()).toEqual([]);
    expect(loader).not.toHaveBeenCalled();
  });

  it('reuses canonical object keys and updates retained definitions without extra observers', async () => {
    const item = signal({key: {a: 1, b: 2}, value: 'old', tag: 'Old', staleTime: Infinity});
    const observe = vi.spyOn(client, 'observeQuery');
    const rows = TestBed.runInInjectionContext(() =>
      queryResources(
        () => [item()],
        (data) => ({
          key: ['canonical', data.key],
          tags: [{type: data.tag}],
          staleTime: data.staleTime,
          loader: () => of(data.value),
        }),
      ),
    );
    await settle();
    const ref = rows()[0];
    item.set({key: {b: 2, a: 1}, value: 'new', tag: 'New', staleTime: 0});
    await settle();
    expect(rows()[0]).toBe(ref);
    expect(observe).toHaveBeenCalledTimes(1);
    expect(ref.isStale()).toBe(true);
    client.invalidateTags([{type: 'New'}]);
    await settle();
    expect(ref.value()).toBe('new');
  });

  it('updates reactive polling on retained refs', async () => {
    vi.useFakeTimers();
    try {
      const interval = signal<number | undefined>(undefined);
      let count = 0;
      const loader = vi.fn(() => of(++count));
      const rows = TestBed.runInInjectionContext(() =>
        queryResources(
          () => [1],
          (id) => ({
            key: ['poll', id],
            loader,
            staleTime: Infinity,
          }),
          {pollInterval: interval},
        ),
      );
      await settle();
      const ref = rows()[0];
      interval.set(1000);
      await settle();
      await vi.advanceTimersByTimeAsync(1000);
      await settle();
      expect(loader).toHaveBeenCalledTimes(2);
      expect(rows()[0]).toBe(ref);
      interval.set(undefined);
      await settle();
      await vi.advanceTimersByTimeAsync(2000);
      expect(loader).toHaveBeenCalledTimes(2);
      rows.destroy();
    } finally {
      vi.useRealTimers();
    }
  });
  let client: QueryClient;
  beforeEach(() => {
    client = new QueryClient();
    TestBed.configureTestingModule({providers: [{provide: QUERY_CLIENT, useValue: client}]});
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    client.destroy();
  });

  it('loads independently, preserves refs on reorder, and removes old rows synchronously', async () => {
    const ids = signal([1, 2]);
    const loader = vi.fn((id: number) => of({id}));
    const rows = TestBed.runInInjectionContext(() =>
      queryResources(ids, (id) => ({
        key: ['items', id],
        loader: () => loader(id),
        staleTime: 30_000,
      })),
    );
    expectTypeOf(rows()).toEqualTypeOf<readonly QueryResourceItem<{id: number}, number>[]>();
    await settle();
    const [one, two] = rows();
    expect(rows().map((row) => row.value()?.id)).toEqual([1, 2]);
    ids.set([2, 1]);
    expect(rows()).toEqual([two, one]);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    ids.set([2, 3]);
    expect(rows()).toEqual([two]);
    await settle();
    expect(rows().map((row) => row.value()?.id)).toEqual([2, 3]);
    ids.set([]);
    expect(rows()).toEqual([]);
    await settle();
    client.invalidateTags([{type: 'unused'}]);
    await expect(one.execute()).rejects.toThrow('destroyed');
  });

  it('tears down removed observers and supports explicit destruction', async () => {
    const ids = signal([1]);
    const source = new Subject<number>();
    const rows = TestBed.runInInjectionContext(() =>
      queryResources(ids, (id) => ({
        key: ['pending', id],
        loader: () => source,
        cancelOnNoObservers: true,
      })),
    );
    await settle();
    expect(source.observed).toBe(true);
    ids.set([]);
    await settle();
    expect(source.observed).toBe(false);
    ids.set([2]);
    await settle();
    rows.destroy();
    expect(rows()).toEqual([]);
    expect(source.observed).toBe(false);
  });

  it('keeps partial failures separate and supports a caller injector', async () => {
    const rows = queryResources(
      () => [1, 2],
      (id) => ({
        key: ['partial', id],
        loader: () => {
          if (id === 2) return Promise.reject(new Error('unavailable'));
          return Promise.resolve(id);
        },
      }),
      {injector: TestBed.inject(Injector)},
    );
    await settle();
    expect(rows()[0].value()).toBe(1);
    expect(rows()[1].status()).toBe('error');
  });

  it('rejects duplicate canonical keys and recovers when the input is corrected', async () => {
    const ids = signal([1]);
    const rows = TestBed.runInInjectionContext(() =>
      queryResources(ids, (id) => ({
        key: ['duplicates', id],
        loader: () => of(id),
      })),
    );
    await settle();
    ids.set([1, 1]);
    expect(() => rows()).toThrow('Duplicate queryResources key');
    ids.set([1, 2]);
    await settle();
    expect(rows().map((row) => row.value())).toEqual([1, 2]);
  });

  it('releases collection observers when the owning injector is destroyed', async () => {
    const source = new Subject<number>();
    TestBed.runInInjectionContext(() =>
      queryResources(
        () => [1],
        (id) => ({
          key: ['owner', id],
          loader: () => source,
          cancelOnNoObservers: true,
        }),
      ),
    );
    await settle();
    expect(source.observed).toBe(true);
    TestBed.resetTestingModule();
    expect(source.observed).toBe(false);
  });
});
