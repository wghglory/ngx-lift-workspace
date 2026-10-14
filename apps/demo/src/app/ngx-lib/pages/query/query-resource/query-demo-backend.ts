import {HttpBackend, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {defer, map, Observable, timer} from 'rxjs';

export interface DemoDatabase {
  id: number;
  name: string;
}
export interface DemoTenant {
  id: string;
  name: string;
}

/** Local HTTP fixture for the query examples; each page owns its data and counters. */
@Injectable()
export class QueryDemoBackend extends HttpBackend {
  readonly requests = signal<Readonly<Record<string, number>>>({});
  failNextTenant = false;
  private nextId = 3;
  private readonly databases = new Map<string, DemoDatabase[]>([
    ['a', [{id: 1, name: 'Tenant A database'}]],
    ['b', [{id: 2, name: 'Tenant B database'}]],
  ]);

  override handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    return defer(() => {
      const key = `${request.method} ${request.url}`;
      this.requests.update((counts) => ({...counts, [key]: (counts[key] ?? 0) + 1}));
      const match = /^\/query-demo\/tenants\/([ab])(?:\/(databases|health|preferences))?$/.exec(request.url);
      const fail = !match?.[2] && this.failNextTenant;
      if (fail) this.failNextTenant = false;
      return timer(300).pipe(
        map(() => {
          if (!match) throw new HttpErrorResponse({status: 404, statusText: 'Unknown demo endpoint'});
          if (fail) throw new HttpErrorResponse({status: 503, statusText: 'Tenant temporarily unavailable'});
          const [, tenantId, resource] = match;
          let body: unknown;
          if (request.method === 'GET') {
            if (resource === 'databases') body = this.databases.get(tenantId)?.map((database) => ({...database}));
            else if (resource === 'health') body = {state: 'healthy', tenantId};
            else if (resource === 'preferences') body = {theme: 'dark', tenantId};
            else body = {id: tenantId, name: `Tenant ${tenantId.toUpperCase()}`};
          } else if (request.method === 'POST' && resource === 'databases') {
            const payload = request.body as {name?: unknown} | null;
            if (typeof payload?.name !== 'string' || !payload.name.trim()) {
              throw new HttpErrorResponse({status: 400, statusText: 'Database name is required'});
            }
            const database = {id: this.nextId++, name: payload.name.trim()};
            this.databases.get(tenantId)?.push(database);
            body = database;
          } else throw new HttpErrorResponse({status: 405, statusText: 'Method not allowed'});
          return new HttpResponse({status: 200, body});
        }),
      );
    });
  }
}
