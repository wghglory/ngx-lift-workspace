// Installed package lifecycle checks in Node/JSDOM, run in zoneless and ZoneJS modes.
// Copied into an isolated installation and executed by verify-packages.mjs.
import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {
  Component,
  EventEmitter,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {toSignalForm} from 'ngx-lift';

const dom = new JSDOM('<html><body><form-consumer></form-consumer></body></html>', {pretendToBeVisual: true});
for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'customElements']) {
  globalThis[key] = dom.window[key];
}
const {bootstrapApplication} = await import('@angular/platform-browser');
const mode = process.argv[2] ?? 'zoneless';
assert.ok(['zoneless', 'zone'].includes(mode), `Unknown rendering mode: ${mode}`);
if (mode === 'zone') await import('zone.js/node');
else assert.equal(globalThis.Zone, undefined, 'Zoneless consumer must run without ZoneJS');

function createFacade(form, valueStream, statusStream) {
  Object.defineProperty(form, 'valueChanges', {value: valueStream});
  Object.defineProperty(form, 'statusChanges', {value: statusStream});
  return toSignalForm(form, {omit: ['confirmation']});
}

class FormConsumer {
  valueStream = new EventEmitter();
  statusStream = new EventEmitter();
  form = new FormGroup({
    name: new FormControl('Ada', {nonNullable: true}),
    confirmation: new FormControl('secret', {nonNullable: true}),
  });
  facade = createFacade(this.form, this.valueStream, this.statusStream);
  includeNote = signal(false);

  constructor() {
    this.facade.bindIf('note', this.includeNote, () => new FormControl('draft', {nonNullable: true}), {
      preserveValue: true,
    });
  }
}
Component({selector: 'form-consumer', template: ''})(FormConsumer);

const app = await bootstrapApplication(FormConsumer, {
  providers: [mode === 'zone' ? provideZoneChangeDetection() : provideZonelessChangeDetection()],
});
async function until(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, 'Installed toSignalForm consumer did not reach the expected state');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

try {
  const instance = app.components[0].instance;
  assert.equal(instance.facade.fields.name.value(), 'Ada');
  assert.deepEqual(instance.facade.submitValue(), {name: 'Ada'});
  assert.equal(instance.facade.controls.name.value, instance.form.controls.name.value);

  instance.facade.controls.name.setValue('Grace');
  assert.equal(instance.facade.fields.name.value(), 'Grace');
  assert.deepEqual(instance.facade.submitValue(), {name: 'Grace'});

  instance.includeNote.set(true);
  await until(() => instance.facade.hasControl('note'));
  instance.facade.controls.note.setValue('saved');
  instance.includeNote.set(false);
  await until(() => !instance.facade.hasControl('note'));
  instance.includeNote.set(true);
  await until(() => instance.facade.hasControl('note'));
  assert.equal(instance.facade.fields.note.value(), 'saved');

  const failure = new Error('installed value stream failed');
  const reported = [];
  const originalConsoleError = console.error;
  console.error = (...args) => reported.push(args);
  try {
    instance.valueStream.error(failure);
    assert.throws(
      () => instance.facade.value(),
      (error) => error === failure,
    );
    assert.equal(reported.length, 0, 'The library must not print source errors');
  } finally {
    console.error = originalConsoleError;
  }

  app.destroy();
  assert.equal(app.destroyed, true, 'Installed consumer must be destroyed');
  instance.statusStream.error(new Error('late status stream failure'));
  assert.equal(instance.facade.valid(), true, 'A destroyed consumer must stop observing source errors');
  console.log(
    `Installed toSignalForm consumer (${mode}): typed facade, submit shaping, dynamic controls, error propagation and cleanup passed.`,
  );
} finally {
  if (!app.destroyed) app.destroy();
  dom.window.close();
}
