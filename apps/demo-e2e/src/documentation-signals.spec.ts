import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('combineFrom keeps both values while mergeFrom exposes the latest emission', async ({page}) => {
  await page.goto('/ngx-lift/signals/combineFrom');
  const combined = page.getByTestId('combine-from-starter');
  await expect(combined.locator('output')).toHaveText('left: 1, right: 2');
  await combined.getByRole('button', {name: 'left + 1', exact: true}).click();
  await combined.getByRole('button', {name: 'right + 1', exact: true}).click();
  await expect(combined.locator('output')).toHaveText('left: 2, right: 3');
  await page.goto('/ngx-lift/signals/mergeFrom');
  const merged = page.getByTestId('merge-from-starter');
  await expect(merged.locator('output')).toHaveText('10');
  await merged.getByRole('button', {name: 'left + 1', exact: true}).click();
  await expect(merged.locator('output')).toHaveText('2');
  await merged.getByRole('button', {name: 'right + 10', exact: true}).click();
  await expect(merged.locator('output')).toHaveText('20');
});

test('createTrigger changes a derived revision on repeated refreshes', async ({page}) => {
  await page.goto('/ngx-lift/signals/createTrigger');
  const starter = page.getByTestId('create-trigger-starter');
  await expect(starter.locator('output')).toHaveText('1');
  for (const revision of [2, 3]) {
    await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
    await expect(starter.locator('output')).toHaveText(String(revision));
  }
});

test('route and query signals follow URL changes and missing values', async ({page}) => {
  await page.goto('/ngx-lift/signals/injectParams');
  const params = page.getByTestId('inject-params-starter');
  await expect(params.locator('output')).toHaveText('null → 1');
  await params.getByRole('link', {name: 'id = 2', exact: true}).click();
  await expect(page).toHaveURL(/injectParams\/2$/);
  await expect(params.locator('output')).toHaveText('2 → 2');
  await params.getByRole('link', {name: 'Clear', exact: true}).click();
  await expect(params.locator('output')).toHaveText('null → 1');
  await page.goto('/ngx-lift/signals/injectQueryParams');
  const query = page.getByTestId('inject-query-params-starter');
  await expect(query.locator('output')).toHaveText('null → 1');
  await query.getByRole('link', {name: 'page = 2', exact: true}).click();
  await expect(page).toHaveURL(/\?page=2$/);
  await expect(query.locator('output')).toHaveText('2 → 2');
  await query.getByRole('link', {name: 'Clear', exact: true}).click();
  await expect(query.locator('output')).toHaveText('null → 1');
});

test('signals documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/ngx-lift/signals/combineFrom',
    '/ngx-lift/signals/mergeFrom',
    '/ngx-lift/signals/createTrigger',
    '/ngx-lift/signals/injectParams',
    '/ngx-lift/signals/injectQueryParams',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
