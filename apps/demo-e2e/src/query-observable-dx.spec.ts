import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.goto('/ngx-lift/query/queryResource');
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
