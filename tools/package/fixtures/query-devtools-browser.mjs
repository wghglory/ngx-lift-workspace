import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {
  Component,
  enableProdMode,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {QueryClient} from 'ngx-lift';

const dom = new JSDOM('<html><body><devtools-consumer></devtools-consumer></body></html>', {pretendToBeVisual: true});
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
]) {
  globalThis[key] = dom.window[key];
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
// JSDOM has no layout engine; real modal sizing is covered by Playwright.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
const {QueryDevtoolsComponent} = await import('clr-lift');
const {bootstrapApplication} = await import('@angular/platform-browser');
const mode = process.argv[2] ?? 'zoneless';
assert.ok(['zoneless', 'zone'].includes(mode));
if (mode === 'zone') await import('zone.js/node');
else assert.equal(globalThis.Zone, undefined);
enableProdMode();

let reads = 0;
const scopedClient = new QueryClient();
await scopedClient.fetchQuery({
  key: ['installed-devtools'],
  loader: () => {
    reads++;
    return Promise.resolve('cached');
  },
});

class DevtoolsConsumer {
  enabled = signal(true);
  scopedClient = scopedClient;
}
Component({
  selector: 'devtools-consumer',
  standalone: true,
  imports: [QueryDevtoolsComponent],
  template:
    '<cll-query-devtools /><div id="explicit"><cll-query-devtools [enabled]="enabled()" [client]="scopedClient" /></div>',
})(DevtoolsConsumer);

async function until(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, 'Installed query devtools did not reach the expected state');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

const app = await bootstrapApplication(DevtoolsConsumer, {
  providers: [
    mode === 'zone' ? provideZoneChangeDetection() : provideZonelessChangeDetection(),
    provideNoopAnimations(),
  ],
});
try {
  await until(() => dom.window.document.querySelector('#explicit button'));
  const defaultComponent = dom.window.document.querySelector('cll-query-devtools');
  assert.equal(defaultComponent.querySelector('button'), null, 'Production mode must hide the default trigger');
  dom.window.document.querySelector('#explicit button').click();
  await until(() => dom.window.document.body.textContent.includes('installed-devtools'));
  assert.equal(reads, 1, 'Inspecting diagnostics must not refetch application data');
  assert.equal(scopedClient.getDiagnostics().totalObserverCount, 0);
  const close = [...dom.window.document.querySelectorAll('button')].find(
    (button) => button.getAttribute('aria-label') === 'Close',
  );
  close.click();
  await until(() => !dom.window.document.querySelector('[role="region"]'));
  app.components[0].instance.enabled.set(false);
  await until(() => !dom.window.document.querySelector('#explicit button'));
  app.destroy();
  assert.equal(scopedClient.getDiagnostics().isDestroyed, false, 'The caller retains client ownership');
  console.log(
    `Installed query devtools (${mode}): production default, explicit opt-in, scoped client and cleanup passed.`,
  );
} finally {
  if (!app.destroyed) app.destroy();
  scopedClient.destroy();
  dom.window.close();
}
