import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {checkWorkspace, usedKeys, validateDictionary} from './check-translations.mjs';

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

test('does not mistake dynamic key prefixes for complete translation keys', () => {
  assert.deepEqual([...usedKeys("{{ ('certificate.' + property) | translate }}", 'fixture.html')], []);
});

test('checks translated labels and visible messages in inline Angular component templates', () => {
  assert.deepEqual(
    [
      ...usedKeys(
        "@Component({template: `<button [attr.aria-label]=\"'control.close' | translate\">{{ 'control.save' | translate }}</button>`}) class Control {}",
        'fixture.ts',
      ),
    ].sort(),
    ['control.close', 'control.save'],
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

test('checks library key references and every promised library locale', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'lift-i18n-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const demo = join(root, 'apps/demo/src/app/core/l10n');
  const library = join(root, 'libs/clr-lift/src/lib');
  mkdirSync(demo, {recursive: true});
  mkdirSync(library, {recursive: true});
  const locales = ['en', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt-BR', 'ru'];
  for (const locale of locales)
    writeFileSync(join(demo, `demo.l10n.${locale.toLowerCase()}.ts`), 'export const messages = {save: "Save"};');
  const translations = Object.fromEntries(locales.map((locale) => [locale, {close: 'Close'}]));
  const dictionaryFile = join(library, 'control.l10n.ts');
  writeFileSync(dictionaryFile, `export const controlTranslations = ${JSON.stringify(translations)};`);
  writeFileSync(join(library, 'control.ts'), "service.loadTranslationsForComponent('control', controlTranslations);");
  const templateFile = join(library, 'control.html');
  writeFileSync(templateFile, "<button>{{ 'control.close' | translate }}</button>");
  assert.deepEqual(checkWorkspace(root).errors, []);
  writeFileSync(templateFile, "<button>{{ 'control.missing' | translate }}</button>");
  assert.ok(checkWorkspace(root).errors.some((error) => error.includes('missing library key control.missing')));
  delete translations.fr;
  writeFileSync(dictionaryFile, `export const controlTranslations = ${JSON.stringify(translations)};`);
  assert.ok(checkWorkspace(root).errors.some((error) => error.includes('unsupported promised locale fr')));
});
