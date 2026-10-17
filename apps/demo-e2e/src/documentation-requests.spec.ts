import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('clr-lift-lang', 'en'));
});

test('both retry tutorials start with one fixed GET and a successful retry', async ({page}) => {
  for (const [route, slug] of [
    ['operators/k8sRetryBackoff', 'k8s-retry-backoff'],
    ['interceptors/k8sRetryBackoff', 'k8s-retry-backoff-interceptor'],
  ]) {
    await page.goto('/ngx-lift/' + route);
    const starter = page.getByTestId(slug + '-starter');
    await expect(page.locator('app-demo-playground').first()).toHaveAttribute('data-testid', slug + '-starter');
    await starter.getByRole('button', {name: 'Refresh', exact: true}).click();
    await expect(starter.locator('output')).toHaveText('resolved · 2');
  }
});

test('requests documentation fits a narrow screen and exposes its first source', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const route of [
    '/ngx-lift/operators/kubernetesPagination',
    '/ngx-lift/operators/k8sRetryBackoff',
    '/ngx-lift/interceptors/k8sRetryBackoff',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('app-code-block').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
});
