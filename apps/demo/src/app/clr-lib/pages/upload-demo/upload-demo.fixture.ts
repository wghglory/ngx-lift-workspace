import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {isDevMode} from '@angular/core';
import {delay, of} from 'rxjs';

/** Lets the HttpClient upload demo work standalone; browser E2E routes still override this endpoint. */
export const uploadDemoStubInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isDevMode() || !request.url.startsWith('/api/upload/')) return next(request);
  const stubDisabled =
    typeof window !== 'undefined' && (window as unknown as {__uploadDemoStub?: boolean}).__uploadDemoStub === false;
  if (stubDisabled) return next(request);
  return of(new HttpResponse({status: 200, body: 'ok'})).pipe(delay(150));
};
