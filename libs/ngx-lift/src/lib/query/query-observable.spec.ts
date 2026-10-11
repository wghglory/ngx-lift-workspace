import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {EMPTY, EmptyError, firstValueFrom, of, Subject} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryClient} from './query-client';
import {fetchQueryObservable, observableLoader, observeQueryObservable} from './query-observable';

async function settle(): Promise<void> {
  for (let index = 0; index < 8; index++) {
    await Promise.resolve();
  }
}

describe('query Observable adapters', () => {
  let client: QueryClient;
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([(request, next) => next(request.clone({setHeaders: {'X-Query': 'test'}}))]),
        ),
        provideHttpClientTesting(),
      ],
    });
    client = new QueryClient();
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    client.destroy();
    controller.verify();
    TestBed.resetTestingModule();
  });

  it('preserves HttpClient interceptors and shares cold subscriptions', async () => {
    const definition = {
      key: ['bindings'],
      staleTime: 5000,
      loader: observableLoader(() => http.get('/api/bindings')),
    };
    const source = fetchQueryObservable(client, definition);
    controller.expectNone('/api/bindings');
    const first = firstValueFrom(source);
    const second = firstValueFrom(source);
    await settle();
    const request = controller.expectOne('/api/bindings');
    expect(request.request.headers.get('X-Query')).toBe('test');
    request.flush({values: [1]});
    expect(await first).toEqual({values: [1]});
    expect(await second).toEqual({values: [1]});
    expect(await firstValueFrom(source)).toEqual({values: [1]});
    controller.expectNone('/api/bindings');
  });

  it('unsubscribes the HttpClient request when its shared loader is aborted', async () => {
    const abortController = new AbortController();
    const result = observableLoader(() => http.get('/api/bindings'))({
      abortSignal: abortController.signal,
      refresh: false,
    });
    const rejected = expect(result).rejects.toMatchObject({name: 'AbortError'});
    const request = controller.expectOne('/api/bindings');
    abortController.abort();
    expect(request.cancelled).toBe(true);
    await rejected;
  });

  it('does not start an Observable when the loader is already aborted', async () => {
    const abortController = new AbortController();
    abortController.abort();
    const factory = vi.fn(() => of(1));
    await expect(
      observableLoader(factory)({abortSignal: abortController.signal, refresh: false}),
    ).rejects.toMatchObject({
      name: 'AbortError',
    });
    expect(factory).not.toHaveBeenCalled();
  });

  it('rejects empty reads and forwards synchronous factory errors', async () => {
    const context = {abortSignal: new AbortController().signal, refresh: false};
    await expect(observableLoader(() => EMPTY)(context)).rejects.toBeInstanceOf(EmptyError);
    const failure = new Error('factory failed');
    await expect(
      observableLoader(() => {
        throw failure;
      })(context),
    ).rejects.toBe(failure);
  });

  it('settles once and unsubscribes after the first synchronous value', async () => {
    const source = new Subject<number>();
    const result = observableLoader(() => source)({abortSignal: new AbortController().signal, refresh: true});
    source.next(1);
    source.next(2);
    expect(await result).toBe(1);
    expect(source.observed).toBe(false);
    expect(await observableLoader(() => of(3, 4))({abortSignal: new AbortController().signal, refresh: false})).toBe(3);
  });

  it('does not cancel shared transport when one Observable caller unsubscribes', async () => {
    const definition = {key: ['bindings'], loader: observableLoader(() => http.get('/api/bindings'))};
    const first = fetchQueryObservable(client, definition).subscribe();
    const second = firstValueFrom(fetchQueryObservable(client, definition));
    await settle();
    const request = controller.expectOne('/api/bindings');
    first.unsubscribe();
    expect(request.cancelled).toBe(false);
    request.flush({values: [2]});
    expect(await second).toEqual({values: [2]});
  });

  it('observes shared state and unregisters on unsubscribe', async () => {
    const loader = vi.fn(async () => 1);
    const definition = {key: ['bindings'], loader, tags: [{type: 'Bindings'}]};
    const snapshots: string[] = [];
    const subscription = observeQueryObservable(client, definition).subscribe((snapshot) =>
      snapshots.push(snapshot.status),
    );
    await settle();
    expect(snapshots).toContain('loading');
    expect(snapshots.at(-1)).toBe('resolved');
    subscription.unsubscribe();
    client.invalidateTags([{type: 'Bindings'}]);
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('completes when its initial snapshot removes the query synchronously', () => {
    const loader = vi.fn(async () => 'old scope');
    const complete = vi.fn();
    let removed = false;
    const subscription = observeQueryObservable(client, {key: ['bindings'], loader}).subscribe({
      next: () => {
        if (removed) return;
        removed = true;
        client.removeQueries();
      },
      complete,
    });
    expect(loader).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1);
    expect(subscription.closed).toBe(true);
  });

  it('completes on explicit removal and can observe a recreated query after resubscription', async () => {
    const loader = vi.fn(async () => loader.mock.calls.length);
    const definition = {key: ['bindings'], loader, staleTime: 60000};
    const source = observeQueryObservable(client, definition);
    const complete = vi.fn();
    source.subscribe({complete});
    await settle();
    client.removeQueries();
    expect(complete).toHaveBeenCalledTimes(1);
    const values: number[] = [];
    const recreated = source.subscribe((snapshot) => {
      if (snapshot.hasValue) {
        values.push(snapshot.value as number);
      }
    });
    await settle();
    expect(values.at(-1)).toBe(2);
    recreated.unsubscribe();
  });
});
