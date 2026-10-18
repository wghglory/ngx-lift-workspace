import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
  await page.route('https://randomuser.me/api**', (route) => {
    if (route.request().url().includes('invalid-endpoint'))
      return route.fulfill({status: 503, json: {message: 'Unavailable'}});
    const params = new URL(route.request().url()).searchParams;
    const page = Number(params.get('page') ?? 1);
    return route.fulfill({
      json: {
        results: Array.from({length: Number(params.get('results') ?? 1)}, (_, index) => ({
          id: {name: 'fixture', value: `${page}-${index}`},
          name: {title: 'Mx', first: 'Reader', last: `Page ${page}`},
          gender: 'female',
          email: 'reader@example.test',
          phone: '',
          cell: '',
          picture: {large: '/user-fallback.svg', medium: '/user-fallback.svg', thumbnail: '/user-fallback.svg'},
        })),
        info: {page, results: 10, total: 100},
      },
    });
  });
});

test('computedAsync starts with a working derivation and follows repeated input changes', async ({page}) => {
  await page.goto('/ngx-lift/signals/computedAsync');
  const starter = page.getByTestId('computed-starter');
  await expect(page.locator('app-demo-playground').first()).toHaveAttribute('data-testid', 'computed-starter');
  await expect(starter.getByRole('status')).toHaveText('1 → 10');
  await starter.getByRole('button', {name: 'Next value', exact: true}).click();
  await expect(starter.getByRole('status')).toHaveText('2 → 20');
  await starter.getByRole('button', {name: 'Next value', exact: true}).click();
  await expect(starter.getByRole('status')).toHaveText('3 → 30');
  await starter.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(starter.locator('app-code-block')).toContainText('starterValue()');
});

test('resourceAsync guides the reader from reactive reads to recipes and reference', async ({page}) => {
  await page.goto('/ngx-lift/signals/resourceAsync');
  const starter = page.getByTestId('resource-starter');
  await expect(starter.locator('app-user-card')).toContainText('Page 1');
  await starter.getByRole('button', {name: 'User 2', exact: true}).click();
  await expect(starter.locator('app-user-card')).toContainText('Page 2');
  await starter.getByRole('button', {name: 'User 3', exact: true}).click();
  await expect(starter.locator('app-user-card')).toContainText('Page 3');
  await page.getByRole('tab', {name: 'Practical recipes', exact: true}).click();
  const fallback = page
    .locator('app-demo-playground')
    .filter({has: page.getByRole('button', {name: 'Trigger Request (will fallback)', exact: true})});
  await fallback.getByRole('button', {name: 'Trigger Request (will fallback)', exact: true}).click();
  await expect(fallback.locator('app-user-card')).toContainText('Fallback User');
  for (const tab of ['Local state', 'Nested resources', 'Reference', 'Basics']) {
    await page.getByRole('tab', {name: tab, exact: true}).click();
    await expect(page.getByRole('tabpanel', {name: tab, exact: true})).toBeVisible();
  }
  await expect(starter.locator('app-user-card')).toContainText('Page 3');
});

test('dgState presents a working grid before its data-shape and reference walkthrough', async ({page}) => {
  await page.goto('/clr-lift/operators/dgState', {waitUntil: 'domcontentloaded'});
  const starter = page.getByTestId('datagrid-starter');
  const grid = starter.locator('clr-datagrid');
  await expect(grid.locator('clr-dg-row')).toHaveCount(10);
  const request = page.waitForRequest((req) => req.url().startsWith('https://randomuser.me/api'));
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await request;
  await expect(grid.locator('clr-dg-row')).toHaveCount(10);
  await starter.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(starter.locator('app-code-block')).toContainText('(clrDgRefresh)');
  expect(
    await page
      .locator('app-code-block')
      .first()
      .evaluate((code) => code.closest('app-demo-playground') !== null),
  ).toBe(true);
});

test('wizard preview precedes its step walkthrough and has separate HTML source', async ({page}) => {
  await page.goto('/clr-lift/components/timeline-wizard', {waitUntil: 'domcontentloaded'});
  const starter = page.getByTestId('wizard-starter');
  const wizard = starter.locator('cll-timeline-wizard');
  await expect(wizard).toBeVisible();
  await wizard.getByRole('button', {name: 'Next', exact: true}).click();
  await expect(wizard.locator('app-configure-service')).toBeVisible();
  await wizard.getByRole('button', {name: 'Previous', exact: true}).click();
  await expect(wizard.locator('app-configure-operator')).toBeVisible();
  await starter.getByRole('button', {name: 'HTML', exact: true}).click();
  await expect(starter.locator('app-code-block')).toContainText('<cll-timeline-wizard');
  expect(
    await page
      .locator('app-code-block')
      .first()
      .evaluate((code) => code.closest('[data-testid="wizard-starter"]') !== null),
  ).toBe(true);
});

for (const route of [
  '/ngx-lift/signals/resourceAsync',
  '/ngx-lift/signals/computedAsync',
  '/ngx-lift/signals/toSignalForm',
  '/clr-lift/operators/dgState',
  '/clr-lift/components/timeline-wizard',
  '/clr-lift/components/key-value-inputs',
]) {
  test(`learning preview remains reachable on narrow screens: ${route}`, async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(route);
    await expect(page.locator('app-demo-playground').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
