import assert from 'node:assert/strict';
import {lstatSync, readFileSync, readdirSync, realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const canonical = join(root, '.agents/rules');
const clients = ['.cursor/rules', '.claude/rules'];
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

test('client rule entries resolve to the canonical source', () => {
  for (const directory of clients) {
    for (const name of names) {
      const extension = directory === '.cursor/rules' && name !== 'README' ? 'mdc' : 'md';
      const entry = join(root, directory, `${name}.${extension}`);
      assert.ok(
        lstatSync(entry).isSymbolicLink(),
        `${entry} must be a link; re-clone with core.symlinks=true (Windows: enable Developer Mode)`,
      );
      assert.equal(realpathSync(entry), resolve(canonical, `${name}.md`));
    }
  }
});

test('AGENTS.md points at the canonical rules', () => {
  assert.match(readFileSync(join(root, 'AGENTS.md'), 'utf8'), /\.agents\/rules/);
});
