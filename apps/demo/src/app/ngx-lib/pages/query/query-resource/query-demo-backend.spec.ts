import {HttpErrorResponse, HttpRequest, HttpResponse} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {DemoDatabase, QueryDemoBackend} from './query-demo-backend';

describe('QueryDemoBackend', () => {
  let backend: QueryDemoBackend;

  beforeEach(() => {
    vi.useFakeTimers();
    backend = new QueryDemoBackend();
  });
  afterEach(() => vi.useRealTimers());

  function request(method: string, url: string, body: unknown = null) {
    return firstValueFrom(backend.handle(new HttpRequest(method, url, body)));
  }

  async function response(method: string, url: string, body: unknown = null) {
    const pending = request(method, url, body);
    await vi.advanceTimersByTimeAsync(300);
    const event = await pending;
    if (!(event instanceof HttpResponse)) throw new Error('Expected a completed HTTP response');
    expect(event.status).toBe(200);
    return event.body;
  }

  it.each(['a', 'b'])('serves tenant %s and its independent resources', async (id) => {
    const url = `/query-demo/tenants/${id}`;
    expect(await response('GET', url)).toEqual({id, name: `queryExamples.tenant${id.toUpperCase()}`});
    expect(await response('GET', `${url}/health`)).toEqual({state: 'healthy', tenantId: id});
    expect(await response('GET', `${url}/preferences`)).toEqual({theme: 'dark', tenantId: id});
    expect(await response('GET', `${url}/databases`)).toEqual([expect.objectContaining({id: id === 'a' ? 1 : 2})]);
    expect(backend.requests()[`GET ${url}`]).toBe(1);
  });

  it('counts subscribed requests and cancels delivery when the caller unsubscribes', async () => {
    const request = new HttpRequest('GET', '/query-demo/tenants/a');
    const stream = backend.handle(request);
    expect(backend.requests()).toEqual({});
    const next = vi.fn();
    const subscription = stream.subscribe(next);
    expect(backend.requests()['GET /query-demo/tenants/a']).toBe(1);
    subscription.unsubscribe();
    await vi.advanceTimersByTimeAsync(300);
    expect(next).not.toHaveBeenCalled();
    await response('GET', request.url);
    expect(backend.requests()['GET /query-demo/tenants/a']).toBe(2);
  });

  it('creates trimmed database names without changing another tenant or exposing stored objects', async () => {
    const a = '/query-demo/tenants/a/databases';
    const b = '/query-demo/tenants/b/databases';
    expect(await response('POST', a, {name: '  Reporting  '})).toEqual({id: 3, name: 'Reporting'});
    expect(await response('POST', b, {name: 'Analytics'})).toEqual({id: 4, name: 'Analytics'});
    const first = (await response('GET', a)) as DemoDatabase[];
    expect(first.map((database) => database.name)).toEqual(['Tenant A database', 'Reporting']);
    first[0].name = 'Changed by the reader';
    const again = (await response('GET', a)) as DemoDatabase[];
    expect(again[0].name).toBe('Tenant A database');
    const other = (await response('GET', b)) as DemoDatabase[];
    expect(other.map((database) => database.name)).toEqual(['Tenant B database', 'Analytics']);
  });

  it.each([null, {}, {name: 7}, {name: ''}, {name: '   '}])('rejects invalid database payload %j', async (body) => {
    const pending = expect(request('POST', '/query-demo/tenants/a/databases', body)).rejects.toMatchObject({
      status: 400,
    });
    await vi.advanceTimersByTimeAsync(300);
    await pending;
    expect(await response('GET', '/query-demo/tenants/a/databases')).toHaveLength(1);
  });

  it.each([
    ['GET', '/unknown', 404],
    ['GET', '/query-demo/tenants/c', 404],
    ['DELETE', '/query-demo/tenants/a', 405],
    ['POST', '/query-demo/tenants/a/health', 405],
  ] as const)('rejects unsupported request %s %s', async (method, url, status) => {
    const failed = request(method, url);
    const pending = expect(failed).rejects.toMatchObject({status});
    await vi.advanceTimersByTimeAsync(300);
    await pending;
    await expect(failed).rejects.toBeInstanceOf(HttpErrorResponse);
  });

  it('fails only the next tenant read, preserving child reads and allowing recovery', async () => {
    backend.failNextTenant = true;
    expect(await response('GET', '/query-demo/tenants/a/health')).toEqual({state: 'healthy', tenantId: 'a'});
    expect(backend.failNextTenant).toBe(true);
    const failure = expect(request('GET', '/query-demo/tenants/a')).rejects.toMatchObject({status: 503});
    await vi.advanceTimersByTimeAsync(300);
    await failure;
    expect(backend.failNextTenant).toBe(false);
    expect(await response('GET', '/query-demo/tenants/a')).toEqual({id: 'a', name: 'queryExamples.tenantA'});
  });
});
