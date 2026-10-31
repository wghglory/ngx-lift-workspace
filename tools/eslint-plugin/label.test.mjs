import assert from 'node:assert/strict';
import test from 'node:test';
import {ESLint} from 'eslint';
import angular from 'angular-eslint';
import label from './eslint-plugin-label.mjs';

async function lint(source) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      ...label.configs.recommended,
      {files: ['**/*.html'], languageOptions: {parser: angular.templateParser}},
    ],
  });
  return (await eslint.lintText(source, {filePath: 'fixture.html'}))[0].messages;
}

test('recommended preset reports an unassociated root label', async () => {
  const messages = await lint('<label>Name</label>');
  assert.equal(messages.length, 1);
  assert.equal(messages[0].ruleId, 'label/label-has-associated-control');
});
test('Clarity labels are exempt only when their container has a real control', async () => {
  assert.equal(
    (await lint('<clr-input-container><label>Name</label><input clrInput></clr-input-container>')).length,
    0,
  );
  assert.equal((await lint('<clr-input-container><label>Name</label></clr-input-container>')).length, 1);
});
test('explicit associations and nested control flow remain supported', async () => {
  assert.equal((await lint('<label for="name">Name</label><input id="name">')).length, 0);
  assert.equal((await lint('<label>Name<input></label>')).length, 0);
  assert.equal((await lint('@if (visible) {<div><label>Name</label></div>}')).length, 1);
});
test('selection labels require a directly projected native grid', async () => {
  assert.equal(
    (await lint('<cll-datagrid-selection><label>Organizations</label><clr-datagrid /></cll-datagrid-selection>'))
      .length,
    0,
  );
  assert.equal((await lint('<cll-datagrid-selection><label>Organizations</label></cll-datagrid-selection>')).length, 1);
  assert.equal(
    (
      await lint(
        '<cll-datagrid-selection><div><label>Organizations</label></div><clr-datagrid /></cll-datagrid-selection>',
      )
    ).length,
    1,
  );
});
