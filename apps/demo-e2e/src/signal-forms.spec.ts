import {expect, test} from '@playwright/test';

test.describe('toSignalForm signal-driven forms', () => {
  test('synchronizes form controls and updates live state panel', async ({page}) => {
    await page.goto('/ngx-lift/signals/toSignalForm');

    // Check region select
    const regionSelect = page.locator('#region-select');
    await expect(regionSelect).toBeVisible();

    // Select US West region
    await regionSelect.selectOption('us-west-1');

    // Verify helper badge updates
    await expect(page.locator('.label.label-success', {hasText: 'Multi-Zone HA Supported'})).toBeVisible();

    // Select postgres engine
    const pgRadio = page.locator('#engine-pg');
    await page.locator('label[for="engine-pg"]').click();
    await expect(pgRadio).toBeChecked();

    // Fill cluster name input
    const clusterNameInput = page.locator('#cluster-name-input');
    await clusterNameInput.fill('production-cluster');
    await expect(clusterNameInput).toHaveValue('production-cluster');
  });
});
