// Runs all Nx unit-test projects with fresh coverage, then prints the combined summary.
import {spawnSync} from 'node:child_process';
import {rmSync} from 'node:fs';
import {join} from 'node:path';

const rootDir = join(import.meta.dirname, '../..');
const runner = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const summaryScript = join(rootDir, 'tools/vitest/show-coverage-summary.mjs');

// Never show a stale report from an earlier successful run.
rmSync(join(rootDir, 'coverage'), {recursive: true, force: true});
const test = spawnSync(
  runner,
  ['exec', 'nx', 'run-many', '-t', 'test', '--coverage', '--parallel=1', '--skipNxCache'],
  {
    cwd: rootDir,
    stdio: 'inherit',
  },
);
const summary = spawnSync(process.execPath, [summaryScript], {cwd: rootDir, stdio: 'inherit'});
process.exitCode = (test.status ?? 1) || (summary.status ?? 1);
