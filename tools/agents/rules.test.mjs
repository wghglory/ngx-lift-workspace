import assert from 'node:assert/strict';
import {lstatSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {ruleDrift, ruleTargets} from './rules.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const canonical = join(root, '.agents/rules');
const names = readdirSync(canonical)
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.slice(0, -3));

test('canonical coding rules are non-empty and keep client frontmatter', () => {
  assert.ok(names.length >= 7, 'expected the shared rule set');
  for (const name of names) {
    const file = join(canonical, `${name}.md`);
    const contents = readFileSync(file, 'utf8');
    assert.ok(contents.trim().length > 0, `${file} must not be empty`);
    if (name !== 'README') assert.match(contents, /^---\r?\n/, `${file} must keep Cursor frontmatter`);
  }
});

test('client rule entries are regular generated files matching the canonical source', () => {
  const targets = ruleTargets();
  assert.ok(targets.length > 0, 'expected generated client rules');
  for (const {target} of targets) {
    assert.ok(!lstatSync(target).isSymbolicLink(), `${target} must be a regular generated file`);
  }
  assert.deepEqual(ruleDrift(), [], 'run pnpm run rules:generate after editing .agents/rules');
});

test('AGENTS.md points at the canonical rules', () => {
  assert.match(readFileSync(join(root, 'AGENTS.md'), 'utf8'), /\.agents\/rules/);
});
