#!/usr/bin/env node
// Prints coverage totals for both libraries and the demo from their generated reports.
import {readFileSync} from 'fs';
import {join} from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

let failed = false;

const projects = [
  {name: 'ngx-lift', path: 'coverage/libs/ngx-lift/coverage-summary.json'},
  {name: 'clr-lift', path: 'coverage/libs/clr-lift/coverage-summary.json'},
  {name: 'demo', path: 'coverage/apps/demo/coverage-summary.json'},
];

function formatPercentage(pct) {
  if (pct === 100) return '100%';
  return pct.toFixed(2) + '%';
}

// Project coverage policy (enforced by Vitest).
const THRESHOLDS = {
  statements: 80,
  branches: 75,
  functions: 50,
  lines: 80,
};

function checkThreshold(value, threshold) {
  if (value < threshold) {
    return ` ⚠️  (below ${threshold}% threshold)`;
  }
  return '';
}

function displayCoverage(project) {
  try {
    const filePath = join(rootDir, project.path);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const total = data.total;
    for (const [metric, threshold] of Object.entries(THRESHOLDS)) {
      if (total[metric].pct < threshold) failed = true;
    }

    console.log(`\n📊 ${project.name.toUpperCase()} Coverage Summary`);
    console.log('─'.repeat(60));
    console.log(
      `Statements : ${formatPercentage(total.statements.pct)} (${total.statements.covered}/${total.statements.total})${checkThreshold(total.statements.pct, THRESHOLDS.statements, 'statements')}`,
    );
    console.log(
      `Branches   : ${formatPercentage(total.branches.pct)} (${total.branches.covered}/${total.branches.total})${checkThreshold(total.branches.pct, THRESHOLDS.branches, 'branches')}`,
    );
    console.log(
      `Functions  : ${formatPercentage(total.functions.pct)} (${total.functions.covered}/${total.functions.total})${checkThreshold(total.functions.pct, THRESHOLDS.functions, 'functions')}`,
    );
    console.log(
      `Lines      : ${formatPercentage(total.lines.pct)} (${total.lines.covered}/${total.lines.total})${checkThreshold(total.lines.pct, THRESHOLDS.lines, 'lines')}`,
    );
    console.log('─'.repeat(60));
  } catch {
    failed = true;
    console.error(`Missing or invalid coverage report: ${project.path}`);
  }
}

// Display coverage for all projects
projects.forEach(displayCoverage);

// Calculate overall coverage
const totalStats = {
  statements: {covered: 0, total: 0},
  branches: {covered: 0, total: 0},
  functions: {covered: 0, total: 0},
  lines: {covered: 0, total: 0},
};

projects.forEach((project) => {
  try {
    const filePath = join(rootDir, project.path);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const total = data.total;
    totalStats.statements.covered += total.statements.covered;
    totalStats.statements.total += total.statements.total;
    totalStats.branches.covered += total.branches.covered;
    totalStats.branches.total += total.branches.total;
    totalStats.functions.covered += total.functions.covered;
    totalStats.functions.total += total.functions.total;
    totalStats.lines.covered += total.lines.covered;
    totalStats.lines.total += total.lines.total;
  } catch {
    // Skip if file doesn't exist
  }
});

if (totalStats.statements.total > 0) {
  console.log(`\n📈 OVERALL Coverage Summary`);
  console.log('═'.repeat(60));
  const statementsPct = (totalStats.statements.covered / totalStats.statements.total) * 100;
  const branchesPct = (totalStats.branches.covered / totalStats.branches.total) * 100;
  const functionsPct = (totalStats.functions.covered / totalStats.functions.total) * 100;
  const linesPct = (totalStats.lines.covered / totalStats.lines.total) * 100;
  console.log(
    `Statements : ${formatPercentage(statementsPct)} (${totalStats.statements.covered}/${totalStats.statements.total})`,
  );
  console.log(
    `Branches   : ${formatPercentage(branchesPct)} (${totalStats.branches.covered}/${totalStats.branches.total})`,
  );
  console.log(
    `Functions  : ${formatPercentage(functionsPct)} (${totalStats.functions.covered}/${totalStats.functions.total})`,
  );
  console.log(`Lines      : ${formatPercentage(linesPct)} (${totalStats.lines.covered}/${totalStats.lines.total})`);
  console.log('═'.repeat(60));
}

if (failed) process.exitCode = 1;
