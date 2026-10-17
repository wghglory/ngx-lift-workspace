import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {test} from 'node:test';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '../..');
const query = resolve(root, 'apps/demo/src/app/ngx-lib/pages/query');

// The public-package examples are real components compiled by the demo build, not unchecked prose.
for (const name of ['query-starter', 'mutation-starter', 'collection-starter']) {
  test(`${name} displays its complete compiled source`, () => {
    const actual = readFileSync(resolve(query, name, `${name}.component.ts`), 'utf8').trim();
    const example = readFileSync(resolve(query, name, `${name}.example.ts`), 'utf8');
    const ast = ts.createSourceFile('example.ts', example, ts.ScriptTarget.Latest, true);
    const value = ast.statements.find(ts.isVariableStatement)?.declarationList.declarations[0].initializer;
    assert.ok(value && ts.isStringLiteralLike(value));
    assert.equal(value.text, actual);
    assert.ok(actual.includes("from 'ngx-lift'"));
    assert.ok(!actual.includes("from '../"), 'complete starter must not depend on private demo helpers');
  });
}
