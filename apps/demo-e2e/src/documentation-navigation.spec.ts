import {expect, test} from '@playwright/test';

test('preloads documentation code without mounting inactive demos', async ({page}) => {
  const preloaded = new Set<string>();
  const destinations = [
    {selector: 'app-intersection-validator', path: '/ngx-lift/validators/intersection'},
    {selector: 'app-kubernetes-pagination', path: '/ngx-lift/operators/kubernetesPagination'},
    {selector: 'app-k8s-retry-backoff', path: '/ngx-lift/operators/k8sRetryBackoff'},
    {selector: 'app-start-with-tap', path: '/ngx-lift/operators/startWithTap'},
    {selector: 'app-clr-lift-home', path: '/clr-lift'},
  ];
  page.on('response', async (response) => {
    if (!response.ok() || !new URL(response.url()).pathname.endsWith('.js')) return;
    const source = await response.text().catch(() => '');
    for (const {selector} of destinations) {
      if (source.includes(selector)) preloaded.add(selector);
    }
  });

  await page.goto('/ngx-lift/validators/date-range');
  await expect(page.getByTestId('date-range-validator-starter')).toBeVisible();
  for (const {selector} of destinations) {
    // Check the cause of the network delay rather than a machine-dependent timing budget.
    await expect.poll(() => preloaded.has(selector)).toBe(true);
    await expect(page.locator(selector)).toHaveCount(0);
  }

  for (const {selector, path} of destinations) {
    await page.locator(`a[href="${path}"]`).first().click();
    await expect(page.locator(selector)).toBeVisible();
    await page.goBack();
    await expect(page.getByTestId('date-range-validator-starter')).toBeVisible();
  }
});
