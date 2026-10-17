import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('helper examples display evaluated boundary results', async ({page}) => {
  for (const [route, expected] of [
    ['difference-in-days', ['2', '0', '-2']],
    ['is-empty', ['true', 'false', 'true', 'true', 'false']],
    ['is-equal', ['true', 'false', 'true']],
  ]) {
    await page.goto('/ngx-lift/utilities/' + route);
    await expect(page.getByTestId(route + '-first-result').locator('tbody tr td:last-child')).toHaveText(expected);
  }
});

test('helpers documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/ngx-lift/utilities/difference-in-days',
    '/ngx-lift/utilities/is-empty',
    '/ngx-lift/utilities/is-equal',
    '/ngx-lift/utilities/is-promise',
    '/ngx-lift/utilities/pick-by',
    '/ngx-lift/utilities/url',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
