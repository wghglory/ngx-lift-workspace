import {HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {concat, defer, of, throwError, timer} from 'rxjs';
import {map, switchMap} from 'rxjs';

const objects = new Set<string>();

/** Demo-only in-memory proxy simulation. It stores keys, not file contents; reload clears them. */
export const s3UploadDemoInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/s3/')) return next(request);
  const disabled =
    typeof window !== 'undefined' && (window as unknown as {__s3UploadDemoStub?: boolean}).__s3UploadDemoStub === false;
  if (disabled) return next(request);
  if (request.method !== 'PUT' || !(request.body instanceof Blob)) return next(request);
  const size = request.body.size;
  return concat(
    of({type: HttpEventType.Sent} as const),
    timer(150).pipe(
      map(() => ({type: HttpEventType.UploadProgress, loaded: Math.floor(size / 2), total: size}) as const),
    ),
    timer(150).pipe(
      switchMap(() =>
        defer(() => {
          if (request.headers.get('If-None-Match') === '*' && objects.has(request.url)) {
            return throwError(() => new HttpErrorResponse({status: 412, url: request.url}));
          }
          objects.add(request.url);
          return of(new HttpResponse({status: 200, body: ''}));
        }),
      ),
    ),
  );
};
