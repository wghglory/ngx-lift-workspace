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
  host.items.set([{id: 'only', label: 'Current', href: '/ignored-current'}]);
  await app.whenStable();
  assert.equal(nav.querySelectorAll('a,button').length, 0);
  host.items.set([]);
  await app.whenStable();
  assert.equal(document.querySelectorAll('nav').length, 1);
  console.log(
    `Packed breadcrumb: Angular 21 strict templates, routing, action identity, form safety, replacement (${mode}) passed.`,
  );
} finally {
  app.destroy();
  dom.window.close();
}
