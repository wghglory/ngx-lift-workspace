import {expect, test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ts from 'typescript';

function readTranslations(locale: string) {
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
  const devtoolsFile = resolve(
    __dirname,
    '../../../libs/clr-lift/src/lib/components/query-devtools/query-devtools.l10n.ts',
  );
  const devtools = ts.createSourceFile(devtoolsFile, readFileSync(devtoolsFile, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const statement of devtools.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const entries = statement.declarationList.declarations[0].initializer;
    if (!entries || !ts.isObjectLiteralExpression(entries)) continue;
    const labels = entries.properties.find(
      (property) =>
        ts.isPropertyAssignment(property) && property.name.getText(devtools).replace(/['"]/g, '') === locale,
    );
    if (!labels || !ts.isPropertyAssignment(labels) || !ts.isObjectLiteralExpression(labels.initializer)) continue;
    for (const property of labels.initializer.properties) {
      if (ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer)) {
        translated[`queryDevtools.${property.name.getText(devtools).replace(/['"]/g, '')}`] = property.initializer.text;
      }
    }
  }
  return translated;
}

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('clr-lift-lang')) localStorage.setItem('clr-lift-lang', 'en');
  });
  await page.goto('/ngx-lift/query/queryResource');
});

test('dynamic collection adds, reorders, and removes rows', async ({page}) => {
  await page.goto('/ngx-lift/query/queryResources');
  const demo = page.getByTestId('query-demo-dynamic');
  await expect(demo.getByTestId('query-demo-dynamic-row')).toHaveCount(1);
  await demo.getByRole('button', {name: 'Both tenants', exact: true}).click();
  await expect(demo.getByTestId('query-demo-dynamic-row')).toHaveCount(2);
  await expect(demo.getByTestId('query-demo-dynamic-row').last()).toContainText(/Tenant B\s*resolved/);
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
    const translated = readTranslations(locale);
    const demo = page.getByTestId('query-placement-architecture');
    await expect(demo.locator('h2')).toHaveText(translated['queryResource.placementTitle']);
    await expect(
      demo.getByRole('button', {name: translated['queryResource.updateNameBtn'], exact: true}),
    ).toBeVisible();
    await expect(page.getByTestId('query-introduction')).toContainText(translated['queryResource.lifecycleTitle']);
    await expect(
      page.getByTestId('query-demo-mutation').getByRole('button', {
        name: translated['queryResource.addMemberBtn'],
        exact: true,
      }),
    ).toBeVisible();
    await expect(demo).not.toContainText('!! Key');
    await expect(demo).not.toContainText(/\{\d+\}/);
    const failure = page.getByTestId('query-failure-examples');
    await expect(failure.locator('h2')).toHaveText(translated['queryExamples.failureTitle']);
    await failure.getByRole('tab', {name: translated['queryExamples.automaticRetry'], exact: true}).click();
    await expect(
      failure.getByRole('button', {name: translated['queryExamples.startRetry'], exact: true}),
    ).toBeVisible();
    await expect(failure).not.toContainText('!! Key');
    await expect(failure).not.toContainText(/\{\d+\}/);
    const diagnostics = page.getByTestId('query-diagnostics');
    await diagnostics
      .locator('.playground-canvas')
      .getByRole('button', {name: translated['queryDevtools.title'], exact: true})
      .click();
    const dialog = page.getByRole('region', {name: translated['queryDevtools.title'], exact: true});
    await expect(dialog.getByRole('columnheader', {name: translated['queryDevtools.status']})).toBeVisible();
    await expect(dialog.getByRole('columnheader', {name: translated['queryDevtools.updated']})).toBeVisible();
    await expect(dialog).toContainText(translated['queryDevtools.pending']);
    await expect(dialog.getByRole('button', {name: translated['queryDevtools.refresh'], exact: true})).toHaveCount(0);
    await dialog.getByRole('button', {name: translated['queryDevtools.pause'], exact: true}).click();
    await dialog.getByRole('button', {name: translated['queryDevtools.refresh'], exact: true}).click();
    await expect(dialog.locator('.view-feedback')).toContainText(translated['queryDevtools.viewUpdated']);
    await expect(dialog.locator('clr-dg-row')).not.toHaveCount(0);
    await expect(dialog).not.toContainText('!! Key');
    await dialog.getByRole('button', {name: translated['queryDevtools.close'], exact: true}).click();
    await expect(dialog).toBeHidden();
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
  await demo.getByRole('tab', {name: 'Bounded automatic retries', exact: true}).click();
  await demo.getByRole('button', {name: 'Start Observable retry', exact: true}).click();
  await expect(demo.getByTestId('failure-retry-state')).toContainText('failureCount: 1');
  await expect(demo.getByTestId('failure-retry-state')).toContainText('resolved; failureCount: 0');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"GET retry": 3');
  await demo.getByRole('button', {name: 'Start Promise retry', exact: true}).click();
  await expect(demo.getByTestId('failure-promise-state')).toContainText('Promise: resolved');
  await expect(demo.getByTestId('failure-reporting')).toContainText('Terminal read errors: 2');
});

test('deadlines cancel hanging subscriptions and write failures preserve input without automatic retry', async ({
  page,
}) => {
  const demo = page.getByTestId('query-failure-examples');
  await demo.getByRole('tab', {name: 'Logical read deadline', exact: true}).click();
  await demo.getByRole('button', {name: 'Start hanging read', exact: true}).click();
  await expect(demo.getByTestId('failure-deadline').getByRole('alert')).toContainText('timed out');
  await expect(demo.getByTestId('failure-deadline-state')).toContainText('Canceled subscriptions: 1');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"GET deadline": 1');
  await demo.getByRole('tab', {name: 'Write failure', exact: true}).click();
  await demo.getByTestId('failure-name').fill('Retained browser input');
  await demo.getByRole('button', {name: 'Submit failed write', exact: true}).click();
  await expect(demo.getByTestId('failure-mutation-state')).toHaveText('error');
  await expect(demo.getByTestId('failure-name')).toHaveValue('Retained browser input');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"POST mutation": 1');
  await demo.getByRole('button', {name: 'Submit write', exact: true}).click();
  await expect(demo.getByTestId('failure-mutation-state')).toHaveText('resolved');
  await expect(demo.getByTestId('failure-request-counts')).toContainText('"POST mutation": 2');
  await demo.getByRole('tab', {name: 'Initial read failure', exact: true}).click();
  await expect(demo.getByTestId('failure-retained')).toContainText('43');
});

test('queryResource coalesces independent observers and retains data during refresh', async ({page}) => {
  const demo = page.getByTestId('query-demo-coalesce');
  const calls = demo.locator('.badge').filter({hasText: /^Actual HTTP Calls:/});
  await expect(demo.locator('.label-success')).toHaveCount(2);
  await expect(calls).toHaveText('Actual HTTP Calls: 1');
  const activeUsers = await demo.locator('.widget-metrics').first().locator('strong').first().textContent();
  await demo.getByRole('button', {name: 'Reload Query', exact: true}).click();
  await expect(calls).toHaveText('Actual HTTP Calls: 2');
  await expect(demo.locator('.widget-metrics')).toHaveCount(2);
  await expect(demo.locator('.widget-metrics').first().locator('strong').first()).toHaveText(activeUsers ?? '');
  await expect(demo.locator('.label-success')).toHaveCount(2);
  await expect(calls).toHaveText('Actual HTTP Calls: 2');
});

test('mutateResource invalidates the team query and updates the rendered members', async ({page}) => {
  const demo = page.getByTestId('query-demo-mutation');
  await expect(demo.locator('tbody tr')).toHaveCount(2);
  await demo.locator('input[name="newUserName"]').fill('Browser-created member');
  await demo.locator('select[name="newUserRole"]').selectOption('Site Reliability Engineer');
  await demo.getByRole('button', {name: 'Add Member', exact: true}).click();
  await expect(demo.getByRole('button', {name: 'Saving...', exact: true})).toBeDisabled();
  await expect(demo.locator('tbody tr')).toHaveCount(3);
  await expect(demo.locator('tbody tr').last()).toContainText('Browser-created member');
  await expect(demo.locator('tbody tr').last()).toContainText('Site Reliability Engineer');
  await expect(demo.locator('input[name="newUserName"]')).toHaveValue('');
});

test('parameterized queryResource switches database details without retaining the previous scope', async ({page}) => {
  await page.locator('#tab-service-pattern-b').click();
  const detail = page.locator('#tab-content-service-pattern-b');
  await expect(detail.locator('h4')).toHaveText('Production PostgreSQL');
  await detail.getByRole('button', {name: 'Analytics ClickHouse', exact: true}).click();
  await expect(detail.locator('h4')).toHaveCount(0);
  await expect(detail.locator('h4')).toHaveText('Analytics ClickHouse');
  await expect(detail).toContainText('ClickHouse 24.1');
  await detail.getByRole('button', {name: 'Production PostgreSQL', exact: true}).click();
  await expect(detail.locator('h4')).toHaveText('Production PostgreSQL');
  await expect(detail).toContainText('PostgreSQL 16.2');
});

test('collection recovery retries one failed row and preserves successful siblings', async ({page}) => {
  await page.goto('/ngx-lift/query/queryResources');
  const rows = page.getByTestId('failure-row');
  await expect(rows.last()).toContainText(/b\s*error/);
  await rows.last().getByRole('button', {name: 'Retry read', exact: true}).click();
  await expect(rows.last()).toContainText(/b\s*resolved/);
  await expect(page.getByTestId('failure-request-counts')).toContainText('"GET rows/a": 1');
  await expect(page.getByTestId('failure-request-counts')).toContainText('"GET rows/b": 2');
});

test('query guide uses Clarity controls, status labels and a separate collection menu', async ({page}) => {
  const select = page.getByTestId('query-demo-mutation').locator('select[name="newUserRole"]');
  await expect(select.locator('xpath=ancestor::clr-select-container')).toBeVisible();
  await expect(page.getByTestId('query-demo-coalesce').locator('.label-success')).toHaveCount(2);
  await page.getByRole('link', {name: 'queryResources', exact: true}).first().click();
  await expect(page).toHaveURL(/queryResources$/);
  await expect(page.locator('h1')).toHaveText('queryResources');
});
