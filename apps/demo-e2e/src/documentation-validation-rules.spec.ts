import {expect, test} from '@playwright/test';

test.use({timezoneId: 'America/Los_Angeles'});

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('the first URL task succeeds without the later HTTPS example', async ({page}) => {
  await page.goto('/ngx-lift/validators/url');
  const starter = page.getByTestId('url-validator-starter');
  const input = starter.locator('input');
  await input.fill('not a url');
  await input.blur();
  await expect(starter.locator('output')).toHaveText('INVALID');
  await input.fill('https://example.com');
  await input.blur();
  await expect(starter.locator('output')).toHaveText('VALID');
  await starter.getByRole('button', {name: 'Clear', exact: true}).click();
  await expect(input).toHaveValue('');
  await expect(starter.locator('output')).toHaveText('INVALID');
});

test('overlapping namespace selections can be corrected and cleared', async ({page}) => {
  await page.goto('/ngx-lift/validators/intersection');
  const starter = page.getByTestId('intersection-validator-starter');
  await starter.locator('#intersection-included').selectOption(['default']);
  await starter.locator('#intersection-excluded').selectOption(['default']);
  await expect(starter.locator('cll-alert')).toBeVisible();
  await starter.locator('#intersection-excluded').selectOption(['kube-system']);
  await expect(starter.locator('cll-alert')).toHaveCount(0);
  await expect(starter.locator('output')).toHaveText('VALID');
  await starter.getByRole('button', {name: 'Clear', exact: true}).click();
  await expect(starter.locator('output')).toHaveText('INVALID');
});

test('validation-rules documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/ngx-lift/validators/date-range',
    '/ngx-lift/validators/intersection',
    '/ngx-lift/validators/url',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});

test('date bounds allow correction within the inclusive window and reject clearing', async ({page}) => {
  await page.goto('/ngx-lift/validators/date-range');
  const starter = page.getByTestId('date-range-validator-starter');
  const input = starter.locator('#date-starter-date');
  await expect(input).toHaveAttribute('min', /^\d{4}-\d{2}-\d{2}$/);
  const min = await input.getAttribute('min');
  if (!min) throw new Error('The first date example must expose its minimum date');
  await input.fill('2000-01-01');
  await input.blur();
  await expect(starter.locator('output')).toHaveText('INVALID');
  await input.fill(min);
  await input.blur();
  await expect(starter.locator('output')).toHaveText('VALID');
  await expect(input).toHaveAttribute('max', /^\d{4}-\d{2}-\d{2}$/);
  const max = await input.getAttribute('max');
  if (!max) throw new Error('The date example must expose its maximum date');
  await input.fill(max);
  await input.blur();
  await expect(starter.locator('output')).toHaveText('VALID');
  await starter.getByRole('button', {name: 'Clear', exact: true}).click();
  await expect(starter.locator('output')).toHaveText('INVALID');
});
