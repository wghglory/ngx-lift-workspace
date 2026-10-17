import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('idle service begins on demand and requires explicit warning confirmation', async ({page}) => {
  await page.clock.install();
  await page.goto('/ngx-lift/utilities/idle-detection');
  const starter = page.getByTestId('idle-service-starter');
  await expect(starter.locator('output')).toHaveText('Stopped · —');
  await starter.getByRole('button', {name: 'Start Fast Simulation (3s Idle)', exact: true}).click();
  await page.clock.runFor(3100);
  await expect(starter.locator('output')).toContainText('Warning');
  await page.mouse.move(10, 10);
  await page.keyboard.press('Shift');
  await page.clock.runFor(1000);
  await expect(starter.locator('output')).toContainText('Warning');
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(starter.locator('output')).toHaveText('Active · —');
  await starter.getByRole('button', {name: 'Stop Simulation', exact: true}).click();
  await page.clock.runFor(15000);
  await expect(starter.locator('output')).toHaveText('Stopped · —');
  await starter.getByRole('button', {name: 'Start Fast Simulation (3s Idle)', exact: true}).click();
  await page.clock.runFor(13100);
  await expect(starter.locator('output')).toHaveText('Expired · 0');
});

test('lifecycle documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/clr-lift/components/certificate',
    '/clr-lift/components/idle-detection',
    '/clr-lift/components/theme-toggle',
    '/ngx-lift/utilities/idle-detection',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
