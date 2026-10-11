import {expect, test} from '@playwright/test';

test.describe('New ngx-lift demos', () => {
  test('startWithTap executes callback and displays loading state', async ({page}) => {
    await page.goto('/ngx-lift/operators/startWithTap');

    await expect(page.locator('h1')).toContainText('startWithTap');

    const triggerBtn = page.getByRole('button', {name: 'Trigger Request', exact: true});
    await expect(triggerBtn).toBeVisible();

    await triggerBtn.click();

    // Verify stream log updates
    const logSection = page.locator('article .space-y-1');
    await expect(logSection).toContainText('startWithTap executed on subscription');

    // Verify final loaded payload appears
    await expect(page.locator('article').first()).toContainText('Loaded payload: Alice (Administrator)');
  });

  test('kubernetesPagination fetches and aggregates paginated pods', async ({page}) => {
    await page.goto('/ngx-lift/operators/kubernetesPagination');

    await expect(page.locator('h1')).toContainText('kubernetesPagination');

    const fetchBtn = page.getByRole('button', {name: 'Fetch Paginated Pods', exact: true});
    await expect(fetchBtn).toBeVisible();

    await fetchBtn.click();

    // Verify aggregated pod table renders
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(5);

    // Verify first and last pod names
    await expect(table).toContainText('coredns-6f6b67-w211');
    await expect(table).toContainText('api-gateway-7b98d9-z894');
  });

  test('isPromise evaluates PromiseLike matrix accurately', async ({page}) => {
    await page.goto('/ngx-lift/utilities/is-promise');

    await expect(page.locator('h1')).toContainText('isPromise');

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check true labels and false labels
    const trueLabels = table.locator('.label-success');
    const falseLabels = table.locator('.label-danger');

    await expect(trueLabels).toHaveCount(3);
    await expect(falseLabels).toHaveCount(4);
  });
});
