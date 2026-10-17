import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('feedback-layout documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/clr-lift/components/alert',
    '/clr-lift/components/callout',
    '/clr-lift/components/spinner',
    '/clr-lift/components/page-container',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
