import {expect, test} from '@playwright/test';

const base = '/ngx-lift/query/';
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('clr-lift-lang')) localStorage.setItem('clr-lift-lang', 'en');
  });
});

test('first read shows retained data on refresh failure and recovers without changing selection', async ({page}) => {
  await page.goto(base + 'queryResource');
  const starter = page.getByTestId('query-starter');
  const team = starter.getByTestId('starter-team');
  await expect(team).toContainText('Atlas');
  const order = await page
    .locator('[data-testid="query-starter"], #lifecycle, #comparison')
    .evaluateAll((nodes) => nodes.map((node) => node.id || node.getAttribute('data-testid')));
  expect(order).toEqual(['query-starter', 'lifecycle', 'comparison']);
  const fail = starter.getByRole('checkbox', {name: 'Simulate failure', exact: true});
  await fail.check();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(team).toContainText('Atlas');
  await expect(starter.getByRole('alert')).toContainText('The read failed');
  await fail.uncheck();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(starter.getByRole('alert')).toHaveCount(0);
  await expect(team).toContainText('Atlas');
  // A different, uncached ID has no data to retain on its initial failure.
  await fail.check();
  await starter.getByRole('button', {name: 'Team B', exact: true}).click();
  await expect(starter.getByRole('alert')).toBeVisible();
  await expect(team).toHaveCount(0);
  await fail.uncheck();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(team).toContainText('Beacon');
  await starter.getByRole('button', {name: 'View Code', exact: true}).click();
  await expect(starter.locator('app-demo-playground app-code-block')).toContainText("from 'ngx-lift'");
  await starter.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(starter.locator('app-demo-playground app-code-block')).toContainText('teamQuery.isRefreshing()');
});
