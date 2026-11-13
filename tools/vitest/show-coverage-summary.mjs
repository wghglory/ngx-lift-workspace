#!/usr/bin/env node
// Prints coverage totals for both libraries and the demo from their generated reports.
import {readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = join(import.meta.dirname, '../..');

/** Coverage policy enforced by the thresholds in each project's `vite.config.mts`. */
export const THRESHOLDS = Object.freeze({statements: 80, branches: 75, functions: 50, lines: 80});

/** The generated reports that make up the combined coverage summary. */
export const COVERAGE_PROJECTS = Object.freeze([
  {name: 'ngx-lift', path: 'coverage/libs/ngx-lift/coverage-summary.json'},
  {name: 'clr-lift', path: 'coverage/libs/clr-lift/coverage-summary.json'},
  {name: 'demo', path: 'coverage/apps/demo/coverage-summary.json'},
]);

const METRICS = Object.keys(THRESHOLDS);

function formatPercentage(pct) {
  if (pct === 100) return '100%';
  return pct.toFixed(2) + '%';
}

/** Returns the threshold warning for one metric, or an empty string when the metric passes. */
export function checkThreshold(value, threshold) {
  if (value < threshold) {
    return ` ⚠️  (below ${threshold}% threshold)`;
  }
  return '';
}

function readTotal(root, project) {
  const data = JSON.parse(readFileSync(join(root, project.path), 'utf-8'));
  const total = data?.total;
  const invalid = METRICS.some(
    (metric) =>
      typeof total?.[metric]?.pct !== 'number' ||
      typeof total[metric].covered !== 'number' ||
      typeof total[metric].total !== 'number',
  );
  if (invalid) throw new Error('invalid coverage summary');
  return total;
}

/**
 * Prints per-project and combined coverage for every readable report.
 * @param {string} root workspace root containing the generated `coverage/` directory
 * @param {{log?: (message: string) => void, warn?: (message: string) => void}} [io] output sinks
 * @returns {boolean} true when a report is missing, invalid or below a configured threshold
 */
export function summarizeCoverage(root = rootDir, io = {}) {
  const log = io.log ?? console.log;
  const warn = io.warn ?? console.error;
  const totalStats = Object.fromEntries(METRICS.map((metric) => [metric, {covered: 0, total: 0}]));
  let failed = false;

  for (const project of COVERAGE_PROJECTS) {
    let total;
    try {
      total = readTotal(root, project);
    } catch {
      failed = true;
      warn(`Missing or invalid coverage report: ${project.path}`);
      continue;
    }

    for (const metric of METRICS) {
      if (total[metric].pct < THRESHOLDS[metric]) failed = true;
      totalStats[metric].covered += total[metric].covered;
      totalStats[metric].total += total[metric].total;
    }

    log(`\n📊 ${project.name.toUpperCase()} Coverage Summary`);
    log('─'.repeat(60));
    log(
      `Statements : ${formatPercentage(total.statements.pct)} (${total.statements.covered}/${total.statements.total})${checkThreshold(total.statements.pct, THRESHOLDS.statements)}`,
    );
    log(
      `Branches   : ${formatPercentage(total.branches.pct)} (${total.branches.covered}/${total.branches.total})${checkThreshold(total.branches.pct, THRESHOLDS.branches)}`,
    );
    log(
      `Functions  : ${formatPercentage(total.functions.pct)} (${total.functions.covered}/${total.functions.total})${checkThreshold(total.functions.pct, THRESHOLDS.functions)}`,
    );
    log(
      `Lines      : ${formatPercentage(total.lines.pct)} (${total.lines.covered}/${total.lines.total})${checkThreshold(total.lines.pct, THRESHOLDS.lines)}`,
    );
    log('─'.repeat(60));
  }

  if (totalStats.statements.total > 0) {
    log(`\n📈 OVERALL Coverage Summary`);
    log('═'.repeat(60));
    for (const [label, metric] of [
      ['Statements', 'statements'],
      ['Branches', 'branches'],
      ['Functions', 'functions'],
      ['Lines', 'lines'],
    ]) {
      const stats = totalStats[metric];
      const pct = (stats.covered / stats.total) * 100;
      log(`${label.padEnd(11)}: ${formatPercentage(pct)} (${stats.covered}/${stats.total})`);
    }
    log('═'.repeat(60));
  }

  return failed;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (summarizeCoverage()) process.exitCode = 1;
}
