import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('conditional validation removes only the conditional required rule', async ({page}) => {
  await page.goto('/ngx-lift/validators/if');
  const starter = page.getByTestId('if-validator-starter');
  await starter.locator('input[value="UNLIKE"]').check();
  await expect(starter.locator('output')).toHaveText('INVALID');
  await starter.locator('#if-email').fill('reader@example.com');
  await starter.locator('#if-reason').fill('Needs documentation');
  await expect(starter.locator('output')).toHaveText('VALID');
  await starter.locator('#if-email').fill('invalid');
  await starter.locator('input[value="LIKE"]').check();
  await expect(starter.locator('output')).toHaveText('INVALID');
  await starter.locator('#if-email').fill('');
  await expect(starter.locator('output')).toHaveText('VALID');
  await starter.getByRole('button', {name: 'Clear', exact: true}).click();
  await expect(starter.locator('output')).toHaveText('INVALID');
});

test('unique values expose duplicate input and correction', async ({page}) => {
  await page.goto('/ngx-lift/validators/unique');
  const starter = page.getByTestId('unique-validator-starter');
  const first = starter.locator('#unique-control-0');
  const second = starter.locator('#unique-control-1');
  await first.fill('Atlas');
  await second.fill('Atlas');
  await second.blur();
  await expect(starter.locator('output')).toHaveText('INVALID');
  await second.fill('Beacon');
  await second.blur();
  await expect(starter.locator('output')).toHaveText('VALID');
});

test('form-inputs documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of ['/clr-lift/components/file-reader', '/ngx-lift/validators/if', '/ngx-lift/validators/unique']) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
