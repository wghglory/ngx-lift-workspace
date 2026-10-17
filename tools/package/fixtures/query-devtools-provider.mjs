import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  provideEnvironmentInitializer,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {QUERY_CLIENT, QueryClient} from 'ngx-lift';

const dom = new JSDOM('<html><body><provider-consumer></provider-consumer></body></html>', {pretendToBeVisual: true});
for (const key of [
  'document',
  'window',
  'HTMLElement',
  'Element',
  'Node',
  'Event',
  'CustomEvent',
  'customElements',
  'MutationObserver',
])
  globalThis[key] = dom.window[key];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
const {provideQueryDevtools} = await import('clr-lift/devtools');
const {bootstrapApplication} = await import('@angular/platform-browser');
const mode = process.argv[2];
const development = process.argv[3] === 'development';
if (mode === 'zone') await import('zone.js/node');
class ProviderConsumer {}
Component({selector: 'provider-consumer', standalone: true, template: '<p>Application content</p>'})(ProviderConsumer);
const client = new QueryClient();
await client.fetchQuery({key: ['provider-owned'], loader: () => Promise.resolve(42)});
const app = await bootstrapApplication(ProviderConsumer, {
  providers: [
    mode === 'zone' ? provideZoneChangeDetection() : provideZonelessChangeDetection(),
    provideNoopAnimations(),
    {provide: QUERY_CLIENT, useValue: client},
    provideEnvironmentInitializer(() => {
      // A discarded injector must not reserve installation before its first render.
      const abandoned = createEnvironmentInjector([provideQueryDevtools()], inject(EnvironmentInjector));
      abandoned.destroy();
    }),
    provideQueryDevtools(),
    provideQueryDevtools(),
  ],
});
try {
  await app.whenStable();
  const deadline = Date.now() + 3000;
  while (development && !dom.window.document.querySelector('cll-query-devtools-root button')) {
    assert.ok(Date.now() < deadline, 'Development provider did not mount a launcher');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.equal(dom.window.document.querySelectorAll('cll-query-devtools-root').length, development ? 1 : 0);
  assert.equal(client.getDiagnostics().totalObserverCount, 0);
  app.destroy();
  assert.equal(dom.window.document.querySelectorAll('cll-query-devtools-root').length, 0);
  assert.equal(client.getDiagnostics().isDestroyed, false);
  console.log(
    `Installed provider (${mode}, ${development ? 'development' : 'default'}): conditional export, deduplication and teardown passed.`,
  );
} finally {
  if (!app.destroyed) app.destroy();
  client.destroy();
  dom.window.close();
}
