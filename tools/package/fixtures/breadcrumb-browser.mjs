// Installed Angular 21 render proof in a DOM host, separate from real-browser E2E.
import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {provideZoneChangeDetection, provideZonelessChangeDetection, VERSION} from '@angular/core';

const dom = new JSDOM('<html><body><breadcrumb-consumer></breadcrumb-consumer></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'customElements'])
  globalThis[key] = dom.window[key];
const mode = process.argv[2];
assert.ok(['zoneless', 'zone'].includes(mode));
assert.equal(VERSION.major, '21');
if (mode === 'zone') await import('zone.js/node');
else assert.equal(globalThis.Zone, undefined);
const {bootstrapApplication} = await import('@angular/platform-browser');
const {BreadcrumbConsumer, routerProviders} = await import('./key-value-compiled/breadcrumb-hosts.js');
const app = await bootstrapApplication(BreadcrumbConsumer, {
  providers: [routerProviders, mode === 'zone' ? provideZoneChangeDetection() : provideZonelessChangeDetection()],
});
try {
  await app.whenStable();
  const host = app.components[0].instance;
  const original = host.items()[0];
  const nav = document.querySelector('nav');
  assert.equal(nav.getAttribute('aria-label'), 'Breadcrumb');
  assert.equal(nav.querySelector('[aria-current]').textContent.trim(), 'Server');
  assert.equal(nav.querySelector('button').type, 'button');
  nav.querySelector('button').click();
  await app.whenStable();
  assert.equal(host.selected, original);
  assert.equal(host.submissions, 0);
  assert.equal(
    new URL(document.querySelector('nav[aria-label="SPA"] a').getAttribute('href'), dom.window.location.href).href,
    'http://localhost/database',
  );
  const deep = document.querySelector('nav[aria-label="Deep"]');
  assert.equal(deep.querySelectorAll('.trail > li:not(.overflow)').length, 3);
  assert.equal(deep.querySelectorAll('.panel-list li').length, 30);
  assert.equal(deep.querySelector('.panel-list a').getAttribute('href'), '/browse?key=0%2F%25');
  const disclosure = deep.querySelector('.overflow button');
  assert.equal(disclosure.type, 'button');
  assert.equal(disclosure.getAttribute('aria-expanded'), 'false');
  assert.equal(disclosure.getAttribute('aria-controls'), deep.querySelector('[popover]').id);
  host.items.set([{id: 'only', label: 'Current', href: '/ignored-current'}]);
  await app.whenStable();
  assert.equal(nav.querySelectorAll('a,button').length, 0);
  host.items.set([]);
  await app.whenStable();
  assert.equal(document.querySelectorAll('nav').length, 2);
  assert.deepEqual(host.locations, [
    {kind: 'prefix', bucket: 'bucket-1', prefix: '/'},
    {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/'},
    {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/雪/'},
    {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/雪/../'},
    {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/雪/../marker/'},
    {kind: 'object', bucket: 'bucket-1', key: '/%2F/雪/../marker/'},
  ]);
  assert.equal(new Set(host.generated.map((item) => item.id)).size, 6);
  assert.equal(host.generated.at(-1).href, '/object?key=%2F%252F%2F%E9%9B%AA%2F..%2Fmarker%2F');
  assert.equal(host.generated.at(-2).context, '/%2F/雪/../marker/');
  host.items.set(host.generated);
  await app.whenStable();
  const generatedNav = document.querySelector('nav:not([aria-label="SPA"])');
  assert.equal(generatedNav.querySelector('[aria-current]').textContent.trim(), '(empty)');
  assert.equal(generatedNav.querySelector('a').getAttribute('href'), '/browse?prefix=%2F');
  console.log(
    'Packed exact-key helper: public types, discriminants, callback scope/data and rendering passed (' + mode + ').',
  );
  console.log(
    `Packed breadcrumb: Angular 21 strict templates, routing, action identity, form safety, replacement (${mode}) passed.`,
  );
} finally {
  app.destroy();
  dom.window.close();
}
