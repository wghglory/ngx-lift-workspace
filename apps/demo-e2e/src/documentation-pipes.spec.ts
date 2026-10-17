import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('pipe introductions display evaluated results before options', async ({page}) => {
  for (const [route, slug, output] of [
    ['array-join', 'array-join-pipe', 'Atlas, Beacon'],
    ['byte-converter', 'byte-converter-pipe', '1 KB'],
    ['is-https', 'is-https-pipe', 'true'],
    ['mask', 'mask-pipe', '1234********3456'],
    ['range', 'range-pipe', '[ 1, 2, 3, 4 ]'],
  ]) {
    await page.goto('/ngx-lift/pipes/' + route);
    await expect(page.getByTestId(slug + '-first-result').locator('output')).toHaveText(output);
  }
});

test('pipes documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/ngx-lift/pipes/array-join',
    '/ngx-lift/pipes/byte-converter',
    '/ngx-lift/pipes/is-https',
    '/ngx-lift/pipes/mask',
    '/ngx-lift/pipes/range',
    '/clr-lift/utilities/datagrid',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
