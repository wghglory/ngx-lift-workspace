import {expect, test} from '@playwright/test';

test('stream behavior documentation fits a narrow screen and starts with a precise trace', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.setViewportSize({width: 390, height: 844});
  for (const route of ['distinctOnChange', 'logger', 'startWithTap']) {
    await page.goto('/ngx-lift/operators/' + route);
    await expect(page.locator('h1').first()).toHaveText(route);
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
  await expect(page.locator('app-code-block').first()).toContainText('trace');
});
