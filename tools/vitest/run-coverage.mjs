// Runs all Nx unit-test projects with fresh coverage, then prints the combined summary.
import {spawnSync} from 'node:child_process';
import {rmSync} from 'node:fs';
// Never show a stale report from an earlier successful run.
rmSync('coverage', {recursive: true, force: true});
const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const test = spawnSync(runner, ['nx', 'run-many', '-t', 'test', '--coverage', '--parallel=1', '--skipNxCache'], {
  stdio: 'inherit',
});
const summary = spawnSync(process.execPath, ['tools/vitest/show-coverage-summary.mjs'], {stdio: 'inherit'});
process.exitCode = (test.status ?? 1) || (summary.status ?? 1);
