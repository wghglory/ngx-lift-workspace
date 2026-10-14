import {expect, test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ts from 'typescript';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('clr-lift-lang')) localStorage.setItem('clr-lift-lang', 'en');
  });
  await page.goto('/ngx-lift/query/queryResource');
});

test('dynamic collection adds, reorders, and removes rows', async ({page}) => {
  const demo = page.getByTestId('query-demo-dynamic');
  await expect(demo.getByTestId('query-demo-dynamic-row')).toHaveCount(1);
  await demo.getByRole('button', {name: 'Both tenants', exact: true}).click();
  await expect(demo.getByTestId('query-demo-dynamic-row')).toHaveCount(2);
  await expect(demo.getByTestId('query-demo-dynamic-row').last()).toContainText('Tenant B — resolved');
  await demo.getByRole('button', {name: 'Reverse order', exact: true}).click();
  await expect(demo.getByTestId('query-demo-dynamic-row').first()).toContainText('Tenant B');
  await demo.getByRole('button', {name: 'Clear selection', exact: true}).click();
  await expect(demo.getByTestId('query-demo-dynamic-row')).toHaveCount(0);
});

test('new query examples are localized in every supported language', async ({page}) => {
  test.setTimeout(60_000);
  for (const locale of ['en', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt-BR', 'ru']) {
    await page.evaluate((locale) => localStorage.setItem('clr-lift-lang', locale), locale);
    await page.reload();
    const file = resolve(__dirname, '../../demo/src/app/core/l10n', `demo.l10n.${locale.toLowerCase()}.ts`);
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const translated: Record<string, string> = {};
    function read(node: ts.Node) {
      if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.name) && ts.isStringLiteral(node.initializer)) {
        translated[node.name.text] = node.initializer.text;
      }
      ts.forEachChild(node, read);
    }
    read(source);
    const demo = page.getByTestId('observable-query-examples');
    await expect(demo.locator('h2')).toHaveText(translated['queryExamples.title']);
    await expect(demo.getByRole('button', {name: translated['queryExamples.create'], exact: true})).toBeVisible();
    await expect(demo).toContainText(translated['queryExamples.dynamicIntro']);
    await expect(demo).not.toContainText('!! Key');
    await expect(demo).not.toContainText(/\{\d+\}/);
    const failure = page.getByTestId('query-failure-examples');
    await expect(failure.locator('h2')).toHaveText(translated['queryExamples.failureTitle']);
    await expect(
      failure.getByRole('button', {name: translated['queryExamples.startRetry'], exact: true}),
    ).toBeVisible();
    await expect(failure).not.toContainText('!! Key');
    await expect(failure).not.toContainText(/\{\d+\}/);
    const diagnostics = page.getByTestId('query-diagnostics');
    await expect(
      diagnostics.getByRole('columnheader', {name: translated['queryResource.thFailures'], exact: true}),
    ).toBeVisible();
    await expect(
      diagnostics.getByRole('columnheader', {name: translated['queryResource.thNextRetry'], exact: true}),
    ).toBeVisible();
    await expect(diagnostics).toContainText(translated['queryResource.diagPendingRequests']);
    await diagnostics.getByRole('button', {name: translated['queryResource.refreshDiagnostics'], exact: true}).click();
    await expect(diagnostics.locator('tbody tr')).not.toHaveCount(0);
    await expect(diagnostics).not.toContainText('!! Key');
  }
});

test('failure patterns retain data, isolate observers, and retry only failed reads', async ({page}) => {
  const demo = page.getByTestId('query-failure-examples');
  const initial = demo.getByTestId('failure-initial');
  await expect(initial.getByRole('alert')).toBeVisible();
  await initial.getByRole('button', {name: 'Retry read', exact: true}).click();
  await expect(initial).toContainText('Last successful value: 42');
  const refresh = demo.getByTestId('failure-refresh');
  await refresh.getByRole('button', {name: 'Fail one refresh', exact: true}).click();
  await expect(refresh.getByRole('status')).toContainText('Refresh failed');
  await expect(refresh.getByTestId('failure-retained')).toContainText('42');
  await refresh.getByRole('button', {name: 'Simulate observer failure', exact: true}).click();
  await expect(demo.getByTestId('failure-reporting')).toContainText('observer diagnostics: 1');
  await expect(refresh).toContainText('resolved');
  await demo.getByRole('button', {name: 'Start Observable retry', exact: true}).click();
  await expect(demo.getByTestId('failure-retry-state')).toContainText('failureCount: 1');
  await expect(demo.getByTestId('failure-retry-state')).toContainText('resolved; failureCount: 0');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"GET retry": 3');
  await demo.getByRole('button', {name: 'Start Promise retry', exact: true}).click();
  await expect(demo.getByTestId('failure-promise-state')).toContainText('Promise: resolved');
  const rows = demo.getByTestId('failure-row');
  await expect(rows.last()).toContainText('b — error');
  await rows.last().getByRole('button', {name: 'Retry read', exact: true}).click();
  await expect(rows.last()).toContainText('b — resolved');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"GET rows/a": 1');
  await expect(demo.getByTestId('failure-reporting')).toContainText('Terminal read errors: 3');
});

test('deadlines cancel hanging subscriptions and write failures preserve input without automatic retry', async ({
  page,
}) => {
  const demo = page.getByTestId('query-failure-examples');
  await demo.getByRole('button', {name: 'Start hanging read', exact: true}).click();
  await expect(demo.getByTestId('failure-deadline').getByRole('alert')).toContainText('timed out');
  await expect(demo.getByTestId('failure-deadline-state')).toContainText('Canceled subscriptions: 1');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"GET deadline": 1');
  await demo.getByTestId('failure-name').fill('Retained browser input');
  await demo.getByRole('button', {name: 'Submit failed write', exact: true}).click();
  await expect(demo.getByTestId('failure-mutation-state')).toHaveText('error');
  await expect(demo.getByTestId('failure-name')).toHaveValue('Retained browser input');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"POST mutation": 1');
  await demo.getByRole('button', {name: 'Submit write', exact: true}).click();
  await expect(demo.getByTestId('failure-mutation-state')).toHaveText('resolved');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"POST mutation": 2');
  await expect(demo.getByTestId('failure-retained')).toContainText('43');
});

test('Observable queries gate dependencies, distinguish refresh, and recover from errors', async ({page}) => {
  const parallel = page.getByTestId('query-demo-parallel');
  await expect(parallel).toContainText('Tenant A — resolved');
  await expect(page.getByTestId('query-demo-dependent')).toContainText('Tenant A database');
  await page.getByRole('button', {name: 'Refresh tenant', exact: true}).click();
  await expect(page.getByTestId('query-demo-loading')).toContainText('isRefreshing: true');
  await expect(page.getByTestId('query-demo-loading')).toContainText('isInitialLoading: false');
  await expect(parallel).toContainText('Tenant A — resolved');
  await page.getByRole('button', {name: 'Fail next tenant read', exact: true}).click();
  await expect(parallel.getByRole('alert')).toContainText('Tenant read failed');
  await page.getByRole('button', {name: 'Retry tenant', exact: true}).click();
  await expect(parallel).toContainText('Tenant A — resolved');
  await expect(parallel.getByRole('alert')).toHaveCount(0);
});

test('three service callers coalesce and a mutation refreshes live scoped observers', async ({page}) => {
  await page.getByRole('button', {name: 'Mount service widgets', exact: true}).click();
  await expect(page.getByTestId('query-demo-widget')).toHaveCount(3);
  await expect(page.getByTestId('query-demo-counts')).toContainText('"GET /query-demo/tenants/a/preferences": 1');
  await page.getByRole('button', {name: 'Refresh service widgets', exact: true}).click();
  await expect(page.getByTestId('query-demo-counts')).toContainText('"GET /query-demo/tenants/a/preferences": 2');
  const databases = page.getByTestId('query-demo-dependent');
  await expect(databases).toContainText('Tenant A database');
  await page.getByTestId('query-demo-name').fill('Browser-created database');
  await page.getByRole('button', {name: 'Create database', exact: true}).click();
  await expect(databases).toContainText('Browser-created database');
  await expect(page.getByTestId('query-demo-snapshot')).toContainText('resolved, 2 databases');
  await page.getByTestId('query-demo-tenant').selectOption('b');
  await expect(databases).toContainText('Tenant B database');
  await expect(databases).not.toContainText('Browser-created database');
  await expect(page.getByTestId('query-demo-widget').first()).toContainText('tenant b');
});
