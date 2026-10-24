// Real Angular DOM hosts from the installed packages, repeated in zoneless and ZoneJS modes.
import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {provideZoneChangeDetection, provideZonelessChangeDetection, VERSION} from '@angular/core';

const dom = new JSDOM('<html><body><key-value-consumer></key-value-consumer></body></html>', {pretendToBeVisual: true});
for (const key of [
  'document',
  'window',
  'HTMLElement',
  'Element',
  'Node',
  'Event',
  'InputEvent',
  'FocusEvent',
  'CustomEvent',
  'customElements',
])
  globalThis[key] = dom.window[key];
const mode = process.argv[2];
assert.ok(['zoneless', 'zone'].includes(mode));
assert.equal(VERSION.major, '21');
if (mode === 'zone') await import('zone.js/node');
else assert.equal(globalThis.Zone, undefined);
const {bootstrapApplication} = await import('@angular/platform-browser');
const {KeyValueConsumer} = await import('./key-value-compiled/key-value-hosts.js');
const app = await bootstrapApplication(KeyValueConsumer, {
  providers: [mode === 'zone' ? provideZoneChangeDetection() : provideZonelessChangeDetection()],
});
const host = app.components[0].instance;
const scope = (name) => document.querySelector(`[data-mode="${name}"]`);
const fields = (name) => [...scope(name).querySelectorAll('cll-key-value-control input')];
async function stable() {
  await app.whenStable();
}
async function edit(name, index, value) {
  const input = fields(name)[index];
  input.value = value;
  input.dispatchEvent(new Event('input', {bubbles: true}));
  await stable();
}
async function leave(name, internal = false) {
  fields(name)[0].dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: internal ? fields(name)[1] : scope(name).querySelector('button[type="submit"]'),
    }),
  );
  await stable();
}
async function submit(name) {
  scope(name).dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
  await stable();
}
try {
  await stable();
  assert.equal(host.typed.valid, true, 'typed false and arrays are valid');
  const typedValue = host.typed.value;
  const incompatible = [
    {key: 'count', value: false},
    {key: 'enabled', value: 3},
    {key: 'hosts', value: ['']},
  ];
  host.typed.setValue(incompatible);
  host.typed.markAllAsTouched();
  host.readonly.set(true);
  await stable();
  const typedRoot = document.querySelector('[data-typed]');
  assert.equal(host.typed.value, incompatible, 'incompatible values are preserved on load');
  assert.deepEqual(
    [...typedRoot.querySelectorAll('output code')].map((node) => node.textContent),
    ['false', '3', '[""]'],
  );
  assert.equal(host.typed.errors.keyValue.rows[2].value.arrayFormat, true);
  const retainedCheckbox = typedRoot.querySelector('input[type="checkbox"]');
  assert.ok(retainedCheckbox.getAttribute('aria-describedby').includes(typedRoot.querySelectorAll('output')[1].id));
  retainedCheckbox.click();
  await stable();
  assert.equal(host.typed.value, incompatible, 'readonly inspection never replaces incompatible values');
  host.readonly.set(false);
  await stable();
  const replacementArray = typedRoot.querySelector('textarea');
  replacementArray.value = 'one\ntwo';
  replacementArray.dispatchEvent(new Event('input', {bubbles: true}));
  await stable();
  assert.deepEqual(host.typed.value[2].value, ['one', 'two']);
  assert.equal(typedRoot.querySelectorAll('output').length, 2);
  host.typed.reset(typedValue);
  await stable();
  assert.equal(host.typed.valid, true);
  assert.equal(typedRoot.querySelectorAll('output').length, 0);
  const malformed = [null];
  host.typed.setValue(malformed);
  await stable();
  assert.equal(host.typed.value, malformed, 'malformed owner data is never rewritten');
  assert.deepEqual(host.typed.errors, {keyValue: {rows: [], structure: true}});
  assert.equal(document.querySelector('[data-typed] [data-add]').disabled, true);
  host.typed.setValue(typedValue);
  await stable();
  assert.equal(host.typed.valid, true, 'valid owner data restores editing');
  host.readonly.set(true);
  await stable();
  const checkbox = document.querySelector('[data-typed] clr-checkbox-wrapper input');
  assert.equal(checkbox.getAttribute('aria-readonly'), 'true');
  assert.equal(checkbox.disabled, false);
  checkbox.click();
  await stable();
  assert.equal(checkbox.checked, false);
  assert.equal(host.typed.value[1].value, false);
  host.readonly.set(false);
  await stable();
  const number = document.querySelector('[data-typed] input[type="number"]');
  number.value = '7';
  number.dispatchEvent(new Event('input', {bubbles: true}));
  await stable();
  assert.equal(host.typed.value[0].value, 7);
  assert.equal(host.typed.value[1].value, false);
  assert.deepEqual(host.typed.value[2].value, ['one', 'two']);
  assert.deepEqual(host.legacy.getRawValue(), host.legacyData, 'legacy caller-owned FormArray remains usable');
  const legacyKey = document.querySelector('[data-legacy] input');
  legacyKey.value = 'legacy-edited';
  legacyKey.dispatchEvent(new Event('input', {bubbles: true}));
  await stable();
  assert.equal(host.legacy.getRawValue()[0].key, 'legacy-edited');
  assert.equal(host.legacyData[0].key, 'legacy', 'editing does not mutate input data');
  host.legacy.disable();
  await stable();
  assert.equal(legacyKey.disabled, true, 'legacy Angular disabled propagation is preserved');
  host.legacy.enable();
  await stable();
  assert.equal(legacyKey.disabled, false);

  await edit('model', 0, 'model-edited');
  assert.deepEqual(host.model, [{key: 'model-edited', value: 'data'}]);
  await submit('model');
  assert.deepEqual(host.payload, {labels: host.model});
  scope('model').querySelector('[data-reset]').click();
  await stable();
  assert.deepEqual(host.model, host.initial);
  host.modelDisabled.set(true);
  await stable();
  assert.equal(scope('model').querySelector('fieldset').disabled, true);
  host.modelDisabled.set(false);
  await stable();

  let changes = 0;
  host.reactive.controls.labels.valueChanges.subscribe(() => changes++);
  const key = fields('reactive')[0];
  await edit('reactive', 0, 'blur-edited');
  assert.deepEqual(host.reactive.controls.labels.value, host.initial);
  await leave('reactive', true);
  assert.equal(host.reactive.controls.labels.touched, false);
  await leave('reactive');
  assert.equal(changes, 1);
  assert.deepEqual(host.reactive.controls.labels.value, [{key: 'blur-edited', value: 'data'}]);
  assert.equal(fields('reactive')[0], key, 'DOM row identity survives edits');
  host.reactive.reset();
  await stable();
  assert.equal(host.reactive.controls.labels.touched, false);
  assert.equal(fields('reactive')[0].value, 'team');
  await leave('reactive');
  assert.equal(host.reactive.controls.labels.touched, true);
  host.reactive.controls.labels.setValue([{key: 'external', value: 'write'}], {emitEvent: false});
  await stable();
  assert.equal(changes, 2, 'reset emitted once; owner write must not echo');
  assert.equal(fields('reactive')[0].value, 'external');
  host.readonly.set(true);
  await stable();
  await edit('reactive', 0, 'blocked');
  assert.equal(host.reactive.controls.labels.value[0].key, 'external');
  assert.equal(fields('reactive')[0].readOnly, true);
  host.readonly.set(false);
  host.reactive.controls.labels.disable();
  await stable();
  await submit('reactive');
  assert.deepEqual(host.payload, {sibling: 'enabled'});
  assert.equal(host.reactive.getRawValue().labels[0].key, 'external');
  host.reactive.controls.labels.enable();
  await stable();

  await edit('facade', 1, 'submit-edited');
  assert.deepEqual(host.facade.controls.labels.value, host.initial);
  await submit('facade');
  assert.deepEqual(host.payload, {labels: [{key: 'team', value: 'submit-edited'}], sibling: 'enabled'});
  assert.deepEqual(host.sf.value().labels, host.facade.controls.labels.value);
  await edit('facade', 0, '');
  await submit('facade');
  assert.equal(host.facade.invalid, true);
  await edit('facade', 0, 'corrected');
  await submit('facade');
  assert.equal(host.sf.status(), 'VALID');
  assert.equal(host.payload.labels[0].key, 'corrected');
  host.facade.controls.labels.disable();
  await stable();
  await submit('facade');
  assert.deepEqual(host.payload, {sibling: 'enabled'});
  host.facade.controls.labels.enable();
  host.facade.reset();
  await stable();
  assert.equal(host.facade.controls.labels.value, null);
  assert.equal(fields('facade').length, 0);
  assert.equal(host.facade.controls.labels.pristine, true);
  assert.deepEqual(host.initial, [{key: 'team', value: 'data'}]);
  console.log(
    `Installed Angular ${VERSION.full} key/value consumer (${mode}): strict templates, ngModel, typed Reactive Forms, toSignalForm, reset, touch, disabled, updateOn and legacy coexistence passed.`,
  );
} finally {
  app.destroy();
  dom.window.close();
}
