import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Component, ChangeDetectionStrategy, inject, provideZonelessChangeDetection, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {QUERY_CLIENT, provideQueryClient, queryResource, queryResources, mutateResource} from 'ngx-lift';

const dom = new JSDOM('<html><body><query-consumer></query-consumer></body></html>', {pretendToBeVisual: true});
for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'customElements']) {
  globalThis[key] = dom.window[key];
}
const {bootstrapApplication} = await import('@angular/platform-browser');
const reads = new Map();
const counts = new Map();
let cancellations = 0;
let finishWrite;

class QueryConsumer {
  client = inject(QUERY_CLIENT);
  session = signal('session-a');
  ids = signal([1, 2]);
  query = queryResource(() => {
    const scope = this.session();
    if (!scope) return undefined;
    return {
      key: ['session-data', scope],
      tags: [{type: 'SessionData', scope}],
      staleTime: 30_000,
      cancelOnNoObservers: true,
      loader: () =>
        new Observable((subscriber) => {
          counts.set(scope, (counts.get(scope) ?? 0) + 1);
          let settled = false;
          reads.set(scope, {
            resolve: (value) => {
              settled = true;
              subscriber.next(value);
            },
            reject: (error) => {
              settled = true;
              subscriber.error(error);
            },
          });
          return () => {
            if (!settled) cancellations++;
          };
        }),
    };
  });
  rows = queryResources(this.ids, (id) => ({key: ['rows', id], staleTime: 30_000, loader: () => of(id)}));
  save = mutateResource(
    () =>
      new Promise((resolve) => {
        finishWrite = resolve;
      }),
    {
      invalidatesTags: (_result, args) => [{type: 'SessionData', scope: args.scope}],
    },
  );
  changeSession(scope) {
    const previous = this.session();
    this.session.set(undefined);
    this.client.removeQueries((key) => key[0] === 'session-data' && key[1] === previous);
    this.session.set(scope);
  }
}
Component({
  selector: 'query-consumer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:
    '<p>{{ query.value() }} / {{ query.status() }}</p>@for (row of rows(); track row.key) {<span>{{ row.value() }}</span>}',
})(QueryConsumer);

async function until(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, 'Angular consumer did not reach the expected state');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

const app = await bootstrapApplication(QueryConsumer, {
  providers: [provideZonelessChangeDetection(), provideQueryClient({queryDefaults: {deadlineMs: 2000}})],
});
try {
  const instance = app.components[0].instance;
  await until(() => counts.get('session-a') === 1 && instance.rows().length === 2);
  instance.changeSession(undefined);
  assert.equal(instance.query.value(), undefined);
  assert.equal(instance.query.status(), 'idle');
  await until(() => cancellations === 1);
  reads.get('session-a').resolve('obsolete secret');
  instance.changeSession('session-b');
  await until(() => counts.get('session-b') === 1);
  reads.get('session-b').resolve('current data');
  await until(() => dom.window.document.body.textContent.includes('current data / resolved'));
  assert.ok(!dom.window.document.body.textContent.includes('obsolete secret'));

  instance.query.reload();
  reads.get('session-b').reject(new Error('refresh unavailable'));
  await until(() => instance.query.isRefreshError());
  assert.equal(instance.query.value(), 'current data');
  instance.query.reload();
  reads.get('session-b').resolve('recovered');
  await until(() => instance.query.status() === 'resolved' && instance.query.value() === 'recovered');

  const originalRows = instance.rows();
  instance.ids.set([2, 1]);
  await until(() => instance.rows()[0] === originalRows[1]);
  instance.ids.set([]);
  await until(() => instance.rows().length === 0);

  const write = instance.save.mutate({scope: 'session-b'});
  instance.changeSession('session-c');
  await until(() => counts.get('session-c') === 1);
  reads.get('session-c').resolve('new session');
  await until(() => instance.query.value() === 'new session');
  finishWrite({ok: true});
  await write;
  assert.equal(counts.get('session-c'), 1, 'old-scope write must not refresh the new session');
  instance.changeSession('session-d');
  await until(() => counts.get('session-d') === 1);
  app.destroy();
  await until(() => cancellations === 2);
  assert.equal(instance.client.getDiagnostics().entryCount, 0);
  console.log(
    'Installed Angular query consumer: session isolation, cancellation, recovery, collections and scoped writes passed.',
  );
} finally {
  if (!app.destroyed) app.destroy();
  dom.window.close();
}
