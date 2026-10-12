import {expect, test} from '@playwright/test';

test.describe('IdleDetection component', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/clr-lift/components/idle-detection');
  });

  test('renders page title and overview', async ({page}) => {
    await expect(page.locator('h1')).toContainText('Idle Detection');
  });

  test('can start and stop fast simulation', async ({page}) => {
    const startBtn = page.getByRole('button', {name: 'Start Fast Simulation (3s Idle)', exact: true});
    await expect(startBtn).toBeVisible();

    await startBtn.click();

    // Verify simulation active
    await expect(page.locator('article').first()).toContainText('Simulation Active: Yes');

    const stopBtn = page.getByRole('button', {name: 'Stop Simulation', exact: true});
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();

    await expect(page.locator('article').first()).toContainText('Simulation Active: No');
  });
});
