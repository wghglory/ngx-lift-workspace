import assert from 'node:assert/strict';
import test from 'node:test';
import {usedKeys, validateDictionary} from './check-translations.mjs';

test('checks missing messages, extra keys and placeholder drift', () => {
  assert.deepEqual(validateDictionary({save: 'Save {0}', submit: 'Submit'}, {save: '保存 {1}', extra: 'x'}), [
    'Placeholder mismatch: save',
    'Missing key: submit',
    'Unknown key: extra',
  ]);
});
test('partial locale declarations permit missing text without accepting malformed messages', () => {
  assert.deepEqual(validateDictionary({save: 'Save {0}', submit: 'Submit'}, {save: '保存 {1}'}, {complete: false}), [
    'Placeholder mismatch: save',
  ]);
});
test('template AST extracts conditional translate keys and ignores interpolation arguments', () => {
  assert.deepEqual(
    [...usedKeys("{{ (valid ? 'form.ok' : 'form.error') | translate: 'not.a.key' }}", 'fixture.html')].sort(),
    ['form.error', 'form.ok'],
  );
  assert.deepEqual(
    [
      ...usedKeys("{{ (variant() === 'topbar' ? 'widget.topbar' : 'widget.dashboard') | translate }}", 'fixture.html'),
    ].sort(),
    ['widget.dashboard', 'widget.topbar'],
  );
});
test('TypeScript AST ignores illustrative snippets but checks executable calls', () => {
  assert.deepEqual(
    [...usedKeys("const example = `service.translate('not.a.key')`; service.translate('real.key');", 'fixture.ts')],
    ['real.key'],
  );
});

test('rejects blank translations and preserves named interpolation examples', () => {
  assert.deepEqual(
    validateDictionary({save: 'Save', min: 'Minimum {{ minDate }}'}, {save: ' ', min: 'Minimum {{ maxDate }}'}),
    ['Empty translation: save', 'Placeholder mismatch: min'],
  );
  assert.deepEqual(validateDictionary({min: 'Minimum {{ minDate }}'}, {min: 'Minimum {{minDate}}'}), []);
});
test('rejects translation artifacts and translated API option literals', () => {
  assert.deepEqual(
    validateDictionary(
      {mode: 'Use "switch" or "exhaust".', content: 'Uses ng-content.'},
      {
        mode: 'Utilisez switch ou échappement.',
        content: 'Utilise ng@-@content.',
      },
    ),
    ['Changed API option: mode', 'Translation artifact: content'],
  );
  assert.deepEqual(validateDictionary({enabled: 'Use <code>true</code>.'}, {enabled: 'Use <code>verdadero</code>.'}), [
    'Changed code identifier: enabled',
  ]);
});
