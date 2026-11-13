import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

import {checkThreshold, COVERAGE_PROJECTS, summarizeCoverage, THRESHOLDS} from './show-coverage-summary.mjs';

const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const METRICS = Object.keys(THRESHOLDS);

function report(overrides = {}) {
  return {
    total: Object.fromEntries(
      METRICS.map((metric) => {
        const pct = overrides[metric] ?? THRESHOLDS[metric];
        return [metric, {pct, covered: pct, total: 100}];
      }),
    ),
  };
}

function writeReport(root, project, content) {
  const file = join(root, project.path);
  mkdirSync(dirname(file), {recursive: true});
  writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content));
}

function withRoot(fn) {
  const root = mkdtempSync(join(tmpdir(), 'coverage-summary-'));
  try {
    return fn(root);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
}

function capture() {
  const lines = [];
  const errors = [];
  return {lines, errors, io: {log: (message) => lines.push(message), warn: (message) => errors.push(message)}};
}

test('checkThreshold takes exactly two arguments and marks below-threshold metrics', () => {
  assert.equal(checkThreshold.length, 2);
  assert.match(checkThreshold(79, 80), /below 80% threshold/);
  assert.equal(checkThreshold(80, 80), '');
});

test('passes when every project meets the configured thresholds', () => {
  withRoot((root) => {
    COVERAGE_PROJECTS.forEach((project) => writeReport(root, project, report()));
    const {lines, errors, io} = capture();
    assert.equal(summarizeCoverage(root, io), false);
    assert.deepEqual(errors, []);
    assert.equal(lines.filter((line) => line.includes('Coverage Summary')).length, 4);
  });
});

test('flags every below-threshold metric in the printed summary', () => {
  withRoot((root) => {
    COVERAGE_PROJECTS.forEach((project) => writeReport(root, project, report()));
    writeReport(root, COVERAGE_PROJECTS[0], report({statements: 79.5, branches: 74}));
    const {lines, errors, io} = capture();
    assert.equal(summarizeCoverage(root, io), true);
    assert.deepEqual(errors, []);
    assert.ok(lines.some((line) => line.includes('below 80% threshold')));
    assert.ok(lines.some((line) => line.includes('below 75% threshold')));
  });
});

test('reports missing and invalid files once instead of silently skipping them', () => {
  withRoot((root) => {
    writeReport(root, COVERAGE_PROJECTS[0], report());
    writeReport(root, COVERAGE_PROJECTS[1], 'not json');
    const {lines, errors, io} = capture();
    assert.equal(summarizeCoverage(root, io), true);
    assert.deepEqual(errors, [
      `Missing or invalid coverage report: ${COVERAGE_PROJECTS[1].path}`,
      `Missing or invalid coverage report: ${COVERAGE_PROJECTS[2].path}`,
    ]);
    assert.equal(lines.filter((line) => line.includes('NGX-LIFT Coverage Summary')).length, 1);
    assert.ok(lines.some((line) => line.includes('OVERALL Coverage Summary')));
  });
});

test('rejects reports whose totals are missing a metric', () => {
  withRoot((root) => {
    COVERAGE_PROJECTS.forEach((project) => writeReport(root, project, report()));
    const incomplete = report();
    delete incomplete.total.lines;
    writeReport(root, COVERAGE_PROJECTS[2], incomplete);
    const {errors, io} = capture();
    assert.equal(summarizeCoverage(root, io), true);
    assert.deepEqual(errors, [`Missing or invalid coverage report: ${COVERAGE_PROJECTS[2].path}`]);
  });
});

test('summary thresholds match the three authoritative Vitest configs', () => {
  for (const config of [
    'libs/ngx-lift/vite.config.mts',
    'libs/clr-lift/vite.config.mts',
    'apps/demo/vite.config.mts',
  ]) {
    const source = readFileSync(join(workspaceRoot, config), 'utf-8');
    const block = source.match(/thresholds:\s*\{([^}]*)\}/)?.[1];
    assert.ok(block, `${config} must declare coverage thresholds`);
    for (const [metric, threshold] of Object.entries(THRESHOLDS)) {
      assert.match(block, new RegExp(`${metric}:\\s*${threshold}\\b`), `${config} ${metric} threshold`);
    }
  }
});
