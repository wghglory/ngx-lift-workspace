import {HttpBackend, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {defer, map, Observable, timer} from 'rxjs';

export interface FailureDemoData {
  id: string;
  value: number;
}

/** Local failure fixtures; exceptions happen before a simulated write applies. */
@Injectable()
export class QueryFailureBackend extends HttpBackend {
  readonly requests = signal<Readonly<Record<string, number>>>({});
  readonly canceled = signal(0);
  readonly failures = new Map<string, number>([
    ['initial', 1],
    ['rows/b', 1],
  ]);
  failWrite = false;
  private value = 42;

  override handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    return defer(() => {
      const id = request.url.replace('/query-failure/', '');
      const key = `${request.method} ${id}`;
      this.requests.update((counts) => ({...counts, [key]: (counts[key] ?? 0) + 1}));
      if (id === 'deadline')
        return new Observable<HttpEvent<unknown>>(() => () => this.canceled.update((count) => count + 1));
      const fail = request.method === 'POST' ? this.failWrite : (this.failures.get(id) ?? 0) > 0;
      if (request.method === 'POST') this.failWrite = false;
      else if (fail) this.failures.set(id, (this.failures.get(id) ?? 0) - 1);
      return timer(200).pipe(
        map(() => {
          if (fail) throw new HttpErrorResponse({status: 503, statusText: 'Demo unavailable'});
          if (request.method === 'POST') this.value++;
          return new HttpResponse({body: {id, value: id === 'refresh' || request.method === 'POST' ? this.value : 42}});
        }),
      );
    });
  }
}
