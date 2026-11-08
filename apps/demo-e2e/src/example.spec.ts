import {test, expect} from '@playwright/test';

test('home page has a title @cross-browser-smoke', async ({page}) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  await expect(page.locator('h1')).toContainText('ngx-lift');
});

test('query route loads its API documentation @cross-browser-smoke', async ({page}) => {
  await page.goto('/ngx-lift/query/queryResource', {waitUntil: 'domcontentloaded'});

  await expect(page.locator('main h1')).toHaveText('queryResource');
});

test('data grid selection demo renders its native control @cross-browser-smoke', async ({page}) => {
  await page.goto('/clr-lift/components/datagrid-selection', {waitUntil: 'domcontentloaded'});

  await expect(
    page.getByTestId('selection-multiple').getByRole('checkbox', {name: 'Select Organization 1', exact: true}),
  ).toBeVisible();
});
