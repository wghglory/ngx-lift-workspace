// Installed package lifecycle checks in Node/JSDOM, run in zoneless and ZoneJS modes.
// Copied into an isolated installation and executed by verify-packages.mjs.
import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Component, provideZoneChangeDetection, provideZonelessChangeDetection, signal} from '@angular/core';
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

class FormConsumer {
  form = new FormGroup({
    name: new FormControl('Ada', {nonNullable: true}),
    confirmation: new FormControl('secret', {nonNullable: true}),
  });
  facade = toSignalForm(this.form, {omit: ['confirmation']});
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

  app.destroy();
  console.log(
    `Installed toSignalForm consumer (${mode}): typed facade, submit shaping, dynamic controls and cleanup passed.`,
  );
} finally {
  if (!app.destroyed) app.destroy();
  dom.window.close();
}
