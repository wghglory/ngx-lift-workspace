import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {lstatSync, readFileSync, readdirSync, realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const canonical = join(root, '.agents/skills');
const clients = ['.github/skills', '.opencode/skills'];

function run(directory, script, args) {
  const result = spawnSync(process.execPath, [join(root, directory, 'monitor-ci/scripts', script), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('client skill entries resolve to one canonical source, including supporting files', () => {
  for (const directory of clients) {
    for (const name of readdirSync(join(root, directory))) {
      const entry = join(root, directory, name);
      assert.ok(lstatSync(entry).isSymbolicLink(), `${entry} must be a client link`);
      assert.equal(realpathSync(entry), resolve(canonical, name));
      assert.match(readFileSync(join(entry, 'SKILL.md'), 'utf8'), new RegExp(`name: ${name}\\b`));
    }
  }
});

test('monitor-ci remains explicitly invoked and preserves the deployment verification boundary', () => {
  const skill = readFileSync(join(canonical, 'monitor-ci/SKILL.md'), 'utf8');
  assert.match(skill, /disable-model-invocation: true/);
  assert.match(skill, /CIPE UNAVAILABLE/);
  assert.doesNotMatch(skill, /\$ARGUMENTS|\$\{input:|!`git/);
  for (const file of ['references/fix-flows.md', 'scripts/ci-poll-decide.mjs', 'scripts/ci-state-update.mjs']) {
    assert.ok(readFileSync(join(canonical, 'monitor-ci', file)).length > 0);
  }
});

for (const directory of ['.agents/skills', ...clients]) {
  test(`monitor-ci helpers execute through ${directory} and enforce the cycle budget`, () => {
    const success = run(directory, 'ci-poll-decide.mjs', [JSON.stringify({cipeStatus: 'SUCCEEDED'}), '1', 'minimal']);
    assert.equal(success.code, 'ci_success');
    const gate = run(directory, 'ci-state-update.mjs', [
      'gate',
      '--gate-type',
      'local-fix',
      '--local-verify-count',
      '3',
    ]);
    assert.equal(gate.allowed, false);
    const cycle = run(directory, 'ci-state-update.mjs', [
      'cycle-check',
      '--agent-triggered',
      '--cycle-count',
      '9',
      '--max-cycles',
      '10',
    ]);
    assert.equal(cycle.limitReached, true);
    assert.equal(cycle.cycleCount, 10);
  });
}
