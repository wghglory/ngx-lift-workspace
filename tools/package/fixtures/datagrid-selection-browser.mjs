// Installed Angular 21 DOM render proof; real-browser coverage lives in demo-e2e.
import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {provideZoneChangeDetection, provideZonelessChangeDetection, VERSION} from '@angular/core';
const virtualConsole = new VirtualConsole();
// jsdom cannot parse CDK's CSS @layer. Rendering/assertion failures still propagate.
virtualConsole.on('jsdomError', (error) => {
  if (error.type !== 'css-parsing' && !String(error.message).includes('Could not parse CSS')) throw error;
});
const dom = new JSDOM('<html><body><selection-consumer></selection-consumer></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  virtualConsole,
});
for (const key of [
  'document',
  'window',
  'HTMLElement',
  'Element',
  'Node',
  'Event',
  'FocusEvent',
  'KeyboardEvent',
  'CustomEvent',
  'customElements',
  'getComputedStyle',
])
  globalThis[key] =
    typeof dom.window[key] === 'function' && key === 'getComputedStyle'
      ? dom.window[key].bind(dom.window)
      : dom.window[key];
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
};
const mode = process.argv[2];
assert.ok(['zoneless', 'zone'].includes(mode));
assert.equal(VERSION.major, '21');
if (mode === 'zone') await import('zone.js/node');
const {bootstrapApplication} = await import('@angular/platform-browser');
const {provideNoopAnimations} = await import('@angular/platform-browser/animations');
const {SelectionConsumer} = await import('./key-value-compiled/datagrid-selection-hosts.js');
const app = await bootstrapApplication(SelectionConsumer, {
  providers: [
    provideNoopAnimations(),
    mode === 'zone' ? provideZoneChangeDetection() : provideZonelessChangeDetection(),
  ],
});
const settle = async () => {
  await app.whenStable();
  await new Promise((resolve) => setTimeout(resolve));
  await app.whenStable();
};
try {
  await settle();
  const owner = app.components[0].instance;
  const field = document.querySelector('cll-datagrid-selection');
  const inputs = () => [...field.querySelectorAll('input[type=checkbox]')].slice(1);
  assert.deepEqual(
    inputs().map((input) => input.checked),
    [false, true],
  );
  const changes = [];
  const subscription = owner.form.controls.ids.valueChanges.subscribe((value) => changes.push(value));
  inputs()[0].click();
  await settle();
  assert.deepEqual(owner.form.controls.ids.value, ['org-2', 'missing', 'org-1']);
  assert.equal(changes.length, 1);
  owner.items.update((items) => items.map((item) => ({...item})));
  await settle();
  assert.equal(changes.length, 1);
  owner.loading.set(true);
  await settle();
  assert.ok(inputs().every((input) => input.disabled));
  assert.equal(owner.form.controls.ids.enabled, true);
  owner.loading.set(false);
  owner.readonly.set(true);
  await settle();
  assert.ok(inputs().every((input) => input.disabled));
  owner.readonly.set(false);
  owner.form.controls.ids.disable();
  await settle();
  assert.equal(owner.sf.submitValue().ids, undefined);
  owner.form.controls.ids.enable();
  owner.form.reset();
  await settle();
  assert.deepEqual(owner.form.controls.ids.value, ['org-2', 'missing']);
  const picker = document.querySelector('installed-picker');
  picker.querySelector('clr-dg-row input').focus();
  picker.querySelector('clr-dg-row input').click();
  await settle();
  assert.deepEqual(owner.form.controls.picker.value, []);
  document.getElementById('outside').focus();
  await settle();
  assert.deepEqual(owner.form.controls.picker.value, ['org-1']);
  const fields = [...document.querySelectorAll('cll-datagrid-selection')];
  fields[2].querySelector('input[type=radio]').click();
  await settle();
  assert.equal(owner.single.value, 'org-1');
  fields[2].querySelector('button').click();
  await settle();
  assert.equal(owner.single.value, null);
  assert.equal(owner.single.hasError('required'), true);
  fields[3].querySelector('input[type=radio]').click();
  await settle();
  assert.equal(owner.model, 'org-1');
  subscription.unsubscribe();
  const ids = fields.map((field) => field.querySelector('.field-label > label').id);
  assert.equal(new Set(ids).size, 4);
  assert.ok(fields.every((field) => field.querySelector('[role=grid]').getAttribute('aria-labelledby')));
  console.log(
    `Packed datagrid selection: Angular 21 strict templates, native grids, direct/picker/ngModel/facade ownership, no-echo, loading, disabled, readonly, reset and ${mode} passed.`,
  );
} finally {
  app.destroy();
  dom.window.close();
}
