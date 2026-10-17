import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('status can be changed with the keyboard before the mapping catalog', async ({page}) => {
  await page.goto('/clr-lift/components/status-indicator');
  const starter = page.getByTestId('status-indicator-demo-starter');
  const success = starter.getByRole('button', {name: 'Success', exact: true});
  await success.focus();
  await page.keyboard.press('Enter');
  await expect(starter.locator('cll-status-indicator')).toContainText('success');
  await starter.getByRole('button', {name: 'Error', exact: true}).click();
  await expect(starter.locator('cll-status-indicator')).toContainText('error');
});

test('feedback documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/clr-lift/components/toast',
    '/clr-lift/components/multi-alerts',
    '/clr-lift/components/status-indicator',
    '/clr-lift/components/tooltip',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
