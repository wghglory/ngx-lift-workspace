import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

for (const [route, slug] of [
  ['createAsyncState', 'create-async-state'],
  ['switchMapWithAsyncState', 'switch-map-with-async-state'],
]) {
  test(route + ' cancels superseded reads and recovers after a failed read', async ({page}) => {
    await page.goto('/ngx-lift/operators/' + route);
    const starter = page.getByTestId(slug + '-starter');
    await expect(starter.locator('output')).toHaveText('resolved · 1');
    await starter.getByRole('button', {name: 'Next value', exact: true}).click();
    await starter.getByRole('button', {name: 'Next value', exact: true}).click();
    await expect(starter.locator('output')).toHaveText('resolved · 3');
    await starter.getByRole('button', {name: 'Simulate failure', exact: true}).click();
    await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
    await expect(starter.locator('cll-alert')).toContainText('Simulated read failure');
    await starter.getByRole('button', {name: 'Simulate failure', exact: true}).click();
    await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
    await expect(starter.locator('output')).toHaveText('resolved · 3');
    await expect(starter.locator('cll-alert')).toHaveCount(0);
  });
}

test('a silent Subject does not block the eager combined output', async ({page}) => {
  await page.goto('/ngx-lift/operators/combineLatestEager');
  const starter = page.getByTestId('combine-latest-eager-starter');
  await expect(starter.locator('output')).toHaveText('left: Atlas, right: null');
  await starter.getByRole('button', {name: 'right = Ready', exact: true}).click();
  await expect(starter.locator('output')).toHaveText('left: Atlas, right: Ready');
});

test('poll start, refresh, error recovery and stop share one visible poller', async ({page}) => {
  await page.goto('/ngx-lift/operators/poll');
  const starter = page.getByTestId('poll-starter');
  await starter.getByRole('button', {name: 'Start', exact: true}).click();
  await expect(starter.locator('output')).toHaveText('resolved · 1');
  await starter.getByRole('button', {name: 'Simulate failure', exact: true}).click();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(starter.locator('cll-alert')).toContainText('Simulated polling failure');
  await starter.getByRole('button', {name: 'Simulate failure', exact: true}).click();
  await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
  await expect(starter.locator('cll-alert')).toHaveCount(0);
  await expect(starter.locator('output')).toContainText('resolved');
  await starter.getByRole('button', {name: 'Stop', exact: true}).click();
  await expect(starter.locator('output')).toHaveCount(0);
});

test('async-streams documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/ngx-lift/operators/createAsyncState',
    '/ngx-lift/operators/poll',
    '/ngx-lift/operators/switchMapWithAsyncState',
    '/ngx-lift/operators/combineLatestEager',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
